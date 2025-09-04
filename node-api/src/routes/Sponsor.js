import express from "express";
import db_connection from "../config/dbConfig.js";
import multer from "multer";
import path from "path";

const router = express.Router();

const SPONSOR_GUARANTEE_MONTHS = 6;

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + ext);
  },
});

const upload = multer({ storage });

// POST: Add a new sponsor
router.post("/", upload.single("Logo"), async (req, res) => {
  try {
    const { Contact_Name, Company_Name, Payment_Value, Currency } = req.body;

    if (!Contact_Name || !Company_Name || !Payment_Value || !Currency) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const logoPath = req.file ? req.file.filename : null;

    const [result] = await db_connection.query(
      `INSERT INTO Sponsers 
      (Contact_Name, Company_Name, Payment, Currency, Payment_Date, Logo) 
      VALUES (?, ?, ?, ?, NOW(), ?)`, 
      [
        Contact_Name,
        Company_Name,
        Payment_Value,
        Currency,
        logoPath,
      ]
    );

    res
      .status(201)
      .json({ message: "Sponsor added successfully", id: result.insertId });
  } catch (error) {
    console.error("Error inserting sponsor:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// GET: Fetch all sponsors
router.get("/", async (req, res) => {
  try {
    const complexQuery = `
      WITH SponsorEntryDates AS (
        SELECT
            Company_Name,
            MIN(snapshot_date) AS first_entry_date
        FROM (
            SELECT
                s1.Company_Name,
                s1.Payment_Date as snapshot_date,
                (
                    SELECT COUNT(DISTINCT s2.Company_Name) + 1
                    FROM Sponsers s2
                    WHERE s2.Payment > s1.Payment
                    AND s2.Payment_Date <= s1.Payment_Date
                    AND s2.Payment_Date >= DATE_SUB(s1.Payment_Date, INTERVAL 1 YEAR)
                ) AS daily_rank
            FROM Sponsers s1
            WHERE s1.Payment_Date >= DATE_SUB(NOW(), INTERVAL (? + 12) MONTH)
        ) AS RankHistory
        WHERE daily_rank <= 30
        GROUP BY Company_Name
      ),
      PotentialGuaranteed AS (
          SELECT Company_Name, first_entry_date
          FROM SponsorEntryDates
          WHERE first_entry_date >= DATE_SUB(NOW(), INTERVAL ? MONTH)
      ),
      GuaranteedSponsors AS (
          SELECT Company_Name
          FROM (
              SELECT Company_Name,
                     ROW_NUMBER() OVER (ORDER BY first_entry_date ASC, Company_Name ASC) AS rn
              FROM PotentialGuaranteed
          ) ranked
          WHERE rn <= 30
      ),
      NonGuaranteedRanked AS (
          SELECT
              Company_Name,
              ROW_NUMBER() OVER (ORDER BY SUM(Payment) DESC) AS rn
          FROM Sponsers
          WHERE
              Payment_Date >= DATE_SUB(NOW(), INTERVAL 12 MONTH)
              AND Company_Name NOT IN (SELECT Company_Name FROM GuaranteedSponsors)
          GROUP BY Company_Name
      ),
      FinalList AS (
          SELECT Company_Name, 1 AS priority
          FROM GuaranteedSponsors
          UNION ALL
          SELECT Company_Name, 2 AS priority
          FROM NonGuaranteedRanked
          WHERE rn <= GREATEST(0, 30 - (SELECT COUNT(*) FROM GuaranteedSponsors))
      )
      SELECT s.*
      FROM Sponsers s
      JOIN (
          SELECT Company_Name, priority
          FROM FinalList
          -- Ensure hard cap of 30 with guaranteed priority
          ORDER BY priority ASC
          LIMIT 30
      ) AS fsn ON s.Company_Name = fsn.Company_Name
      JOIN (
          SELECT Company_Name, MAX(Payment_Date) AS max_date
          FROM Sponsers
          WHERE Company_Name IN (SELECT Company_Name FROM FinalList)
          GROUP BY Company_Name
      ) AS latest ON s.Company_Name = latest.Company_Name AND s.Payment_Date = latest.max_date
      ORDER BY fsn.priority ASC, s.Payment DESC, s.Payment_Date DESC;
    `;
    
    const [rows] = await db_connection.query(complexQuery, [SPONSOR_GUARANTEE_MONTHS, SPONSOR_GUARANTEE_MONTHS]);

    const sponsors = rows;
    res.json(sponsors);

  } catch (error) {
    console.error("Error fetching sponsors:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// To calculate the sponsor rank
router.get("/rank-preview/:payment_Value", async (request, response) => {
  try {
    const { payment_Value } = request.params;
    //Finding the rank
    const [rows] = await db_connection.query(
      `SELECT COUNT(*) + 1 AS potential_Rank FROM Sponsers WHERE Payment > ? AND Payment_Date >= DATE_SUB(NOW(), INTERVAL 1 YEAR)`,
      [payment_Value]
    );
    response.json(rows[0]);
  } catch (error) {
    console.error("Error fetching the rank preview", error);
    response.status(500).json({ error: "Server Error" });
  }
});
export default router;