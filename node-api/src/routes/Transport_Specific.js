
// include the necessay funtions for the transport 

import { Router } from "express";
import db_connection from "../config/dbConfig.js";
import { handle_Error_Response } from "../utils/Common_Utils.js"

const transport_Router = Router();

// === HAULIER MANAGEMENT ROUTES ===

// Get all hauliers with their current stats + compliance

transport_Router.get("/hauliers", async (request, response) => {
    try {
        const query = `
            SELECT 
                h.*,
                c.Safety_Certifications,
                c.Environmental_Regulations,
                c.Health_Safety,
                c.Permits,
                COUNT(DISTINCT q.Transport_ID) as Active_Quotes,
                COALESCE(AVG(CAST(r.Customer_Feedback_Score AS DECIMAL)), 0) as Avg_Rating,
                COUNT(DISTINCT r.Transport_ID) as Total_Reviews
            FROM Haulier h
            LEFT JOIN Compliance c ON h.Haulier_ID = c.Haulier_ID
            LEFT JOIN Transportation_Quotes q ON h.Haulier_ID = q.Haulier_ID AND q.Quote_Status = 'Active'
            LEFT JOIN Reviews r ON h.Haulier_ID = r.Haulier_ID
            GROUP BY h.Haulier_ID, h.Haulier_Name, h.Verified, c.Safety_Certifications, c.Environmental_Regulations, c.Health_Safety, c.Permits
            ORDER BY h.Haulier_Total_Customer_Score DESC
        `;
        
        const [hauliers] = await db_connection.query(query);
        
        response.json({
            ok: true,
            data: hauliers,
            count: hauliers.length
        });
    } catch (error) {
        handle_Error_Response(response, `Failed to fetch hauliers: ${error.message}`);
    }
});


// Get specific haulier details with compliance, job history and quotes

transport_Router.get("/hauliers/:haulierId", async (request, response) => {
    try {
        const { haulierId } = request.params;
        
        // Get haulier details with compliance
        const [haulierResult] = await db_connection.query(`
            SELECT 
                h.*,
                c.Safety_Certifications,
                c.Environmental_Regulations,
                c.Health_Safety,
                c.Permits,
                c.Safety_Training,
                c.Transport_Regulations
            FROM Haulier h
            LEFT JOIN Compliance c ON h.Haulier_ID = c.Haulier_ID
            WHERE h.Haulier_ID = ?
        `, [haulierId]);
        
        if (haulierResult.length === 0) {
            return handle_Error_Response(response, "Haulier not found", 404);
        }
        
        // Get ALL jobs this haulier has bid on with job details

        const [biddedJobs] = await db_connection.query(`
            SELECT 
                j.*,
                q.Quote_Value as My_Quote_Price,
                q.Quote_Status as My_Quote_Status,
                q.Quote_Date as My_Quote_Date,
                q.Quote_Description as My_Quote_Notes,
                (SELECT COUNT(*) FROM Transportation_Quotes WHERE Transport_ID = j.Transport_ID) as Total_Quotes_On_Job,
                (SELECT MIN(Quote_Value) FROM Transportation_Quotes WHERE Transport_ID = j.Transport_ID AND Quote_Status = 'Active') as Lowest_Quote
            FROM Job j
            INNER JOIN Transportation_Quotes q ON j.Transport_ID = q.Transport_ID
            WHERE q.Haulier_ID = ?
            ORDER BY q.Quote_Date DESC
        `, [haulierId]);
        
        // Get reviews for this haulier

        const [reviews] = await db_connection.query(`
            SELECT 
                r.*,
                j.Title as Job_Title
            FROM Reviews r
            INNER JOIN Job j ON r.Transport_ID = j.Transport_ID
            WHERE r.Haulier_ID = ?
            ORDER BY r.Date DESC
        `, [haulierId]);
        
        response.json({
            ok: true,
            data: {
                haulier: haulierResult[0],
                bidded_jobs: biddedJobs,
                reviews: reviews
            }
        });
    } catch (error) {
        handle_Error_Response(response, `Failed to fetch haulier details: ${error.message}`);
    }
});

