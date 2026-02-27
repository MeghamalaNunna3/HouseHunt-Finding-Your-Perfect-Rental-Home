import express from "express";
import multer from "multer";
import rateLimit from "express-rate-limit";
import { GridFSBucket, ObjectId } from "mongodb";
import cron from "node-cron";
import mongoose from "mongoose";

const router = express.Router();

// Multer: in-memory storage with 2 MB limit
const upload = multer({ limits: { fileSize: 2 * 1024 * 1024 } });

// Rate limit: 5 uploads per IP per minute
const uploadLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 5,
  message: "Too many uploads from this IP. Try again later.",
});

// GridFS bucket
let bucket;
mongoose.connection.once("open", () => {
  bucket = new GridFSBucket(mongoose.connection.db, { bucketName: "images" });
  console.log("📦 GridFS bucket ready");
});

// Public upload
router.post("/", uploadLimiter, upload.single("file"), (req, res, next) => {
  if (!req.file)
    return res.status(400).send("No file uploaded or file too large.");
  if (!req.file.mimetype.startsWith("image/"))
    return res.status(400).send("Only images allowed.");

  const uploadStream = bucket.openUploadStream(req.file.originalname, {
    contentType: req.file.mimetype,
  });

  uploadStream.end(req.file.buffer);
  uploadStream.on("finish", () =>
    res.json({ success: true, fileId: uploadStream.id })
  );
  uploadStream.on("error", next);
});

// Public download
router.get("/:id", (req, res, next) => {
  try {
    const fileId = new ObjectId(req.params.id);
    const downloadStream = bucket.openDownloadStream(fileId);
    downloadStream.on("error", () => res.status(404).send("File not found"));
    downloadStream.pipe(res);
  } catch {
    res.status(400).send("Invalid file ID");
  }
});

// Auto-delete old files every day at midnight
cron.schedule("0 0 * * *", async () => {
  const daysOld = 7; // keep files for 7 days
  const cutoff = new Date(Date.now() - daysOld * 24 * 60 * 60 * 1000);
  const filesCollection = mongoose.connection.db.collection("images.files");

  const oldFiles = await filesCollection
    .find({ uploadDate: { $lt: cutoff } })
    .toArray();
  for (const file of oldFiles) {
    await bucket.delete(file._id);
    console.log(`🗑 Deleted old file: ${file.filename}`);
  }
});

export default router;
