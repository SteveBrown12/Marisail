
import bcrypt from 'bcryptjs';
import { Router } from "express";
import jwt from 'jsonwebtoken';
import dbConnection from "../config/dbConfig.js";
import { checkJwt } from "../middleware/auth0.js";
import emailService from "../services/emailService.js";
import smsService from "../services/smsService.js";


const authRouter = Router();

/**
 * Legacy credentials-based registration.
 * This keeps local user creation for the legacy flow.
 * When using Auth0, prefer calling POST /auth/sync after login instead of this route.
 */
authRouter.post("/register", async (req, res) => {
    try {
        const { firstName, lastName, email, password, phone } = req.body;
        const pool = await dbConnection.getConnection();
        const [existingUser] = await pool.query('SELECT * FROM Contact_Details WHERE email = ?', [email]);
        if (existingUser.length > 0) {
            return res.status(400).json({ message: "Email already registered." });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        await pool.query(
            'INSERT INTO Contact_Details (first_name, last_name, email, password, phone) VALUES (?, ?, ?, ?, ?)',
            [firstName, lastName, email, hashedPassword, phone || null]
        );
        // Get the new user's ID
        const [userRows] = await pool.query('SELECT * FROM Contact_Details WHERE email = ?', [email]);
        const user = userRows[0];

        // Create a JWT token (legacy, not Auth0)
        const token = jwt.sign(
            { id: user.id, email: user.email },
            JWT_SECRET,
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

        // Send welcome SMS if phone number is provided
        if (phone) {
            try {
                await smsService.sendWelcomeSMS({
                    phone: phone,
                    firstName: user.first_name
                });
            } catch (smsError) {
                console.error('Failed to send welcome SMS:', smsError);
                // Don't fail the registration if SMS fails
            }
        }

        res.status(201).json({
            message: "User registered successfully.",
            token,
            user: {
                id: user.id,
                email: user.email,
                firstName: user.first_name,
                lastName: user.last_name,
                phone: user.phone
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
 * Auth0 flow: Upsert user into our local DB after Auth0 login.
 * Frontend calls this once after obtaining an Auth0 access token.
 *
 * Source of truth for identity is Auth0; our DB keeps a profile row keyed by email.
 * If your schema allows, consider adding an `auth0_sub` column to map stable Auth0 subject IDs.
 */
authRouter.post("/sync", checkJwt, async (req, res) => {
    try {
        // req.auth contains verified token claims from Auth0
        // express-jwt puts claims on req.auth
        const claims = req.auth || {};
        const email = claims.email; // usually present if connection provides verified email
        const givenName = claims.given_name;
        const familyName = claims.family_name;
        const fullName = claims.name;
        const phoneNumber = claims.phone_number; // if available from Auth0

        if (!email) {
            return res.status(400).json({ message: "Email claim missing from token; cannot sync user." });
        }

        // Derive first/last name if only full name is available
        let firstName = givenName;
        let lastName = familyName;
        if ((!firstName || !lastName) && fullName) {
            const parts = String(fullName).trim().split(/\s+/);
            firstName = firstName || parts[0] || '';
            lastName = lastName || (parts.length > 1 ? parts.slice(1).join(' ') : '');
        }

        const pool = await dbConnection.getConnection();

        // Check if user already exists by email
        const [existing] = await pool.query('SELECT * FROM Contact_Details WHERE email = ?', [email]);
        const isNewUser = existing.length === 0;
        
        if (isNewUser) {
            // Insert a new user row. No local password needed for Auth0 users; use NULL or empty string depending on schema.
            await pool.query(
                'INSERT INTO Contact_Details (first_name, last_name, email, password, phone) VALUES (?, ?, ?, ?, ?)',
                [firstName || '', lastName || '', email, '', phoneNumber || null]
            );
        } else {
            // Optionally keep profile fields in sync (non-destructive update)
            const user = existing[0];
            const updatedFirst = firstName || user.first_name || '';
            const updatedLast = lastName || user.last_name || '';
            const updatedPhone = phoneNumber || user.phone || null;
            
            if (updatedFirst !== user.first_name || updatedLast !== user.last_name || updatedPhone !== user.phone) {
                await pool.query(
                    'UPDATE Contact_Details SET first_name = ?, last_name = ?, phone = ? WHERE email = ?',
                    [updatedFirst, updatedLast, updatedPhone, email]
                );
            }
        }

        // Send welcome email for new users
        if (isNewUser) {
            try {
                await emailService.sendWelcomeEmail({
                    email: email,
                    firstName: firstName || 'there',
                    siteUrl: process.env.SITE_URL || 'https://marisail.com'
                });
            } catch (emailError) {
                console.error('Failed to send welcome email:', emailError);
                // Don't fail the sync if email fails
            }
        }

        // Send welcome SMS for new users if phone number is available
        if (isNewUser && phoneNumber) {
            try {
                await smsService.sendWelcomeSMS({
                    phone: phoneNumber,
                    firstName: firstName || 'there'
                });
            } catch (smsError) {
                console.error('Failed to send welcome SMS:', smsError);
                // Don't fail the sync if SMS fails
            }
        }

        // Return the db row to the client
        const [rows] = await pool.query('SELECT id, first_name, last_name, email, phone FROM Contact_Details WHERE email = ?', [email]);
        const localUser = rows[0];

        return res.status(200).json({ ok: true, user: localUser, isNewUser });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Something went wrong." });
    }
});

/**
 * Update user profile with additional information after Auth0 registration
 * This allows users to add phone numbers and other details after initial Auth0 signup
 */
authRouter.put("/profile", checkJwt, async (req, res) => {
    try {
        const claims = req.auth || {};
        const email = claims.email;
        const { phone, firstName, lastName, preferences } = req.body;

        if (!email) {
            return res.status(400).json({ message: "Email claim missing from token." });
        }

        const pool = await dbConnection.getConnection();
        
        // Update user profile
        const updateFields = [];
        const updateValues = [];
        
        if (phone !== undefined) {
            updateFields.push('phone = ?');
            updateValues.push(phone);
        }
        
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
        
        // Send welcome SMS if phone number was added
        if (phone && phone !== '') {
            try {
                await smsService.sendWelcomeSMS({
                    phone: phone,
                    firstName: firstName || claims.given_name || claims.name?.split(' ')[0] || 'there'
                });
            } catch (smsError) {
                console.error('Failed to send welcome SMS:', smsError);
                // Don't fail the profile update if SMS fails
            }
        }
        
        // Return updated user
        const [rows] = await pool.query('SELECT id, first_name, last_name, email, phone FROM Contact_Details WHERE email = ?', [email]);
        const updatedUser = rows[0];
        
        return res.status(200).json({ 
            ok: true, 
            message: "Profile updated successfully",
            user: updatedUser 
        });
        
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Something went wrong." });
    }
});

// Auth0-protected endpoint
authRouter.get("/me", checkJwt, async (req, res) => {
    try {
        // req.auth contains verified claims from Auth0 token
        return res.json({ ok: true, user: req.auth });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Something went wrong." });
    }
});

export default authRouter;