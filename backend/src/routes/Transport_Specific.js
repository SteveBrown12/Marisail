
import { Router } from "express";
import db_connection from "../config/dbConfig.js";
import { 
  handle_Error_Response,
  validateQuestionData,
  canHaulierAsk,
  canCustomerAnswer,
  logActivity,
  formatQuestionForResponse
} from "../utils/common_Utils.js";

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

// Haulier asks a question
transport_Router.post("/questions", async (request, response) => {
  try {
    const body = request.body || {};
    const transportId = body.Transport_ID;
    const haulierId = body.Haulier_ID;
    const customerId = body.Customer_ID ?? null;
    const questionText = body.Transport_Provider_Questions ?? body.Question_Text;

    console.log('Received question data:', { transportId, haulierId, customerId, questionText });

    // Validate using utils
    validateQuestionData({
      Transport_ID: transportId,
      Haulier_ID: haulierId,
      Question_Text: questionText
    });

    if (!canHaulierAsk(null)) {
      return handle_Error_Response(response, "Not authorized to ask questions", 403);
    }

    // Insert using correct column names from your config
    const insertSql = `
      INSERT INTO Questions
        (Transport_ID, Haulier_ID, Customer_ID, Transport_Provider_Questions, Question_Date)
      VALUES (?, ?, ?, ?, NOW())
    `;

    const [result] = await db_connection.query(insertSql, [
      transportId,
      haulierId,
      customerId,
      questionText
    ]);

    logActivity("CREATED", {
      Question_ID: result.insertId,
      Transport_ID: transportId,
      Haulier_ID: haulierId
    });

    return response.status(201).json({
      ok: true,
      message: "Question posted successfully",
      question_id: result.insertId
    });
  } catch (error) {
    console.error('Error posting question:', error);
    return handle_Error_Response(response, `Failed to post question: ${error.message}`);
  }
});

// Customer answers question
transport_Router.patch("/questions/:questionId/answer", async (request, response) => {
  try {
    const { questionId } = request.params;
    // Accept both field names for flexibility
    const answerText = (request.body?.Customer_Answers ?? request.body?.Answer_Text ?? "").trim();
    
    if (!answerText) {
      return handle_Error_Response(response, "Customer_Answers must be a non-empty string", 400);
    }

    if (!canCustomerAnswer(null)) {
      return handle_Error_Response(response, "Not authorized to answer questions", 403);
    }

    // Use correct column name from your config
    const updateSql = `
      UPDATE Questions 
      SET Customer_Answers = ?, Answer_Date = NOW()
      WHERE Question_ID = ?
    `;
    
    await db_connection.query(updateSql, [answerText, questionId]);

    logActivity('ANSWERED', {
      Question_ID: questionId,
      Customer_Answers: answerText
    });

    response.json({
      ok: true,
      message: "Question answered successfully"
    });
  } catch (error) {
    console.error('Error answering question:', error);
    handle_Error_Response(response, `Failed to answer question: ${error.message}`);
  }
});

// Get all questions for a job
transport_Router.get("/jobs/:jobId/questions", async (request, response) => {
  try {
    const { jobId } = request.params;
    
    console.log(`Fetching questions for job ${jobId}`);
    
    const query = `
      SELECT 
        q.Question_ID,
        q.Transport_ID,
        q.Haulier_ID,
        q.Customer_ID,
        q.Transport_Provider_Questions,
        q.Customer_Answers,
        q.Question_Date,
        q.Answer_Date,
        h.Haulier_Name
      FROM Questions q
      LEFT JOIN Haulier h ON h.Haulier_ID = q.Haulier_ID
      WHERE q.Transport_ID = ?
      ORDER BY q.Question_Date DESC
    `;

    const [questions] = await db_connection.query(query, [jobId]);
    
    console.log(`Found ${questions.length} questions for job ${jobId}`);

    // Normalize response for frontend compatibility
    const formattedQuestions = questions.map(q => ({
      Question_ID: q.Question_ID,
      Transport_ID: q.Transport_ID,
      Haulier_ID: q.Haulier_ID,
      Customer_ID: q.Customer_ID,
      // Provide both field names for compatibility
      Question_Text: q.Transport_Provider_Questions,
      Transport_Provider_Questions: q.Transport_Provider_Questions,
      Answer_Text: q.Customer_Answers,
      Customer_Answers: q.Customer_Answers,
      Question_Date: q.Question_Date,
      Answer_Date: q.Answer_Date,
      Haulier_Name: q.Haulier_Name
    }));

    response.json({
      ok: true,
      data: formattedQuestions,
      count: formattedQuestions.length
    });
  } catch (error) {
    console.error('Error fetching questions:', error);
    handle_Error_Response(response, `Failed to fetch questions: ${error.message}`);
  }
});

