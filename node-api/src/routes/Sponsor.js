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
    const {
      Contact_Name,
      Company_Name,
      Payment_Value,
      Currency,
      Payment_Date,
    } = req.body;

    if (
      !Contact_Name ||
      !Company_Name ||
      !Payment_Value ||
      !Currency ||
      !Payment_Date
    ) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const logoPath = req.file ? req.file.filename : null;

    const [result] = await db_connection.query(
      `INSERT INTO Sponsers 
      (Contact_Name, Company_Name, Payment, Currency, Payment_Date, Logo) 
      VALUES (?, ?, ?, ?, ?, ?)`,
      [
        Contact_Name,
        Company_Name,
        Payment_Value,
        Currency,
        Payment_Date,
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
      "SELECT * FROM Sponsers ORDER BY Payment DESC LIMIT 30"
    );
    res.json(rows);
  } catch (error) {
    console.error("Error fetching sponsors:", error);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