// Update haulier compliance
transport_Router.patch("/hauliers/:haulierId/compliance", async (request, response) => {
    const connection = await db_connection.getConnection();
    
    try {
        await connection.beginTransaction();
        
        const { haulierId } = request.params;
        const complianceData = request.body;
        
        // Check if compliance record exists
        const [existing] = await connection.query(
            `SELECT Haulier_ID FROM Compliance WHERE Haulier_ID = ?`, [haulierId]
        );
        
        if (existing.length > 0) {
            // Update existing compliance
            const updateFields = Object.keys(complianceData)
                .map(key => `${key} = ?`)
                .join(', ');
            const values = [...Object.values(complianceData), haulierId];
            
            await connection.query(
                `UPDATE Compliance SET ${updateFields} WHERE Haulier_ID = ?`,
                values
            );
        } else {
            // Insert new compliance record
            const fields = ['Haulier_ID', ...Object.keys(complianceData)];
            const placeholders = fields.map(() => '?').join(', ');
            const values = [haulierId, ...Object.values(complianceData)];
            
            await connection.query(
                `INSERT INTO Compliance (${fields.join(', ')}) VALUES (${placeholders})`,
                values
            );
        }
        
        await connection.commit();
        
        response.json({
            ok: true,
            message: "Compliance updated successfully"
        });
        
    } catch (error) {
        await connection.rollback();
        handle_Error_Response(response, `Failed to update compliance: ${error.message}`);
    } finally {
        connection.release();
    }
});

// === JOB MANAGEMENT ROUTES ===

// Get all transport jobs with quote counts and compliance requirements
transport_Router.get("/jobs", async (request, response) => {
    try {
        const query = `
            SELECT 
                j.*,
                vd.Item_Number,
                vd.Total_Number_Items,
                vd.Insurance_Claims,
                tc.Collection_Address,
                tc.Delivery_Address,
                CAST(j.Number_Quotes AS UNSIGNED) as Quote_Count,
                COALESCE(MIN(CAST(q.Quote_Value AS DECIMAL)), 0) as Lowest_Quote,
                COALESCE(MAX(CAST(q.Quote_Value AS DECIMAL)), 0) as Highest_Quote
            FROM Job j
            LEFT JOIN Vessel_Details vd ON j.Transport_ID = vd.Transport_ID
            LEFT JOIN Transportation_Contacts tc ON j.Transport_ID = tc.Transport_ID
            LEFT JOIN Transportation_Quotes q ON j.Transport_ID = q.Transport_ID 
                AND (q.Quote_Status = 'Active' OR q.Quote_Status IS NULL)
            GROUP BY j.Transport_ID
            ORDER BY j.Posted_Date DESC
        `;
        
        const [jobs] = await db_connection.query(query);
        
        response.json({
            ok: true,
            data: jobs,
            count: jobs.length
        });
    } catch (error) {
        handle_Error_Response(response, `Failed to fetch jobs: ${error.message}`);
    }
});

// Get specific job with all quotes, Q&A, and vessel details
transport_Router.get("/jobs/:jobId", async (request, response) => {
    try {
        const { jobId } = request.params;
        
        // Get complete job details with vessel and contact info
        const [jobResult] = await db_connection.query(`
            SELECT 
                j.*,
                vd.*,
                tc.*,
                tp.Payment_Terms,
                tp.Insurance_Coverage,
                ts.Price_Label
            FROM Job j
            LEFT JOIN Vessel_Details vd ON j.Transport_ID = vd.Transport_ID
            LEFT JOIN Transportation_Contacts tc ON j.Transport_ID = tc.Transport_ID
            LEFT JOIN Transportation_Payment tp ON j.Transport_ID = tp.Transport_ID
            LEFT JOIN Transportation_Sales ts ON j.Transport_ID = ts.Transport_ID
            WHERE j.Transport_ID = ?
        `, [jobId]);
        
        if (jobResult.length === 0) {
            return handle_Error_Response(response, "Job not found", 404);
        }
        
        // Get all quotes for this job with haulier details and compliance
        const [quotes] = await db_connection.query(`
            SELECT 
                q.*,
                h.Haulier_Name,
                h.Verified,
                h.Haulier_Total_Customer_Score,
                h.Vehicle_Type,
                h.Real_Time_Tracking,
                c.Safety_Certifications,
                c.Environmental_Regulations
            FROM Transportation_Quotes q
            INNER JOIN Haulier h ON q.Haulier_ID = h.Haulier_ID
            LEFT JOIN Compliance c ON h.Haulier_ID = c.Haulier_ID
            WHERE q.Transport_ID = ?
            ORDER BY CAST(q.Quote_Value AS DECIMAL) ASC
        `, [jobId]);
        
        // Get questions for this job
        const [questions] = await db_connection.query(`
            SELECT 
                qu.*,
                h.Haulier_Name
            FROM Questions qu
            LEFT JOIN Haulier h ON qu.Haulier_ID = h.Haulier_ID
            WHERE qu.Transport_ID = ?
            ORDER BY qu.Question_Date DESC
        `, [jobId]);
        
        response.json({
            ok: true,
            data: {
                job: jobResult[0],
                quotes: quotes,
                questions: questions
            }
        });
    } catch (error) {
        handle_Error_Response(response, `Failed to fetch job details: ${error.message}`);
    }
});

