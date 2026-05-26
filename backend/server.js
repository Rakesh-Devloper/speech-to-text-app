const Transcription = require("./models/Transcription");

require("dotenv").config();

const express = require("express");
const cors = require("cors");
const multer = require("multer");
const mongoose = require("mongoose");
const fs = require("fs");

const OpenAI = require("openai").default;

// Express App
const app = express();

app.use(cors());

app.use(express.json());

// OpenAI Client
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Multer Storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },

  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

// Upload Middleware with Validation
const upload = multer({
  storage,

  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      "audio/mpeg",
      "audio/wav",
      "audio/webm",
      "audio/mp3",
    ];

    if (!allowedTypes.includes(file.mimetype)) {
      return cb(
        new Error(
          "Invalid file type. Only audio files are allowed."
        )
      );
    }

    cb(null, true);
  },

  limits: {
    fileSize: 10 * 1024 * 1024,
  },
});

// Upload Route
app.post(
  "/upload",
  upload.single("audio"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          error: "No audio file uploaded",
        });
      }

      // Whisper Transcription
      const transcription =
        await client.audio.transcriptions.create({
          file: fs.createReadStream(req.file.path),
          model: "whisper-1",
        });

      // Save to MongoDB
     await Transcription.create({
  fileName: req.file.originalname,
  transcription: transcription.text,
  userEmail: req.body.userEmail,
});

      res.json({
        message: "File uploaded successfully",
        transcription: transcription.text,
      });

    } catch (error) {

      console.log(error);

      if (
        error.message.includes(
          "Invalid file type"
        )
      ) {
        return res.status(400).json({
          error: error.message,
        });
      }

      if (
        error.code === "LIMIT_FILE_SIZE"
      ) {
        return res.status(400).json({
          error:
            "File size should be less than 10MB",
        });
      }

      res.status(500).json({
        error:
          "Transcription failed due to server error",
      });
    }
  }
);

// Get Transcriptions
app.get(
  "/transcriptions",
  async (req, res) => {
    try {
      const history =
        await Transcription.find().sort({
          createdAt: -1,
        });

      res.json(history);

    } catch (error) {

      console.log(error);

      res.status(500).json({
        error:
          "Failed to fetch transcriptions",
      });
    }
  }
);

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)

  .then(() => {
    console.log(
      "MongoDB Connected Successfully"
    );
  })

  .catch((error) => {
    console.log(error);
  });

// Test Route
app.get("/", (req, res) => {
  res.send("Backend server is running");
});

// Server
const port = 5000;

app.listen(port, () => {
  console.log(
    `Server is running on port ${port}`
  );
});