
import bcrypt from 'bcryptjs';
import { Router } from "express";
import jwt from 'jsonwebtoken';
import dbConnection from "../config/dbConfig.js";
import { checkJwt } from "../middleware/auth0.js";
import emailService from "../services/emailService.js";
import smsService from "../services/smsService.js";


const authRouter = Router();

/**
 * Middleware to ensure user exists in local DB
 * Call this before routes that need a local user record
 */
const ensureUserExists = async (req, res, next) => {
    try {
        const claims = req.auth || {};
        const email = claims.email;
        
        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Email claim required"
            });
        }
        
        const pool = await dbConnection.getConnection();
        
        try {
            // Check if user exists
            const [users] = await pool.query('SELECT * FROM Contact_Details WHERE email = ?', [email]);
            
            if (users.length === 0) {
                // Create user automatically
                const firstName = claims.given_name || claims.name?.split(' ')[0] || 'User';
                const lastName = claims.family_name || claims.name?.split(' ').slice(1).join(' ') || '';
                
                await pool.query(
                    'INSERT INTO Contact_Details (first_name, last_name, email, password) VALUES (?, ?, ?, ?)',
                    [firstName, lastName, email, '']
                );
                
                console.log('Auto-created user for:', email);
            }
            
            // Add user info to request for downstream routes
            req.localUser = users[0] || { email };
            next();
            
        } finally {
            pool.release();
        }
        
    } catch (error) {
        console.error('Ensure user exists error:', error);
        return res.status(500).json({
            success: false,
            message: "Failed to ensure user exists"
        });
    }
};

/**
 * Legacy credentials-based registration.
 * This keeps local user creation for the legacy flow.
 * When using Auth0, prefer calling POST /auth/sync after login instead of this route.
 */