// === QUOTE MANAGEMENT ROUTES ===

// Create new quote (haulier bids on job) - with compliance check
transport_Router.post("/quotes", async (request, response) => {
    const connection = await db_connection.getConnection();
    
    try {
        await connection.beginTransaction();
        
        const {
            Transport_ID,
            Haulier_ID,
            Quote_Value,
            Quote_Description
        } = request.body;
        
        // Check haulier compliance before allowing quote
        const [complianceCheck] = await connection.query(`
            SELECT 
                h.Verified,
                c.Safety_Certifications,
                c.Permits
            FROM Haulier h
            LEFT JOIN Compliance c ON h.Haulier_ID = c.Haulier_ID
            WHERE h.Haulier_ID = ?
        `, [Haulier_ID]);
        
        if (complianceCheck.length === 0) {
            await connection.rollback();
            return handle_Error_Response(response, "Haulier not found", 404);
        }
        
        // Insert new quote
        const [quoteResult] = await connection.query(`
            INSERT INTO Transportation_Quotes 
            (Transport_ID, Haulier_ID, Quote_Value, Quote_Description, Quote_Date, Quote_Status)
            VALUES (?, ?, ?, ?, NOW(), 'Active')
        `, [Transport_ID, Haulier_ID, Quote_Value, Quote_Description]);
        
        // Update job quote count
        await connection.query(`
            UPDATE Job SET Number_Quotes = (
                SELECT COUNT(*) FROM Transportation_Quotes 
                WHERE Transport_ID = ? AND Quote_Status = 'Active'
            ) WHERE Transport_ID = ?
        `, [Transport_ID, Transport_ID]);
        
        await connection.commit();
        
        response.status(201).json({
            ok: true,
            message: "Quote submitted successfully",
            quote_id: quoteResult.insertId
        });
        
    } catch (error) {
        await connection.rollback();
        handle_Error_Response(response, `Failed to create quote: ${error.message}`);
    } finally {
        connection.release();
    }
});

// === QUESTIONS & ANSWERS ROUTES ===

transport_Router.post("/questions", async (request, response) => {
    try {
        const questionData = {
            Transport_ID: request.body.Transport_ID,
            Haulier_ID: request.body.Haulier_ID,
            Customer_ID: request.body.Customer_ID,
            Question_Text: request.body.Question_Text
        };

        // Validate using utility
        QuestionUtils.validateQuestionData(questionData);
        
        // Check permissions (no auth for now)
        if (!QuestionUtils.canHaulierAsk(null)) {
            return handle_Error_Response(response, "Not authorized to ask questions", 403);
        }

        // Insert question
        const [result] = await db_connection.query(`
            INSERT INTO Questions (Transport_ID, Haulier_ID, Customer_ID, Question_Text, Question_Date)
            VALUES (?, ?, ?, ?, NOW())
        `, [
            questionData.Transport_ID, 
            questionData.Haulier_ID, 
            questionData.Customer_ID, 
            questionData.Question_Text
        ]);

        // Log activity
        QuestionUtils.logActivity('CREATED', {
            Question_ID: result.insertId,
            ...questionData
        });
        
        response.status(201).json({
            ok: true,
            message: "Question posted successfully",
            question_id: result.insertId
        });
        
    } catch (error) {
        handle_Error_Response(response, `Failed to post question: ${error.message}`);
    }
});

