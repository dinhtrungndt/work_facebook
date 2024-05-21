var express = require("express");
var router = express.Router();
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const cloudinaryModel = require("../models/cloudinary");

// Cấu hình Cloudinary
cloudinary.config({
  cloud_name: "daax9zi8i",
  api_key: "376591774628556",
  api_secret: "eNQQQuVzK7LjhezzBlX-q10DwZU",
  secure: true,
  cdn_subdomain: true,
  chunk_size: 6000000,
  timeout: 60000,
  concurrency: 4,
});

const storage = multer.diskStorage({
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB max file size
  },
  fileFilter: function (req, file, cb) {
    if (file.mimetype.startsWith("image/") || file.mimetype.startsWith("video/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image and video files are allowed!"), false);
    }
  },
});

// Lấy danh sách các cloudinary
// http://localhost:3000/cloudinary
router.get("/", async (req, res) => {
  const data = await cloudinaryModel.find();
  res.json(data);
});

// Upload file lên Cloudinary
// http://localhost:3000/cloudinary/upload-cloudinary
router.post("/upload-cloudinary", upload.single("cloudinary"), async (req, res, next) => {
  try {
    const { file } = req;

    if (!file) {
      return res.json({ status: 0, message: "No file uploaded" });
    }

    let result;
    if (file.mimetype.startsWith("image/")) {
      result = await cloudinary.uploader.upload(file.path, {
        resource_type: "image",
        width: 1920, // Chiều rộng mong muốn
        height: 1080, // Chiều cao mong muốn
        crop: "limit" // Cách crop ảnh
      });
    } else if (file.mimetype.startsWith("video/")) {
      result = await cloudinary.uploader.upload(file.path, {
        resource_type: "video",
        width: 1920, // Chiều rộng mong muốn
        height: 1080, // Chiều cao mong muốn
        crop: "limit" // Cách crop video
      });
    }

    if (result && result.secure_url) {
      return res.json({ status: 1, url: result.secure_url });
    } else {
      return res.json({ status: 0, message: "Failed to upload file to Cloudinary" });
    }
  } catch (error) {
    console.log("Upload media error: ", error);
    return res.json({ status: 0, message: "Error uploading file to Cloudinary" });
  }
});

module.exports = router;
