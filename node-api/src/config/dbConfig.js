import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

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

//dont change

export default connection;
