import { Router } from "express";
import smsService from "../services/smsService.js";

const smsTestRouter = Router();

/**
 * Test route to send a welcome SMS
 * POST /api/sms-test/welcome
 */
smsTestRouter.post("/welcome", async (req, res) => {
    try {
        const { phone, firstName } = req.body;
        
        if (!phone) {
            return res.status(400).json({ message: "Phone number is required" });
        }

        const result = await smsService.sendWelcomeSMS({
            phone: phone,
            firstName: firstName || 'Test User'
        });

        if (result.success) {
            res.json({ 
                message: "Welcome SMS sent successfully", 
                messageId: result.messageId,
                status: result.status
            });
        } else {
            res.status(500).json({ 
                message: "Failed to send welcome SMS", 
                error: result.error 
            });
        }
    } catch (error) {
        console.error('Welcome SMS test error:', error);
        res.status(500).json({ message: "Something went wrong" });
    }
});

/**
 * Test route to send a verification code SMS
 * POST /api/sms-test/verification-code
 */
smsTestRouter.post("/verification-code", async (req, res) => {
    try {
        const { phone, firstName, code, type } = req.body;
        
        if (!phone || !code) {
            return res.status(400).json({ 
                message: "Phone number and verification code are required" 
            });
        }

        const result = await smsService.sendVerificationCodeSMS({
            phone: phone,
            firstName: firstName || 'Test User',
            code: code,
            type: type || 'verification'
        });

        if (result.success) {
            res.json({ 
                message: "Verification code SMS sent successfully", 
                messageId: result.messageId,
                status: result.status
            });
        } else {
            res.status(500).json({ 
                message: "Failed to send verification code SMS", 
                error: result.error 
            });
        }
    } catch (error) {
        console.error('Verification code SMS test error:', error);
        res.status(500).json({ message: "Something went wrong" });
    }
});

/**
 * Test route to send a password reset SMS
 * POST /api/sms-test/password-reset
 */
smsTestRouter.post("/password-reset", async (req, res) => {
    try {
        const { phone, firstName, code } = req.body;
        
        if (!phone || !code) {
            return res.status(400).json({ 
                message: "Phone number and reset code are required" 
            });
        }

        const result = await smsService.sendPasswordResetSMS({
            phone: phone,
            firstName: firstName || 'Test User',
            code: code
        });

        if (result.success) {
            res.json({ 
                message: "Password reset SMS sent successfully", 
                messageId: result.messageId,
                status: result.status
            });
        } else {
            res.status(500).json({ 
                message: "Failed to send password reset SMS", 
                error: result.error 
            });
        }
    } catch (error) {
        console.error('Password reset SMS test error:', error);
        res.status(500).json({ message: "Something went wrong" });
    }
});

/**
 * Test route to send a listing notification SMS
 * POST /api/sms-test/listing-notification
 */
smsTestRouter.post("/listing-notification", async (req, res) => {
    try {
        const { phone, firstName, listingData } = req.body;
        
        if (!phone || !listingData) {
            return res.status(400).json({ 
                message: "Phone number and listing data are required" 
            });
        }

        const result = await smsService.sendListingNotificationSMS(
            {
                phone: phone,
                firstName: firstName || 'Test User'
            },
            listingData
        );

        if (result.success) {
            res.json({ 
                message: "Listing notification SMS sent successfully", 
                messageId: result.messageId,
                status: result.status
            });
        } else {
            res.status(500).json({ 
                message: "Failed to send listing notification SMS", 
                error: result.error 
            });
        }
    } catch (error) {
        console.error('Listing notification SMS test error:', error);
        res.status(500).json({ message: "Something went wrong" });
    }
});

/**
 * Test route to send an appointment reminder SMS
 * POST /api/sms-test/appointment-reminder
 */
smsTestRouter.post("/appointment-reminder", async (req, res) => {
    try {
        const { phone, firstName, appointmentData } = req.body;
        
        if (!phone || !appointmentData) {
            return res.status(400).json({ 
                message: "Phone number and appointment data are required" 
            });
        }

        const result = await smsService.sendAppointmentReminderSMS(
            {
                phone: phone,
                firstName: firstName || 'Test User'
            },
            appointmentData
        );

        if (result.success) {
            res.json({ 
                message: "Appointment reminder SMS sent successfully", 
                messageId: result.messageId,
                status: result.status
            });
        } else {
            res.status(500).json({ 
                message: "Failed to send appointment reminder SMS", 
                error: result.error 
            });
        }
    } catch (error) {
        console.error('Appointment reminder SMS test error:', error);
        res.status(500).json({ message: "Something went wrong" });
    }
});

/**
 * Test route to send a simple SMS
 * POST /api/sms-test/simple
 */
smsTestRouter.post("/simple", async (req, res) => {
    try {
        const { phone, message } = req.body;
        
        if (!phone || !message) {
            return res.status(400).json({ 
                message: "Phone number and message are required" 
            });
        }

        const result = await smsService.sendSimpleSMS({
            to: phone,
            message: message
        });

        if (result.success) {
            res.json({ 
                message: "Simple SMS sent successfully", 
                messageId: result.messageId,
                status: result.status
            });
        } else {
            res.status(500).json({ 
                message: "Failed to send simple SMS", 
                error: result.error 
            });
        }
    } catch (error) {
        console.error('Simple SMS test error:', error);
        res.status(500).json({ message: "Something went wrong" });
    }
});

/**
 * Test route to verify Twilio connection
 * GET /api/sms-test/verify
 */
smsTestRouter.get("/verify", async (req, res) => {
    try {
        const result = await smsService.verifyConnection();
        
        if (result.success) {
            res.json({ 
                message: "Twilio connection verified successfully",
                accountSid: result.accountSid,
                status: result.status
            });
        } else {
            res.status(500).json({ 
                message: "Twilio connection failed", 
                error: result.error 
            });
        }
    } catch (error) {
        console.error('Twilio verification test error:', error);
        res.status(500).json({ message: "Something went wrong" });
    }
});

/**
 * Test route to get message status
 * GET /api/sms-test/status/:messageId
 */
smsTestRouter.get("/status/:messageId", async (req, res) => {
    try {
        const { messageId } = req.params;
        
        if (!messageId) {
            return res.status(400).json({ message: "Message ID is required" });
        }

        const result = await smsService.getMessageStatus(messageId);
        
        if (result.success) {
            res.json({ 
                message: "Message status retrieved successfully",
                status: result.status,
                errorCode: result.errorCode
            });
        } else {
            res.status(500).json({ 
                message: "Failed to get message status", 
                error: result.error 
            });
        }
    } catch (error) {
        console.error('Message status test error:', error);
        res.status(500).json({ message: "Something went wrong" });
    }
});

/**
 * Test route to format phone number
 * POST /api/sms-test/format-phone
 */
smsTestRouter.post("/format-phone", async (req, res) => {
    try {
        const { phone, countryCode } = req.body;
        
        if (!phone) {
            return res.status(400).json({ message: "Phone number is required" });
        }

        const formattedPhone = smsService.formatPhoneNumber(phone, countryCode || 'US');
        const isValid = smsService.validatePhoneNumber(formattedPhone);
        
        res.json({ 
            message: "Phone number formatted successfully",
            original: phone,
            formatted: formattedPhone,
            isValid: isValid
        });
    } catch (error) {
        console.error('Phone formatting test error:', error);
        res.status(500).json({ message: "Something went wrong" });
    }
});

export default smsTestRouter;
