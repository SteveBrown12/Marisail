import dotenv from "dotenv";
dotenv.config();
import mysql from "mysql2/promise";




const ENVIRONMENT = process?.env;

const connection = mysql.createPool({
  host: ENVIRONMENT.DB_HOST,
  user: ENVIRONMENT.DB_USER,
  password: ENVIRONMENT.DB_PASS,
  database: ENVIRONMENT.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  // debug: true, // Activa el modo debug
});
console.log("🧪 Loaded DB config:", {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
});

//dont change
console.log("📁 Current working dir:", process.cwd());


export default connection;
