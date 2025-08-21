import createError from "http-errors";
import express, { json, urlencoded } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import logger from "morgan";
import authRoutes from "./index.js";
import dotenv from 'dotenv';
import path from "path";

dotenv.config();

import './testDB.js'; // for testing db connection

var server = express();
server.use(cors());
server.use(logger("dev"));
server.use(json());
server.use(urlencoded({ extended: false }));
server.use(cookieParser());
server.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));
server.use("/api", authRoutes);

// catch 404 and forward to error handler
server.get("/", (req, res) => {
  return res.status(200).json({
    ok: true,
    message: "root route",
  });
});
server.get("/server/healthCheck", (req, res) => {
  res.json({ message: "Hello from the backend!" });
});
server.use(function (req, res, next) {
  next(createError(404));
});
server.listen(process.env.PORT || 3001, () => {
  console.log(`Running on ${process.env.PORT || 3001}`);
});
export default server; 
