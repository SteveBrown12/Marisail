import { Router } from "express";
import emailService from "../services/emailService.js";

const emailTestRouter = Router();

/**
 * Test route to send a welcome email
 * POST /api/email-test/welcome
 */
emailTestRouter.get("/welcome", async (req, res) => {
    try {
        // const { email, firstName } = req.body;
        const { email, firstName } = { email: 'afnanferdousi550@gmail.com', firstName: 'Test User' };
        
        if (!email) {
            return res.status(400).json({ message: "Email is required" });
        }

        const result = await emailService.sendWelcomeEmail({
            email: email,
            firstName: firstName || 'Test User',
            siteUrl: 'https://marisail.com'
        });

        if (result.success) {
            res.json({ 
                message: "Welcome email sent successfully", 
                messageId: result.messageId 
            });
        } else {
            res.status(500).json({ 
                message: "Failed to send welcome email", 
                error: result.error 
            });
        }
    } catch (error) {
        console.error('Welcome email test error:', error);
        res.status(500).json({ message: "Something went wrong" });
    }
});

/**
 * Test route to send a password reset email
 * POST /api/email-test/password-reset
 */
emailTestRouter.post("/password-reset", async (req, res) => {
    try {
        const { email, firstName, resetUrl } = req.body;
        
        if (!email || !resetUrl) {
            return res.status(400).json({ 
                message: "Email and resetUrl are required" 
            });
        }

        const result = await emailService.sendPasswordResetEmail({
            email: email,
            firstName: firstName || 'Test User',
            resetUrl: resetUrl
        });

        if (result.success) {
            res.json({ 
                message: "Password reset email sent successfully", 
                messageId: result.messageId 
            });
        } else {
            res.status(500).json({ 
                message: "Failed to send password reset email", 
                error: result.error 
            });
        }
    } catch (error) {
        console.error('Password reset email test error:', error);
        res.status(500).json({ message: "Something went wrong" });
    }
});

/**
 * Test route to send a listing notification email
 * POST /api/email-test/listing-notification
 */
emailTestRouter.post("/listing-notification", async (req, res) => {
    try {
        const { email, firstName, listingData } = req.body;
        
        if (!email || !listingData) {
            return res.status(400).json({ 
                message: "Email and listingData are required" 
            });
        }

        const result = await emailService.sendListingNotificationEmail(
            {
                email: email,
                firstName: firstName || 'Test User'
            },
            listingData
        );

        if (result.success) {
            res.json({ 
                message: "Listing notification email sent successfully", 
                messageId: result.messageId 
            });
        } else {
            res.status(500).json({ 
                message: "Failed to send listing notification email", 
                error: result.error 
            });
        }
    } catch (error) {
        console.error('Listing notification email test error:', error);
        res.status(500).json({ message: "Something went wrong" });
    }
});

/**
 * Test route to send a contact form notification
 * POST /api/email-test/contact-form
 */
emailTestRouter.post("/contact-form", async (req, res) => {
    try {
        const { adminEmail, formData } = req.body;
        
        if (!adminEmail || !formData) {
            return res.status(400).json({ 
                message: "adminEmail and formData are required" 
            });
        }

        const result = await emailService.sendContactFormNotification(
            formData,
            adminEmail
        );

        if (result.success) {
            res.json({ 
                message: "Contact form notification sent successfully", 
                messageId: result.messageId 
            });
        } else {
            res.status(500).json({ 
                message: "Failed to send contact form notification", 
                error: result.error 
            });
        }
    } catch (error) {
        console.error('Contact form notification test error:', error);
        res.status(500).json({ message: "Something went wrong" });
    }
});

/**
 * Test route to verify email server connection
 * GET /api/email-test/verify
 */
emailTestRouter.get("/verify", async (req, res) => {
    try {
        const isConnected = await emailService.verifyConnection();
        
        if (isConnected) {
            res.json({ message: "Email server connection verified successfully" });
        } else {
            res.status(500).json({ message: "Email server connection failed" });
        }
    } catch (error) {
        console.error('Email verification test error:', error);
        res.status(500).json({ message: "Something went wrong" });
    }
});

export default emailTestRouter;