authRouter.post("/register", async (req, res) => {
    try {
        const { firstName, lastName, email, password } = req.body;
        const pool = await dbConnection.getConnection();
        const [existingUser] = await pool.query('SELECT * FROM Contact_Details WHERE email = ?', [email]);
        if (existingUser.length > 0) {
            return res.status(400).json({ message: "Email already registered." });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        await pool.query(
            'INSERT INTO Contact_Details (first_name, last_name, email, password) VALUES (?, ?, ?, ?)',
            [firstName, lastName, email, hashedPassword]
        );
        // Get the new user's ID
        const [userRows] = await pool.query('SELECT * FROM Contact_Details WHERE email = ?', [email]);
        const user = userRows[0];

        // Create a JWT token (legacy, not Auth0)
        const token = jwt.sign(
            { id: user.id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        // Send welcome email
        try {
            await emailService.sendWelcomeEmail({
                email: user.email,
                firstName: user.first_name,
                siteUrl: process.env.SITE_URL || 'https://marisail.com'
            });
        } catch (emailError) {
            console.error('Failed to send welcome email:', emailError);
            // Don't fail the registration if email fails
        }



        res.status(201).json({
            message: "User registered successfully.",
            token,
            user: {
                id: user.id,
                email: user.email,
                firstName: user.first_name,
                lastName: user.last_name
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Something went wrong." });
    }
});

/**
 * Legacy credentials-based login that returns a local JWT.
 * When using Auth0, clients should not call this route; instead they obtain
 * an Auth0 access token and call Auth0-protected routes.
 */
authRouter.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const pool = await dbConnection.getConnection();

        const [users] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
        if (users.length === 0) {
            return res.status(400).json({ message: "Invalid credentials." });
        }

        const user = users[0];

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials." });
        }

        const token = jwt.sign(
            { id: user.id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        res.json({ message: "Login successful", token, user: { id: user.id, email: user.email, firstName: user.first_name, lastName: user.last_name } });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Something went wrong." });
    }
});

/**
 * Simplified user management: Create or update user in local DB
 * This replaces the problematic Auth0 sync approach
 */
authRouter.post("/sync", checkJwt, async (req, res) => {
    try {
        const claims = req.auth || {};
        console.log('Processing user sync with claims:', JSON.stringify(claims, null, 2));
        
        // Get basic user info - we'll work with what we have
        const sub = claims.sub; // Auth0 user ID - always present
        const email = claims.email || claims['https://marisail.com/email'] || claims['https://marisail.us.auth0.com/email'];
        const givenName = claims.given_name || claims['https://marisail.com/given_name'] || claims['https://marisail.us.auth0.com/given_name'];
        const familyName = claims.family_name || claims['https://marisail.com/family_name'] || claims['https://marisail.us.auth0.com/family_name'];
        const fullName = claims.name || claims['https://marisail.com/name'] || claims['https://marisail.us.auth0.com/name'];
        
        // If no email, we can't proceed - email is required for user identification
        if (!email) {
            console.log('No email found in claims, available keys:', Object.keys(claims));
            return res.status(400).json({
                message: "Email is required for user sync. Please ensure your Auth0 application includes email scope.",
                availableClaims: Object.keys(claims),
                suggestion: "Check Auth0 application settings and ensure email scope is enabled"
            });
        }
        
        // Derive names from available information
        let firstName = givenName || '';
        let lastName = familyName || '';
        
        if ((!firstName || !lastName) && fullName) {
            const nameParts = String(fullName).trim().split(/\s+/);
            firstName = firstName || nameParts[0] || '';
            lastName = lastName || (nameParts.length > 1 ? nameParts.slice(1).join(' ') : '');
        }
        
        // Ensure we have at least some name information
        if (!firstName && !lastName) {
            firstName = 'User';
            lastName = email.split('@')[0]; // Use email prefix as fallback name
        }
        
        const pool = await dbConnection.getConnection();
        
        try {
            // Check if user already exists by email
            const [existingUsers] = await pool.query('SELECT * FROM Contact_Details WHERE email = ?', [email]);
            const isNewUser = existingUsers.length === 0;
            
            if (isNewUser) {
                // Create new user
                console.log('Creating new user with email:', email);
                await pool.query(
                    'INSERT INTO Contact_Details (first_name, last_name, email, password) VALUES (?, ?, ?, ?)',
                    [firstName, lastName, email, ''] // No password for Auth0 users
                );
                console.log('New user created successfully');
            } else {
                // Update existing user with latest info from Auth0
                const existingUser = existingUsers[0];
                console.log('Updating existing user:', existingUser.id);
                
                const updateFields = [];
                const updateValues = [];
                
                if (firstName && firstName !== existingUser.first_name) {
                    updateFields.push('first_name = ?');
                    updateValues.push(firstName);
                }
                
                if (lastName && lastName !== existingUser.last_name) {
                    updateFields.push('last_name = ?');
                    updateValues.push(lastName);
                }
                
                if (updateFields.length > 0) {
                    updateValues.push(email);
                    const updateQuery = `UPDATE Contact_Details SET ${updateFields.join(', ')} WHERE email = ?`;
                    await pool.query(updateQuery, updateValues);
                    console.log('User updated successfully');
                }
            }
            
            // Get the final user data
            const [userRows] = await pool.query(
                'SELECT id, first_name, last_name, email, phone FROM Contact_Details WHERE email = ?', 
                [email]
            );
            
            const user = userRows[0];
            
            // Send welcome email for new users (non-blocking)
            if (isNewUser) {
                try {
                    await emailService.sendWelcomeEmail({
                        email: email,
                        firstName: firstName,
                        siteUrl: process.env.SITE_URL || 'https://marisail.com'
                    });
                    console.log('Welcome email sent successfully');
                } catch (emailError) {
                    console.error('Welcome email failed (non-critical):', emailError);
                }
            }
            
            return res.status(200).json({
                success: true,
                message: isNewUser ? "User created successfully" : "User updated successfully",
                user: user,
                isNewUser: isNewUser
            });
            
        } finally {
            pool.release();
        }
        
    } catch (error) {
        console.error('User sync error:', error);
        return res.status(500).json({
            success: false,
            message: "Failed to sync user",
            error: error.message
        });
    }
});

/**
 * Update user profile with additional information after Auth0 registration
 * This allows users to add phone numbers and other details after initial Auth0 signup
 */
authRouter.put("/profile", checkJwt, ensureUserExists, async (req, res) => {
    try {
        const claims = req.auth || {};
        const email = claims.email;
        const { firstName, lastName, preferences } = req.body;

        if (!email) {
            return res.status(400).json({ message: "Email claim missing from token." });
        }

        const pool = await dbConnection.getConnection();
        
        try {
            // Update user profile
            const updateFields = [];
            const updateValues = [];
            

            
            if (firstName !== undefined) {
                updateFields.push('first_name = ?');
                updateValues.push(firstName);
            }
            
            if (lastName !== undefined) {
                updateFields.push('last_name = ?');
                updateValues.push(lastName);
            }
            
            if (updateFields.length === 0) {
                return res.status(400).json({ message: "No fields to update." });
            }
            
            updateValues.push(email);
            
            const updateQuery = `UPDATE Contact_Details SET ${updateFields.join(', ')} WHERE email = ?`;
            await pool.query(updateQuery, updateValues);
            

            
            // Return updated user
            const [rows] = await pool.query('SELECT id, first_name, last_name, email FROM Contact_Details WHERE email = ?', [email]);
            const updatedUser = rows[0];
            
            return res.status(200).json({ 
                success: true, 
                message: "Profile updated successfully",
                user: updatedUser 
            });
            
        } finally {
            pool.release();
        }
        
    } catch (error) {
        console.error('Profile update error:', error);
        return res.status(500).json({ 
            success: false,
            message: "Failed to update profile",
            error: error.message
        });
    }
});

/**
 * Simple user creation route - alternative to sync
 * Can be called directly after Auth0 login
 */
authRouter.post("/create-user", checkJwt, async (req, res) => {
    try {
        const claims = req.auth || {};
        const { email, firstName, lastName } = req.body;
        
        // Use provided data or fall back to token claims
        const userEmail = email || claims.email;
        const userFirstName = firstName || claims.given_name || claims.name?.split(' ')[0] || 'User';
        const userLastName = lastName || claims.family_name || claims.name?.split(' ').slice(1).join(' ') || '';
        
        if (!userEmail) {
            return res.status(400).json({
                success: false,
                message: "Email is required"
            });
        }
        
        const pool = await dbConnection.getConnection();
        
        try {
            // Check if user exists
            const [existingUsers] = await pool.query('SELECT * FROM Contact_Details WHERE email = ?', [userEmail]);
            
            if (existingUsers.length > 0) {
                // User exists, return existing data
                const existingUser = existingUsers[0];
                return res.status(200).json({
                    success: true,
                    message: "User already exists",
                    user: existingUser,
                    isNewUser: false
                });
            }
            
            // Create new user
            await pool.query(
                'INSERT INTO Contact_Details (first_name, last_name, email, password) VALUES (?, ?, ?, ?)',
                [userFirstName, userLastName, userEmail, '']
            );
            
            // Get the created user
            const [newUserRows] = await pool.query(
                'SELECT id, first_name, last_name, email FROM Contact_Details WHERE email = ?', 
                [userEmail]
            );
            
            const newUser = newUserRows[0];
            
            // Send welcome email (non-blocking)
            try {
                await emailService.sendWelcomeEmail({
                    email: userEmail,
                    firstName: userFirstName,
                    siteUrl: process.env.SITE_URL || 'https://marisail.com'
                });
            } catch (emailError) {
                console.error('Welcome email failed:', emailError);
            }
            
            return res.status(201).json({
                success: true,
                message: "User created successfully",
                user: newUser,
                isNewUser: true
            });
            
        } finally {
            pool.release();
        }
        
    } catch (error) {
        console.error('Create user error:', error);
        return res.status(500).json({
            success: false,
            message: "Failed to create user",
            error: error.message
        });
    }
});

/**
 * Get current user from local DB
 */
authRouter.get("/me", checkJwt, ensureUserExists, async (req, res) => {
    try {
        const claims = req.auth || {};
        const email = claims.email;
        
        const pool = await dbConnection.getConnection();
        
        try {
            const [users] = await pool.query(
                'SELECT id, first_name, last_name, email FROM Contact_Details WHERE email = ?', 
                [email]
            );
            
            if (users.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: "User not found in local database"
                });
            }
            
            return res.json({
                success: true,
                user: users[0]
            });
            
        } finally {
            pool.release();
        }
        
    } catch (error) {
        console.error('Get user error:', error);
        return res.status(500).json({
            success: false,
            message: "Failed to get user"
        });
    }
});

// Debug endpoint to test token without requiring email
authRouter.get("/debug-token", checkJwt, async (req, res) => {
    try {
        const claims = req.auth || {};
        console.log('Debug token endpoint - All claims:', JSON.stringify(claims, null, 2));
        
        return res.json({
            ok: true,
            message: "Token debug info",
            hasEmail: !!claims.email,
            hasGivenName: !!claims.given_name,
            hasFamilyName: !!claims.family_name,
            hasName: !!claims.name,
            allClaims: claims,
            claimKeys: Object.keys(claims)
        });
    } catch (error) {
        console.error('Debug token error:', error);
        res.status(500).json({ message: "Something went wrong." });
    }
});

// Configuration check endpoint
authRouter.get("/config", (req, res) => {
    try {
        return res.json({
            ok: true,
            message: "Auth0 configuration check",
            domain: process.env.AUTH0_DOMAIN,
            audience: process.env.AUTH0_AUDIENCE,
            hasDomain: !!process.env.AUTH0_DOMAIN,
            hasAudience: !!process.env.AUTH0_AUDIENCE,
            suggestion: "Ensure AUTH0_DOMAIN and AUTH0_AUDIENCE are set in your .env file"
        });
    } catch (error) {
        console.error('Config check error:', error);
        res.status(500).json({ message: "Something went wrong." });
    }
});

// Test endpoint for the new user management system
authRouter.get("/test", checkJwt, ensureUserExists, (req, res) => {
    try {
        return res.json({
            success: true,
            message: "User management system is working!",
            user: req.localUser,
            authClaims: req.auth
        });
    } catch (error) {
        console.error('Test endpoint error:', error);
        return res.status(500).json({ 
            success: false,
            message: "Test failed",
            error: error.message
        });
    }
});

export default authRouter;