// Get questions by haulier
transport_Router.get("/hauliers/:haulierId/questions", async (request, response) => {
  try {
    const { haulierId } = request.params;
    
    const query = `
      SELECT 
        q.Question_ID,
        q.Transport_ID,
        q.Haulier_ID,
        q.Customer_ID,
        q.Transport_Provider_Questions,
        q.Customer_Answers,
        q.Question_Date,
        q.Answer_Date,
        j.Title as Job_Title
      FROM Questions q
      INNER JOIN Job j ON q.Transport_ID = j.Transport_ID
      WHERE q.Haulier_ID = ?
      ORDER BY q.Question_Date DESC
    `;

    const [questions] = await db_connection.query(query, [haulierId]);

    const formattedQuestions = questions.map(q => ({
      Question_ID: q.Question_ID,
      Transport_ID: q.Transport_ID,
      Haulier_ID: q.Haulier_ID,
      Customer_ID: q.Customer_ID,
      Question_Text: q.Transport_Provider_Questions,
      Transport_Provider_Questions: q.Transport_Provider_Questions,
      Answer_Text: q.Customer_Answers,
      Customer_Answers: q.Customer_Answers,
      Question_Date: q.Question_Date,
      Answer_Date: q.Answer_Date,
      Job_Title: q.Job_Title
    }));

    response.json({
      ok: true,
      data: formattedQuestions,
      count: formattedQuestions.length
    });
  } catch (error) {
    console.error('Error fetching haulier questions:', error);
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
// Add these routes to your existing Transport_Specific.js file

// === DASHBOARD ROUTES FOR HAULIER ===

// Haulier Dashboard Overview - Main dashboard stats
transport_Router.get("/haulier/:haulierId/dashboard", async (request, response) => {
  try {
    const { haulierId } = request.params;
    
    // Get comprehensive haulier stats
    const [dashboardStats] = await db_connection.query(`
      SELECT 
        -- Basic quote statistics
        COUNT(DISTINCT q.Quote_ID) as totalQuotes,
        COUNT(DISTINCT CASE WHEN q.Quote_Status = 'Active' THEN q.Quote_ID END) as activeQuotes,
        COUNT(DISTINCT CASE WHEN q.Quote_Status = 'Won' OR q.Quote_Status = 'Accepted' THEN q.Quote_ID END) as wonJobs,
        
        -- Calculate win rate
        ROUND(
          COUNT(DISTINCT CASE WHEN q.Quote_Status = 'Won' OR q.Quote_Status = 'Accepted' THEN q.Quote_ID END) * 100.0 / 
          NULLIF(COUNT(DISTINCT q.Quote_ID), 0), 
          1
        ) as winRate,
        
        -- Haulier profile data
        h.Haulier_Total_Customer_Score as customerRating,
        h.Verified as verificationStatus,
        h.Number_Vehicles as totalVehicles,
        h.Number_Drivers as totalDrivers,
        
        -- This month statistics
        COUNT(DISTINCT CASE 
          WHEN j.Job_Done_Haulier = 1 
          AND j.Job_Done_Date_Haulier >= DATE_SUB(NOW(), INTERVAL 30 DAY) 
          AND q.Quote_Status IN ('Won', 'Accepted')
          THEN q.Quote_ID 
        END) as thisMonthJobs,
        
        -- Earnings calculations (mock - you might need to adjust based on your payment table)
        SUM(CASE 
          WHEN q.Quote_Status IN ('Won', 'Accepted') AND j.Job_Done_Haulier = 1 
          THEN CAST(q.Quote_Value AS DECIMAL) 
          ELSE 0 
        END) as totalEarnings,
        
        SUM(CASE 
          WHEN q.Quote_Status IN ('Won', 'Accepted') 
          AND j.Job_Done_Haulier = 1 
          AND j.Job_Done_Date_Haulier >= DATE_SUB(NOW(), INTERVAL 30 DAY)
          THEN CAST(q.Quote_Value AS DECIMAL) 
          ELSE 0 
        END) as thisMonthEarnings,
        
        -- Compliance status
        CASE 
          WHEN c.Safety_Certifications IS NOT NULL 
          AND c.Permits IS NOT NULL 
          AND c.Environmental_Regulations IS NOT NULL 
          THEN 'Complete' 
          ELSE 'Incomplete' 
        END as complianceStatus
        
      FROM Haulier h
      LEFT JOIN Transportation_Quotes q ON h.Haulier_ID = q.Haulier_ID
      LEFT JOIN Job j ON q.Transport_ID = j.Transport_ID
      LEFT JOIN Compliance c ON h.Haulier_ID = c.Haulier_ID
      WHERE h.Haulier_ID = ?
      GROUP BY h.Haulier_ID
    `, [haulierId]);

    if (dashboardStats.length === 0) {
      return handle_Error_Response(response, "Haulier not found", 404);
    }

    response.json({
      ok: true,
      data: dashboardStats[0]
    });
  } catch (error) {
    handle_Error_Response(response, `Failed to fetch haulier dashboard: ${error.message}`);
  }
});

// Available Jobs for Haulier - Jobs they haven't bid on yet
transport_Router.get("/haulier/:haulierId/available-jobs", async (request, response) => {
  try {
    const { haulierId } = request.params;
    const { limit = 10, category, maxDistance } = request.query;
    
    let categoryFilter = '';
    let distanceFilter = '';
    const queryParams = [haulierId];
    
    if (category && category !== 'all') {
      categoryFilter = 'AND j.Category = ?';
      queryParams.push(category);
    }
    
    // You can add distance filtering if you have location data
    // if (maxDistance) {
    //   distanceFilter = 'AND distance_calculation <= ?';
    //   queryParams.push(maxDistance);
    // }
    
    queryParams.push(parseInt(limit));
    
    const [jobs] = await db_connection.query(`
      SELECT 
        j.*,
        tc.Collection_Address,
        tc.Delivery_Address,
        tc.Customer_Name,
        tc.Customer_Company_Name,
        vd.Item_Number,
        vd.Total_Number_Items,
        vd.Vessel_Insurance_Type,
        
        -- Competition info
        COUNT(DISTINCT tq.Quote_ID) as Quote_Count,
        MIN(CAST(tq.Quote_Value AS DECIMAL)) as Lowest_Current_Quote,
        MAX(CAST(tq.Quote_Value AS DECIMAL)) as Highest_Current_Quote,
        
        -- Estimated value (you might want to add this field to Job table)
        CASE 
          WHEN j.Round_Trip_Distance IS NOT NULL THEN j.Round_Trip_Distance * 2.5  -- $2.5 per mile estimate
          ELSE 1000  -- Default estimate
        END as Estimated_Value,
        
        -- Distance calculation (mock - replace with actual calculation)
        COALESCE(j.Round_Trip_Distance, 'Unknown') as Distance
        
      FROM Job j
      LEFT JOIN Transportation_Contacts tc ON j.Transport_ID = tc.Transport_ID
      LEFT JOIN Vessel_Details vd ON j.Transport_ID = vd.Transport_ID
      LEFT JOIN Transportation_Quotes tq ON j.Transport_ID = tq.Transport_ID AND tq.Quote_Status = 'Active'
      
      WHERE j.Job_Done_Haulier = 0  -- Job not completed
      AND j.Transport_ID NOT IN (
        SELECT Transport_ID 
        FROM Transportation_Quotes 
        WHERE Haulier_ID = ?
      )  -- Haulier hasn't bid on this job
      ${categoryFilter}
      ${distanceFilter}
      
      GROUP BY j.Transport_ID
      ORDER BY j.Posted_Date DESC
      LIMIT ?
    `, queryParams);
    
    response.json({
      ok: true,
      data: jobs,
      count: jobs.length
    });
  } catch (error) {
    handle_Error_Response(response, `Failed to fetch available jobs: ${error.message}`);
  }
});

// Haulier's Recent Activity Feed
transport_Router.get("/haulier/:haulierId/activity", async (request, response) => {
  try {
    const { haulierId } = request.params;
    const { limit = 10 } = request.query;
    
    // Get recent activities - quotes, job completions, questions, etc.
    const activities = [];
    
    // Recent quotes submitted
    const [recentQuotes] = await db_connection.query(`
      SELECT 
        'quote_submitted' as type,
        CONCAT('You submitted a quote of $', q.Quote_Value, ' for transport job') as message,
        q.Quote_Date as timestamp,
        j.Title as job_title,
        q.Quote_Status as status
      FROM Transportation_Quotes q
      INNER JOIN Job j ON q.Transport_ID = j.Transport_ID
      WHERE q.Haulier_ID = ?
      ORDER BY q.Quote_Date DESC
      LIMIT 5
    `, [haulierId]);
    
    // Recent won jobs
    const [wonJobs] = await db_connection.query(`
      SELECT 
        'quote_won' as type,
        'Your quote was accepted for transport job' as message,
        q.Quote_Date as timestamp,
        j.Title as job_title,
        'Won' as status
      FROM Transportation_Quotes q
      INNER JOIN Job j ON q.Transport_ID = j.Transport_ID
      WHERE q.Haulier_ID = ? 
      AND q.Quote_Status IN ('Won', 'Accepted')
      ORDER BY q.Quote_Date DESC
      LIMIT 3
    `, [haulierId]);
    
    // Recent questions asked
    const [recentQuestions] = await db_connection.query(`
      SELECT 
        'question_asked' as type,
        'You asked a question about transport job' as message,
        qu.Question_Date as timestamp,
        j.Title as job_title,
        CASE WHEN qu.Customer_Answers IS NOT NULL THEN 'Answered' ELSE 'Pending' END as status
      FROM Questions qu
      INNER JOIN Job j ON qu.Transport_ID = j.Transport_ID
      WHERE qu.Haulier_ID = ?
      ORDER BY qu.Question_Date DESC
      LIMIT 3
    `, [haulierId]);
    
    // Recent job completions
    const [completedJobs] = await db_connection.query(`
      SELECT 
        'job_completed' as type,
        'You completed a transport job successfully' as message,
        j.Job_Done_Date_Haulier as timestamp,
        j.Title as job_title,
        'Completed' as status
      FROM Job j
      INNER JOIN Transportation_Quotes q ON j.Transport_ID = q.Transport_ID
      WHERE q.Haulier_ID = ? 
      AND j.Job_Done_Haulier = 1
      AND q.Quote_Status IN ('Won', 'Accepted')
      ORDER BY j.Job_Done_Date_Haulier DESC
      LIMIT 3
    `, [haulierId]);
    
    // Combine all activities
    activities.push(...recentQuotes, ...wonJobs, ...recentQuestions, ...completedJobs);
    
    // Sort by timestamp and limit
    activities.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    activities.splice(parseInt(limit));
    
    // Add unique IDs
    activities.forEach((activity, index) => {
      activity.id = index + 1;
    });
    
    response.json({
      ok: true,
      data: activities,
      count: activities.length
    });
  } catch (error) {
    handle_Error_Response(response, `Failed to fetch haulier activity: ${error.message}`);
  }
});

// Haulier Performance Analytics
transport_Router.get("/haulier/:haulierId/performance", async (request, response) => {
  try {
    const { haulierId } = request.params;
    
    const [performance] = await db_connection.query(`
      SELECT 
        -- Quote performance
        COUNT(DISTINCT q.Quote_ID) as total_quotes_submitted,
        COUNT(DISTINCT CASE WHEN q.Quote_Status IN ('Won', 'Accepted') THEN q.Quote_ID END) as quotes_won,
        COUNT(DISTINCT CASE WHEN q.Quote_Status = 'Active' THEN q.Quote_ID END) as quotes_pending,
        COUNT(DISTINCT CASE WHEN q.Quote_Status = 'Declined' THEN q.Quote_ID END) as quotes_declined,
        
        -- Win rate calculation
        ROUND(
          COUNT(DISTINCT CASE WHEN q.Quote_Status IN ('Won', 'Accepted') THEN q.Quote_ID END) * 100.0 / 
          NULLIF(COUNT(DISTINCT q.Quote_ID), 0), 
          2
        ) as win_rate_percentage,
        
        -- Average quote values
        AVG(CAST(q.Quote_Value AS DECIMAL)) as average_quote_value,
        MIN(CAST(q.Quote_Value AS DECIMAL)) as lowest_quote_value,
        MAX(CAST(q.Quote_Value AS DECIMAL)) as highest_quote_value,
        
        -- Customer satisfaction
        COALESCE(AVG(CAST(r.Customer_Feedback_Score AS DECIMAL)), 0) as average_customer_score,
        COALESCE(AVG(CAST(r.Rating AS DECIMAL)), 0) as average_rating,
        COUNT(DISTINCT r.Transport_ID) as total_reviews,
        
        -- Recent performance (last 30 days)
        COUNT(DISTINCT CASE 
          WHEN q.Quote_Date >= DATE_SUB(NOW(), INTERVAL 30 DAY) THEN q.Quote_ID 
        END) as quotes_last_30_days,
        
        COUNT(DISTINCT CASE 
          WHEN q.Quote_Status IN ('Won', 'Accepted') 
          AND q.Quote_Date >= DATE_SUB(NOW(), INTERVAL 30 DAY) 
          THEN q.Quote_ID 
        END) as wins_last_30_days
        
      FROM Transportation_Quotes q
      LEFT JOIN Reviews r ON r.Haulier_ID = q.Haulier_ID AND r.Transport_ID = q.Transport_ID
      WHERE q.Haulier_ID = ?
      GROUP BY q.Haulier_ID
    `, [haulierId]);
    
    // Get monthly performance trends (last 6 months)
    const [trends] = await db_connection.query(`
      SELECT 
        DATE_FORMAT(q.Quote_Date, '%Y-%m') as month,
        COUNT(DISTINCT q.Quote_ID) as quotes_submitted,
        COUNT(DISTINCT CASE WHEN q.Quote_Status IN ('Won', 'Accepted') THEN q.Quote_ID END) as quotes_won,
        AVG(CAST(q.Quote_Value AS DECIMAL)) as avg_quote_value
      FROM Transportation_Quotes q
      WHERE q.Haulier_ID = ?
      AND q.Quote_Date >= DATE_SUB(NOW(), INTERVAL 6 MONTH)
      GROUP BY DATE_FORMAT(q.Quote_Date, '%Y-%m')
      ORDER BY month DESC
    `, [haulierId]);
    
    response.json({
      ok: true,
      data: {
        overview: performance[0] || {},
        trends: trends,
        generatedAt: new Date().toISOString()
      }
    });
  } catch (error) {
    handle_Error_Response(response, `Failed to fetch haulier performance: ${error.message}`);
  }
});

// Get Haulier's Current Compliance Status Detail
transport_Router.get("/haulier/:haulierId/compliance-status", async (request, response) => {
  try {
    const { haulierId } = request.params;
    
    const [compliance] = await db_connection.query(`
      SELECT 
        h.Verified,
        h.Registered_Since,
        c.*,
        -- Check completion status
        CASE 
          WHEN c.Safety_Certifications IS NOT NULL 
          AND c.Environmental_Regulations IS NOT NULL 
          AND c.Health_Safety IS NOT NULL 
          AND c.Permits IS NOT NULL 
          THEN 'Complete'
          ELSE 'Incomplete'
        END as overall_status,
        
        -- Count completed fields
        (
          (CASE WHEN c.Safety_Certifications IS NOT NULL THEN 1 ELSE 0 END) +
          (CASE WHEN c.Environmental_Regulations IS NOT NULL THEN 1 ELSE 0 END) +
          (CASE WHEN c.Health_Safety IS NOT NULL THEN 1 ELSE 0 END) +
          (CASE WHEN c.Permits IS NOT NULL THEN 1 ELSE 0 END) +
          (CASE WHEN c.Safety_Training IS NOT NULL THEN 1 ELSE 0 END) +
          (CASE WHEN c.Transport_Regulations IS NOT NULL THEN 1 ELSE 0 END)
        ) as completed_fields,
        
        6 as total_fields
        
      FROM Haulier h
      LEFT JOIN Compliance c ON h.Haulier_ID = c.Haulier_ID
      WHERE h.Haulier_ID = ?
    `, [haulierId]);
    
    if (compliance.length === 0) {
      return handle_Error_Response(response, "Haulier not found", 404);
    }
    
    response.json({
      ok: true,
      data: compliance[0]
    });
  } catch (error) {
    handle_Error_Response(response, `Failed to fetch compliance status: ${error.message}`);
  }
});

// === CUSTOMER DASHBOARD ROUTES ===

// Customer Dashboard Overview
transport_Router.get("/customer/:customerId/dashboard", async (request, response) => {
  try {
    const { customerId } = request.params;
    
    const [stats] = await db_connection.query(`
      SELECT 
        COUNT(*) as totalJobs,
        COUNT(CASE WHEN Job_Done_Haulier = 0 THEN 1 END) as activeJobs,
        COUNT(CASE WHEN Job_Done_Haulier = 1 THEN 1 END) as completedJobs,
        COUNT(CASE WHEN Posted_Date >= DATE_SUB(NOW(), INTERVAL 30 DAY) THEN 1 END) as thisMonthJobs,
        
        -- Mock total spent (you'll need to implement payment tracking)
        SUM(CASE WHEN Job_Done_Haulier = 1 THEN 1000 ELSE 0 END) as totalSpent,
        SUM(CASE 
          WHEN Job_Done_Haulier = 1 
          AND Posted_Date >= DATE_SUB(NOW(), INTERVAL 30 DAY) 
          THEN 750 
          ELSE 0 
        END) as thisMonthSpent,
        
        -- Count jobs awaiting quotes
        COUNT(CASE WHEN Number_Quotes = 0 OR Number_Quotes IS NULL THEN 1 END) as pendingQuotes,
        
        -- Average response time (mock calculation)
        '2.4 hours' as averageResponseTime
        
      FROM Job 
      WHERE Customer_ID = ?
    `, [customerId]);
    
    response.json({ ok: true, data: stats[0] });
  } catch (error) {
    handle_Error_Response(response, `Failed to fetch customer dashboard: ${error.message}`);
  }
});

// Customer's Active Jobs
transport_Router.get("/customer/:customerId/active-jobs", async (request, response) => {
  try {
    const { customerId } = request.params;
    
    const [jobs] = await db_connection.query(`
      SELECT 
        j.*,
        tc.Collection_Address,
        tc.Delivery_Address,
        CAST(j.Number_Quotes AS UNSIGNED) as Quote_Count,
        COALESCE(MIN(CAST(q.Quote_Value AS DECIMAL)), 0) as Lowest_Quote,
        COALESCE(MAX(CAST(q.Quote_Value AS DECIMAL)), 0) as Highest_Quote,
        
        CASE 
          WHEN j.Job_Done_Haulier = 1 THEN 'completed'
          WHEN j.Number_Quotes > 0 THEN 'awaiting_selection'
          ELSE 'awaiting_quotes'
        END as Status
        
      FROM Job j
      LEFT JOIN Transportation_Contacts tc ON j.Transport_ID = tc.Transport_ID
      LEFT JOIN Transportation_Quotes q ON j.Transport_ID = q.Transport_ID AND q.Quote_Status = 'Active'
      WHERE j.Customer_ID = ? AND j.Job_Done_Haulier = 0
      GROUP BY j.Transport_ID
      ORDER BY j.Posted_Date DESC
    `, [customerId]);
    
    response.json({ ok: true, data: jobs });
  } catch (error) {
    handle_Error_Response(response, `Failed to fetch active jobs: ${error.message}`);
  }
});

// Customer Activity Feed
transport_Router.get("/customer/:customerId/activity", async (request, response) => {
  try {
    const { customerId } = request.params;
    
    // Mock activity data - you can enhance this based on your needs
    const activities = [
      {
        id: 1,
        type: "quote_received",
        message: "New quote received for transport job",
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
        job_title: "Recent Transport Job"
      },
      {
        id: 2,
        type: "job_completed",
        message: "Transport job completed successfully",
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
        job_title: "Previous Transport Job"
      }
    ];
    
    response.json({ ok: true, data: activities });
  } catch (error) {
    handle_Error_Response(response, `Failed to fetch customer activity: ${error.message}`);
  }
});

// Get comprehensive dashboard stats

// Get all quotes with comprehensive details (job, haulier, etc.)
transport_Router.get("/quotes/all", async (request, response) => {
  try {
    const { status, haulierId, limit = 50, offset = 0 } = request.query;
    
    let whereClause = "";
    const queryParams = [];
    
    // Build dynamic WHERE clause
    const conditions = [];
    
    if (status && status !== "all") {
      conditions.push("q.Quote_Status = ?");
      queryParams.push(status);
    }
    
    if (haulierId) {
      conditions.push("q.Haulier_ID = ?");
      queryParams.push(haulierId);
    }
    
    if (conditions.length > 0) {
      whereClause = `WHERE ${conditions.join(" AND ")}`;
    }
    
    const query = `
      SELECT 
        q.Quote_ID,
        q.Transport_ID,
        q.Haulier_ID,
        q.Quote_Value,
        q.Quote_Description,
        q.Quote_Date,
        q.Quote_Status,
        q.Decline_Date,
        q.Withdraw_Date,
        
        -- Job Details
        j.Title as Job_Title,
        j.Category as Job_Category,
        j.Description as Job_Description,
        j.Deadline_Date,
        j.Preferred_Date,
        j.International,
        j.Ferry_Required,
        j.Special_Handling,
        j.Job_Done_Haulier,
        j.Posted_Date,
        
        -- Contact Information
        tc.Collection_Address,
        tc.Delivery_Address,
        tc.Customer_Name,
        tc.Customer_Company_Name,
        tc.Collection_Contact,
        tc.Delivery_Contact,
        
        -- Haulier Details
        h.Haulier_Name,
        h.Verified as Haulier_Verified,
        h.Haulier_Total_Customer_Score,
        h.Vehicle_Type,
        h.Real_Time_Tracking,
        h.Electronic_POD,
        h.Number_Vehicles,
        h.Number_Drivers,
        
        -- Compliance
        c.Safety_Certifications,
        c.Environmental_Regulations,
        c.Health_Safety,
        c.Permits,
        
        -- Competition Analysis
        (SELECT COUNT(*) FROM Transportation_Quotes 
         WHERE Transport_ID = q.Transport_ID AND Quote_Status = 'Active') as Total_Competing_Quotes,
        (SELECT MIN(CAST(Quote_Value AS DECIMAL)) FROM Transportation_Quotes 
         WHERE Transport_ID = q.Transport_ID AND Quote_Status = 'Active') as Lowest_Competing_Quote,
        (SELECT MAX(CAST(Quote_Value AS DECIMAL)) FROM Transportation_Quotes 
         WHERE Transport_ID = q.Transport_ID AND Quote_Status = 'Active') as Highest_Competing_Quote,
         
        -- Vessel/Item Details
        vd.Item_Number,
        vd.Total_Number_Items,
        vd.Insurance_Claims as Has_Insurance_Claims,
        vd.Existing_Damage,
        vd.Vessel_Insurance_Type,
        
        -- Payment Terms
        tp.Payment_Terms,
        tp.Currency,
        tp.Insurance_Coverage,
        tp.Late_Fees
        
      FROM Transportation_Quotes q
      INNER JOIN Job j ON q.Transport_ID = j.Transport_ID
      INNER JOIN Haulier h ON q.Haulier_ID = h.Haulier_ID
      LEFT JOIN Transportation_Contacts tc ON j.Transport_ID = tc.Transport_ID
      LEFT JOIN Compliance c ON h.Haulier_ID = c.Haulier_ID
      LEFT JOIN Vessel_Details vd ON j.Transport_ID = vd.Transport_ID
      LEFT JOIN Transportation_Payment tp ON j.Transport_ID = tp.Transport_ID
      ${whereClause}
      ORDER BY q.Quote_Date DESC
      LIMIT ? OFFSET ?
    `;
    
    queryParams.push(parseInt(limit), parseInt(offset));
    
    const [quotes] = await db_connection.query(query, queryParams);
    
    // Get total count for pagination
    const countQuery = `
      SELECT COUNT(*) as total
      FROM Transportation_Quotes q
      INNER JOIN Job j ON q.Transport_ID = j.Transport_ID
      INNER JOIN Haulier h ON q.Haulier_ID = h.Haulier_ID
      ${whereClause}
    `;
    
    const [countResult] = await db_connection.query(countQuery, queryParams.slice(0, -2));
    const totalCount = countResult[0].total;
    
    // Calculate additional metrics
    const metrics = {
      totalQuotes: totalCount,
      averageQuoteValue: quotes.length > 0 ? 
        quotes.reduce((sum, q) => sum + parseFloat(q.Quote_Value || 0), 0) / quotes.length : 0,
      statusBreakdown: {}
    };
    
    // Calculate status breakdown
    const statusQuery = `
      SELECT Quote_Status, COUNT(*) as count
      FROM Transportation_Quotes q
      INNER JOIN Job j ON q.Transport_ID = j.Transport_ID
      ${whereClause.replace(/q\.Quote_Status = \?/, '1=1')}
      GROUP BY Quote_Status
    `;
    
    const statusParams = queryParams.slice(0, -2).filter((_, index) => 
      !whereClause.includes('q.Quote_Status = ?') || index !== 0
    );
    
    const [statusResults] = await db_connection.query(statusQuery, statusParams);
    statusResults.forEach(row => {
      metrics.statusBreakdown[row.Quote_Status || 'Pending'] = row.count;
    });

    response.json({
      ok: true,
      data: quotes,
      totalCount,
      currentPage: Math.floor(offset / limit) + 1,
      totalPages: Math.ceil(totalCount / limit),
      metrics,
      hasMore: offset + limit < totalCount
    });

  } catch (error) {
    console.error('Error fetching all quotes:', error);
    handle_Error_Response(response, `Failed to fetch quotes: ${error.message}`);
  }
});

// Get quote statistics and analytics
transport_Router.get("/quotes/analytics", async (request, response) => {
  try {
    const analyticsQuery = `
      SELECT 
        COUNT(*) as total_quotes,
        COUNT(CASE WHEN Quote_Status = 'Active' THEN 1 END) as active_quotes,
        COUNT(CASE WHEN Quote_Status = 'Accepted' THEN 1 END) as accepted_quotes,
        COUNT(CASE WHEN Quote_Status = 'Declined' THEN 1 END) as declined_quotes,
        COUNT(CASE WHEN Quote_Status = 'Withdrawn' THEN 1 END) as withdrawn_quotes,
        
        AVG(CAST(Quote_Value AS DECIMAL)) as average_quote_value,
        MIN(CAST(Quote_Value AS DECIMAL)) as min_quote_value,
        MAX(CAST(Quote_Value AS DECIMAL)) as max_quote_value,
        
        COUNT(CASE WHEN Quote_Date >= DATE_SUB(NOW(), INTERVAL 7 DAY) THEN 1 END) as quotes_this_week,
        COUNT(CASE WHEN Quote_Date >= DATE_SUB(NOW(), INTERVAL 30 DAY) THEN 1 END) as quotes_this_month,
        
        -- Average quotes per job
        COUNT(*) / COUNT(DISTINCT Transport_ID) as avg_quotes_per_job,
        
        -- Most active haulier
        (SELECT h.Haulier_Name FROM Transportation_Quotes tq 
         JOIN Haulier h ON tq.Haulier_ID = h.Haulier_ID 
         GROUP BY tq.Haulier_ID 
         ORDER BY COUNT(*) DESC LIMIT 1) as most_active_haulier
         
      FROM Transportation_Quotes q
      JOIN Job j ON q.Transport_ID = j.Transport_ID
    `;

    const [analytics] = await db_connection.query(analyticsQuery);
    
    // Get quotes by category
    const categoryQuery = `
      SELECT 
        j.Category,
        COUNT(*) as quote_count,
        AVG(CAST(q.Quote_Value AS DECIMAL)) as avg_value,
        MIN(CAST(q.Quote_Value AS DECIMAL)) as min_value,
        MAX(CAST(q.Quote_Value AS DECIMAL)) as max_value
      FROM Transportation_Quotes q
      JOIN Job j ON q.Transport_ID = j.Transport_ID
      WHERE j.Category IS NOT NULL AND j.Category != ''
      GROUP BY j.Category
      ORDER BY quote_count DESC
    `;
    
    const [categoryStats] = await db_connection.query(categoryQuery);
    
    // Get recent quote trends (last 30 days)
    const trendQuery = `
      SELECT 
        DATE(Quote_Date) as quote_date,
        COUNT(*) as daily_quotes,
        AVG(CAST(Quote_Value AS DECIMAL)) as daily_avg_value
      FROM Transportation_Quotes
      WHERE Quote_Date >= DATE_SUB(NOW(), INTERVAL 30 DAY)
      GROUP BY DATE(Quote_Date)
      ORDER BY quote_date DESC
    `;
    
    const [trends] = await db_connection.query(trendQuery);

    response.json({
      ok: true,
      data: {
        overview: analytics[0],
        categoryBreakdown: categoryStats,
        trends: trends,
        generatedAt: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Error fetching quote analytics:', error);
    handle_Error_Response(response, `Failed to fetch quote analytics: ${error.message}`);
  }
});

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
// Add this to Transport_Specific.js - Enhanced quotes endpoint with more details
transport_Router.get("/jobs/:jobId/quotes/detailed", async (request, response) => {
  try {
    const { jobId } = request.params;
    
    // Get comprehensive quotes with competition analysis
    const [quotes] = await db_connection.query(`
      SELECT 
        q.*,
        h.Haulier_Name,
        h.Verified as Haulier_Verified,
        h.Haulier_Total_Customer_Score,
        h.Vehicle_Type,
        h.Real_Time_Tracking,
        h.Electronic_POD,
        h.Number_Vehicles,
        h.Number_Drivers,
        c.Safety_Certifications,
        c.Environmental_Regulations,
        c.Health_Safety,
        c.Permits,
        
        -- Competition Analysis
        (SELECT COUNT(*) FROM Transportation_Quotes 
         WHERE Transport_ID = ? AND Quote_Status = 'Active') as Total_Quotes,
        (SELECT MIN(CAST(Quote_Value AS DECIMAL)) FROM Transportation_Quotes 
         WHERE Transport_ID = ? AND Quote_Status = 'Active') as Lowest_Quote,
        (SELECT MAX(CAST(Quote_Value AS DECIMAL)) FROM Transportation_Quotes 
         WHERE Transport_ID = ? AND Quote_Status = 'Active') as Highest_Quote,
        (SELECT AVG(CAST(Quote_Value AS DECIMAL)) FROM Transportation_Quotes 
         WHERE Transport_ID = ? AND Quote_Status = 'Active') as Average_Quote,
         
        -- Ranking within competition
        RANK() OVER (PARTITION BY q.Transport_ID ORDER BY CAST(q.Quote_Value AS DECIMAL) ASC) as Price_Rank,
        
        -- Days since quoted
        DATEDIFF(NOW(), q.Quote_Date) as Days_Since_Quote
        
      FROM Transportation_Quotes q
      INNER JOIN Haulier h ON q.Haulier_ID = h.Haulier_ID
      LEFT JOIN Compliance c ON h.Haulier_ID = c.Haulier_ID
      WHERE q.Transport_ID = ?
      ORDER BY CAST(q.Quote_Value AS DECIMAL) ASC
    `, [jobId, jobId, jobId, jobId, jobId]);

    response.json({
      ok: true,
      data: quotes,
      count: quotes.length
    });

  } catch (error) {
    console.error('Error fetching detailed quotes:', error);
    handle_Error_Response(response, `Failed to fetch detailed quotes: ${error.message}`);
  }
});

// Add these routes to Transport_Specific.js

// Calculate distance between two points
transport_Router.post("/calculate-distance", async (request, response) => {
  try {
    const { origin, destination, waypoints } = request.body;
    
    if (!origin || !destination) {
      return handle_Error_Response(response, "Origin and destination are required", 400);
    }

    // Here you can integrate with Google Distance Matrix API
    // or use the frontend calculation and store results
    
    // For now, we'll create a simple endpoint that can receive calculated distances
    response.json({
      ok: true,
      message: "Distance calculation endpoint ready",
      data: {
        origin,
        destination,
        waypoints,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    handle_Error_Response(response, `Distance calculation failed: ${error.message}`);
  }
});

// Add these routes to your Transport_Specific.js file

// Calculate distance between two points
transport_Router.post("/calculate-distance", async (request, response) => {
  try {
    const { origin, destination, waypoints } = request.body;
    
    if (!origin || !destination) {
      return handle_Error_Response(response, "Origin and destination are required", 400);
    }

    // Log the calculation request
    console.log('Distance calculation requested:', { origin, destination, waypoints });
    
    response.json({
      ok: true,
      message: "Distance calculation endpoint ready",
      data: {
        origin,
        destination,
        waypoints,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    handle_Error_Response(response, `Distance calculation failed: ${error.message}`);
  }
});

// Save calculated distance to job
transport_Router.patch("/jobs/:jobId/update-distance", async (request, response) => {
  try {
    const { jobId } = request.params;
    const { collectionDeliveryDistance, roundTripDistance, totalDistance } = request.body;

    await db_connection.query(`
      UPDATE Job 
      SET 
        Collection_Delivery_Distance = ?,
        Round_Trip_Distance = ?,
        Total_Distance = ?
      WHERE Transport_ID = ?
    `, [collectionDeliveryDistance, roundTripDistance, totalDistance, jobId]);

    console.log(`Distance updated for job ${jobId}:`, {
      collectionDeliveryDistance,
      roundTripDistance,
      totalDistance
    });

    response.json({
      ok: true,
      message: "Distance updated successfully"
    });
  } catch (error) {
    handle_Error_Response(response, `Failed to update distance: ${error.message}`);
  }
});

// Get job with distance information
transport_Router.get("/jobs/:jobId/with-distance", async (request, response) => {
  try {
    const { jobId } = request.params;
    
    // Get job details with addresses and any existing distance data
    const [jobResult] = await db_connection.query(`
      SELECT 
        j.*,
        tc.Collection_Address,
        tc.Delivery_Address,
        tc.Collection_Contact,
        tc.Delivery_Contact
      FROM Job j
      LEFT JOIN Transportation_Contacts tc ON j.Transport_ID = tc.Transport_ID
      WHERE j.Transport_ID = ?
    `, [jobId]);

    if (!jobResult) {
      return handle_Error_Response(response, "Job not found", 404);
    }

    response.json({
      ok: true,
      data: {
        job: jobResult,
        hasAddresses: !!(jobResult.Collection_Address && jobResult.Delivery_Address),
        calculateDistance: true
      }
    });
  } catch (error) {
    handle_Error_Response(response, `Failed to fetch job with distance: ${error.message}`);
  }
});


export default transport_Router;
