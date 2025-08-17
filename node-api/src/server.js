import createError from "http-errors";
import express, { json, urlencoded } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import logger from "morgan";
import authRoutes from "./index.js";
import uploadRouter from "./routes/upload-media.js"; // Import your upload route
import path from "path";
import { fileURLToPath } from "url";

var server = express();
const allowOrigins = ['https://test.marisail.com', 'http://localhost:5173', 'http://37.148.203.193:4173']
const corsOptions = {
  // origin: ['*'],
  origin: allowOrigins,
  methods: ["GET", "POST", "PUT"], // Allow the necessary methods
  allowedHeaders: ["Content-Type", "Authorization"], // allowed content types
};
server.use(cors(corsOptions));
server.use(logger("dev"));
server.use(json());
server.use(urlencoded({ extended: false }));
server.use(cookieParser());
server.use("/api", authRoutes);
server.use("/api", uploadRouter);

// catch 404 and forward to error handler
server.get("/", (req, res) => {
  return res.status(200).json({
    ok: true,
    message: "root route, tested deploy 5",
  });
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

server.use(express.static(path.join(__dirname, "public")));
server.get("/server/healthCheck", (req, res) => {
  res.json({ message: "Hello from the backend!" });
});
server.use((req, res, next) => {
  res.status(404).json({ message: "Not Found" });
});
server.use((req, res, next) => {
  // console.log(`Incoming request: ${req.method} ${req.url}`);
  next();
});
// usin .env PORT value or the pm2 its ok
var port = process.env.PORT || "3000";

server.listen(port, () => {
  console.log(`Running on port ` + port);
});
export default server;
