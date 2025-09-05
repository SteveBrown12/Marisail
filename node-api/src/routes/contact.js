import express from "express";
import db_connection from "../config/dbConfig.js";

const router = express.Router();

// POST: Add contact details
router.post("/", async (req, res) => {
  console.log('cookie', req.cookies);
  // console.log('req', req);
  try {
    const {
      title,
      firstName,
      lastName,
      landline,
      mobile,
      email,
      privateTrade,
      personalRole,
      companyName,
      companyType,
      country,
      state,
      city,
      address1,
      address2,
      address3,
      postcode,
    } = req.body;

    const [result] = await db_connection.query(
      `INSERT INTO Marisail_Contact_Details 
      VALUES (null, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        title,
        firstName,
        lastName,
        landline,
        mobile,
        email,
        privateTrade,
        personalRole,
        companyName,
        companyType,
        address1,
        address2,
        address3,
        city,
        state,
        country,
        postcode,
      ]
    );

    res
      .status(201)
      .json({ message: "Contact added successfully", id: result.insertId });
  } catch (error) {
    console.error("Error inserting contact:", error);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
