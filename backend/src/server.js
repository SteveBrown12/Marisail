import express, { json, urlencoded } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import logger from "morgan";
import path from "path";
import createError from "http-errors";
import dotenv from "dotenv";

import { handleJwtError } from "./middleware/auth0.js";
import apiRouter from "./router.js";

dotenv.config();

const app = express();

// ---------- Middlewares ----------
app.use(cors());
app.use(logger("dev"));
app.use(json());
app.use(urlencoded({ extended: false }));
app.use(cookieParser());
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// ---------- Routes ----------
app.use("/api", apiRouter);

// ---------- Health Check ----------
app.get("/", (req, res) => res.json({ ok: true, message: "root route" }));
app.get("/server/healthCheck", (req, res) => res.json({ message: "Hello from the backend!" }));

// ---------- Error Handling ----------
app.use(handleJwtError);
app.use((req, res, next) => next(createError(404)));

// ---------- Start Server ----------
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Server running on PORT:${PORT}`);
});
