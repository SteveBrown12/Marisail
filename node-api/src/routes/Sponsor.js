import express from "express";
import db_connection from "../config/dbConfig.js";
import multer from "multer";
import path from "path";

const router = express.Router();

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
    const [rows] = await db_connection.query(
      "SELECT * FROM Sponsers WHERE Payment_Date >= DATE_SUB(NOW(), INTERVAL 1 YEAR) ORDER BY Payment DESC, Payment_Date DESC LIMIT 30"
    );
    res.json(rows);
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
