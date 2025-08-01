import { Router } from "express";
import multer from "multer";
import { createConnection } from "mysql2";
import { v4 as uuidv4 } from "uuid"; // For generating random keys
import connection from "../config/dbConfig.js";

const router = Router();

// const upload = multer({
//   storage: multer.diskStorage({
//     destination: "public/uploads", // Adjusted path
//     filename: (req, file, cb) => {
//       const randomKey = uuidv4(); // Generate a random key
//       const fileName = `${randomKey}-${file.originalname}`; // Create a unique file name
//       cb(null, fileName);
//     },
//   }),
// });

const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, path.join(__dirname, "public", "uploads")); // Set upload destination
    },
    filename: (req, file, cb) => {
      const randomKey = uuidv4(); // Generate a random file name
      const fileName = `${randomKey}-${file.originalname}`; // Unique file name
      cb(null, fileName);
    },
  }),
});

// Handle file uploads
router.post("/upload-media", upload.array("payloads"), async (req, res) => {
  try {
    const { previews } = req.body; // Get the array of previews from the request body
    const files = req.files; // Get the uploaded files

    // Parse the previews from JSON string
    const previewUrls = Array.isArray(previews)
      ? previews
      : JSON.parse(previews);

    if (!previewUrls || files.length === 0) {
      return res.status(400).json({ message: "Invalid input" });
    }


    // Prepare the SQL statement
    const sql = "INSERT INTO media_uploads (url, file_location) VALUES (?, ?)";
    const promises = files.map((file, index) => {
      const fileLocation = `/uploads/${file.filename}`; // File location
      const url = previewUrls[index]; // Corresponding preview URL
      return connection.execute(sql, [url, fileLocation]);
    });


    res.status(200).json({
      message: "Files uploaded and data saved successfully",
      data: previewUrls,
    });
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