// Customer answers question
transport_Router.patch("/questions/:questionId/answer", async (request, response) => {
    try {
        const { questionId } = request.params;
        const { Answer_Text } = request.body;
        
        if (!Answer_Text || typeof Answer_Text !== 'string' || Answer_Text.trim().length === 0) {
            return handle_Error_Response(response, "Answer_Text must be a non-empty string", 400);
        }

        // Check permissions (no auth for now)
        if (!QuestionUtils.canCustomerAnswer(null)) {
            return handle_Error_Response(response, "Not authorized to answer questions", 403);
        }

        // Update question with answer
        await db_connection.query(`
            UPDATE Questions 
            SET Answer_Text = ?, Answer_Date = NOW()
            WHERE Question_ID = ?
        `, [Answer_Text, questionId]);
        
        // Log activity
        QuestionUtils.logActivity('ANSWERED', {
            Question_ID: questionId,
            Answer_Text
        });
        
        response.json({
            ok: true,
            message: "Question answered successfully"
        });
        
    } catch (error) {
        handle_Error_Response(response, `Failed to answer question: ${error.message}`);
    }
});

// Get all questions for a job with formatted response
transport_Router.get("/jobs/:jobId/questions", async (request, response) => {
    try {
        const { jobId } = request.params;
        
        const [questions] = await db_connection.query(`
            SELECT 
                q.*,
                h.Haulier_Name
            FROM Questions q
            LEFT JOIN Haulier h ON q.Haulier_ID = h.Haulier_ID
            WHERE q.Transport_ID = ?
            ORDER BY q.Question_Date DESC
        `, [jobId]);
        
        // Format using utility
        const formattedQuestions = questions.map(q => QuestionUtils.formatQuestionForResponse(q));
        
        response.json({
            ok: true,
            data: formattedQuestions,
            count: formattedQuestions.length
        });
        
    } catch (error) {
        handle_Error_Response(response, `Failed to fetch questions: ${error.message}`);
    }
});

// Get questions by haulier
transport_Router.get("/hauliers/:haulierId/questions", async (request, response) => {
    try {
        const { haulierId } = request.params;
        
        const [questions] = await db_connection.query(`
            SELECT 
                q.*,
                j.Title as Job_Title
            FROM Questions q
            INNER JOIN Job j ON q.Transport_ID = j.Transport_ID
            WHERE q.Haulier_ID = ?
            ORDER BY q.Question_Date DESC
        `, [haulierId]);
        
        // Format using utility
        const formattedQuestions = questions.map(q => QuestionUtils.formatQuestionForResponse(q));
        
        response.json({
            ok: true,
            data: formattedQuestions,
            count: formattedQuestions.length
        });
        
    } catch (error) {
        handle_Error_Response(response, `Failed to fetch haulier questions: ${error.message}`);
    }
});


// === JOB COMPLETION & REVIEWS ===

// Mark job as done (by haulier)
transport_Router.patch("/jobs/:jobId/complete", async (request, response) => {
    try {
        const { jobId } = request.params;
        const { haulierId } = request.body; // Track which haulier completed the job
        
        await db_connection.query(`
            UPDATE Job 
            SET Job_Done_Haulier = 1, Job_Done_Date_Haulier = NOW()
            WHERE Transport_ID = ?
        `, [jobId]);
        
        response.json({
            ok: true,
            message: "Job marked as complete with automatic timestamp"
        });
        
    } catch (error) {
        handle_Error_Response(response, `Failed to mark job complete: ${error.message}`);
    }
});

// Submit customer feedback and rating
transport_Router.post("/reviews", async (request, response) => {
    const connection = await db_connection.getConnection();
    
    try {
        await connection.beginTransaction();
        
        const {
            Transport_ID,
            Haulier_ID,
            Customer_ID,
            Customer_Feedback_Notes,
            Customer_Feedback_Score,
            Rating
        } = request.body;
        
        // Insert review
        await connection.query(`
            INSERT INTO Reviews (
                Transport_ID, Haulier_ID, Customer_ID, 
                Customer_Feedback_Notes, Customer_Feedback_Score, Rating,
                Date, Job_Done_Customer, Job_Done_Date_Customer
            )
            VALUES (?, ?, ?, ?, ?, ?, NOW(), 1, CURDATE())
        `, [Transport_ID, Haulier_ID, Customer_ID, Customer_Feedback_Notes, Customer_Feedback_Score, Rating]);
        
        // Update haulier's total customer score (recalculate average)
        await connection.query(`
            UPDATE Haulier 
            SET Haulier_Total_Customer_Score = (
                SELECT ROUND(AVG(CAST(Customer_Feedback_Score AS DECIMAL)), 2) 
                FROM Reviews 
                WHERE Haulier_ID = ? AND Customer_Feedback_Score IS NOT NULL
            )
            WHERE Haulier_ID = ?
        `, [Haulier_ID, Haulier_ID]);
        
        await connection.commit();
        
        response.status(201).json({
            ok: true,
            message: "Review submitted successfully and haulier score updated"
        });
        
    } catch (error) {
        await connection.rollback();
        handle_Error_Response(response, `Failed to submit review: ${error.message}`);
    } finally {
        connection.release();
    }
});

