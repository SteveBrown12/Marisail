import { Router } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";
import { fileURLToPath } from "url";
import ffmpeg from "fluent-ffmpeg";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const upload_Router = Router();
const image_Types = [  "image/jpeg", "image/png", "image/gif", "image/webp", "image/bmp", "image/svg+xml"];
const video_Types = [  "video/mp4", "video/webm", "video/ogg", "video/quicktime", "video/x-msvideo"];

// Utility to create multer storage for a given folder

const create_Storage = folder_Name => multer.diskStorage({
  destination: (request, file, call_Back) => {
    const upload_Directory  = path.join(__dirname, "../../public/uploads", folder_Name);
    fs.mkdirSync(upload_Directory , { recursive: true });
    call_Back(null, upload_Directory );
  },
  filename: (request, file, call_Back) => {
    call_Back(null, `${uuidv4()}-${file.originalname}`);
  }
});

// Multer upload instances per type

const image_Upload = multer({
  storage: create_Storage("images"),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit for images
  fileFilter: (request, file, call_Back) => {
    if (image_Types.includes(file.mimetype)) call_Back(null, true);
    else call_Back(new Error("Unsupported image file type"), false);
  }
});

const video_Upload = multer({
  storage: create_Storage("videos"),
  limits: { fileSize: 200 * 1024 * 1024 }, // 200MB limit for videos
  fileFilter: (request, file, call_Back) => {
    if (video_Types.includes(file.mimetype)) call_Back(null, true);
    else call_Back(new Error("Unsupported video file type"), false);
  }
});

// Image upload route

upload_Router.post("/upload-images", image_Upload.array("images", 10), (request, res) => {
  if (!request.files || request.files.length === 0) {
    return res.status(400).json({ ok: false, error: "No images uploaded" });
  }
  const files_Data = request.files.map(file => ({
    filename: file.filename,
    originalname: file.originalname,
    mimetype: file.mimetype,
    size: file.size,
    url: `/uploads/images/${file.filename}`
  }));
  res.status(201).json({ ok: true, files: files_Data });
});

// Video upload route with duration check (max 3 min)

upload_Router.post("/upload-videos", video_Upload.array("videos", 5), async (request, res) => {
  if (!request.files || request.files.length === 0) {
    return res.status(400).json({ ok: false, error: "No videos uploaded" });
  }

  // Duration check for each video
  try {
    for (const file of request.files) {
      await new Promise((resolve, reject) => {
        ffmpeg.ffprobe(file.path, function(err, metadata) {
          if (err) return reject(new Error("Could not analyze video"));
          if (metadata.format.duration > 180) { // 3 min = 180 sec
            fs.unlinkSync(file.path); // Delete over-long video
            return reject(new Error(`Video '${file.originalname}' exceeds 3 minutes`));
          }
          resolve();
        });
      });
    }
  } catch (error) {
    return res.status(400).json({ ok: false, error: error.message });
  }

  // Prepare file data if all checks pass
  const files_Data = request.files.map(file => ({
    filename: file.filename,
    originalname: file.originalname,
    mimetype: file.mimetype,
    size: file.size,
    url: `/uploads/videos/${file.filename}`
  }));
  res.status(201).json({ ok: true, files: files_Data });
});


export default upload_Router;
