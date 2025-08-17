import { Router } from "express";
import dbConnection from "../config/dbConfig.js";

const homeRouter = Router();

//API call from frontend - http://localhost:3001/api/home/
homeRouter.get("/", (req, res) => {
  console.log("Inside home...");
  res.json({ message: "Home route" });
});

//API call from frontend - http://localhost:3001/api/main/
homeRouter.get("/main/", (req, res) => {
    console.log("Inside home amin page...");
    res.json({ message: "Home main page route" });
});

homeRouter.get("/sponsors/", async (req, res) => {
  let connection;
  try {
    connection = await dbConnection.getConnection();
    const [rows] = await connection.query(
      "SELECT * FROM Sponsers ORDER BY Payment DESC LIMIT 30"
    );
    return res.status(200).json({ ok: true, result: rows });
  } catch (err) {
    return res.status(500).json({ ok: false, message: err.message });
  } finally {
    connection.release();
  }
});

export default homeRouter;