// === DASHBOARD/STATS ROUTES ===

// Get comprehensive dashboard stats
transport_Router.get("/stats", async (request, response) => {
    try {
        const [stats] = await db_connection.query(`
            SELECT 
                (SELECT COUNT(*) FROM Job) as Total_Jobs,
                (SELECT COUNT(*) FROM Job WHERE Job_Done_Haulier = 1) as Completed_Jobs,
                (SELECT COUNT(*) FROM Job WHERE Posted_Date >= DATE_SUB(NOW(), INTERVAL 30 DAY)) as Jobs_This_Month,
                (SELECT COUNT(*) FROM Haulier) as Total_Hauliers,
                (SELECT COUNT(*) FROM Haulier WHERE Verified = 'Yes') as Verified_Hauliers,
                (SELECT COUNT(*) FROM Transportation_Quotes) as Total_Quotes,
                (SELECT COUNT(*) FROM Transportation_Quotes WHERE Quote_Status = 'Active') as Active_Quotes,
                (SELECT COUNT(*) FROM Compliance) as Hauliers_With_Compliance,
                (SELECT ROUND(AVG(CAST(Customer_Feedback_Score AS DECIMAL)), 2) FROM Reviews WHERE Customer_Feedback_Score IS NOT NULL) as Average_Rating,
                (SELECT COUNT(*) FROM Reviews) as Total_Reviews
        `);
        
        response.json({
            ok: true,
            data: stats[0]
        });
        
    } catch (error) {
        handle_Error_Response(response, `Failed to fetch stats: ${error.message}`);
    }
});

// Get haulier quotes (for "See My Quotes" functionality)
transport_Router.get("/hauliers/:haulierId/quotes", async (request, response) => {
    try {
        const { haulierId } = request.params;
        
        const [quotes] = await db_connection.query(`
            SELECT 
                q.*,
                j.Title as Job_Title,
                j.Category,
                j.Description,
                j.Deadline_Date,
                j.Customer_ID,
                tc.Collection_Address,
                tc.Delivery_Address
            FROM Transportation_Quotes q
            INNER JOIN Job j ON q.Transport_ID = j.Transport_ID
            LEFT JOIN Transportation_Contacts tc ON j.Transport_ID = tc.Transport_ID
            WHERE q.Haulier_ID = ?
            ORDER BY q.Quote_Date DESC
        `, [haulierId]);
        
        response.json({
            ok: true,
            data: quotes,
            count: quotes.length
        });
        
    } catch (error) {
        handle_Error_Response(response, `Failed to fetch haulier quotes: ${error.message}`);
    }
});

// Update quote status (Withdraw/Decline)
transport_Router.patch("/quotes/:transportId/:haulierId/status", async (request, response) => {
    try {
        const { transportId, haulierId } = request.params;
        const { status, reason } = request.body;
        
        if (!['Withdrawn', 'Declined'].includes(status)) {
            return handle_Error_Response(response, "Invalid status. Only 'Withdrawn' or 'Declined' allowed", 400);
        }
        
        const dateField = status === 'Withdrawn' ? 'Withdraw_Date' : 'Decline_Date';
        
        await db_connection.query(`
            UPDATE Transportation_Quotes 
            SET Quote_Status = ?, ${dateField} = NOW(), 
                Quote_Description = CONCAT(COALESCE(Quote_Description, ''), '\n\nStatus Update: ', ?)
            WHERE Transport_ID = ? AND Haulier_ID = ?
        `, [status, reason || `Quote ${status.toLowerCase()}`, transportId, haulierId]);
        
        response.json({
            ok: true,
            message: `Quote ${status.toLowerCase()} successfully`
        });
        
    } catch (error) {
        handle_Error_Response(response, `Failed to update quote status: ${error.message}`);
    }
});

export default transport_Router;
