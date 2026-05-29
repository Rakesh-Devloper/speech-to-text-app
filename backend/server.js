const Transcription = require("./models/Transcription");

require("dotenv").config();

const express = require("express");
const cors = require("cors");
const multer = require("multer");
const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");

const Groq = require("groq-sdk");

// Express App
const app = express();

app.use(cors());

app.use(express.json());

// Groq API Client
const client = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const uploadsDir = path.join(__dirname, "uploads");

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Multer Storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },

  filename: (req, file, cb) => {
    cb(
      null,
      Date.now() + "-" + file.originalname
    );
  },
});

// Upload Middleware with Validation
const upload = multer({
  storage,

  fileFilter: (
    req,
    file,
    cb
  ) => {

    const allowedTypes = [
      "audio/mpeg",
      "audio/wav",
      "audio/webm",
      "audio/mp3",
      "audio/x-wav",
      "audio/m4a",
      "audio/mp4",
    ];

    if (
      !allowedTypes.includes(
        file.mimetype
      )
    ) {

      return cb(
        new Error(
          "Invalid file type. Only audio files are allowed."
        )
      );
    }

    cb(null, true);
  },

  limits: {
    fileSize:
      50 * 1024 * 1024,
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
          error:
            "No audio file uploaded",
        });
      }

      console.log(
        "BODY:",
        req.body
      );

      console.log(
        "FILE:",
        req.file
      );
      console.log("FILE PATH:", req.file.path);
console.log("FILE EXISTS:", fs.existsSync(req.file.path));

      // Whisper Transcription
     console.log("FILE PATH:", req.file.path);
console.log("FILE EXISTS:", fs.existsSync(req.file.path));

if (!fs.existsSync(req.file.path)) {
  return res.status(500).json({
    error: `File not found: ${req.file.path}`,
  });
}

const transcription =
  await client.audio.transcriptions.create({
    file: fs.createReadStream(req.file.path),
    model: "whisper-large-v3",
    response_format: "json",
  });
      // Save to MongoDB
      await Transcription.create({
        fileName:
          req.file.originalname,

        transcription:
          transcription.text,

        userEmail:
          req.body.userEmail,

        type:
          req.body.type,
      });

      res.json({
        success: true,

        message:
          "File uploaded successfully",

        transcription:
          transcription.text,
      });

    } catch (error) {

      console.log(error);

      // Invalid File
      if (
        error.message &&
        error.message.includes(
          "Invalid file type"
        )
      ) {

        return res.status(400).json({
          error:
            error.message,
        });
      }

      // File Size
      if (
        error.code ===
        "LIMIT_FILE_SIZE"
      ) {

        return res.status(400).json({
          error:
            "File size should be less than 50MB",
        });
      }

      // Groq Error
      if (
        error.error &&
        error.error.error
      ) {

        return res.status(500).json({
          error:
            error.error.error
              .message,
        });
      }

      res.status(500).json({
        error:
          "Transcription failed due to server error",
      });
    }
  }
);

// Get User Transcriptions
app.get(
  "/transcriptions/:email",

  async (req, res) => {

    try {

      const history =
        await Transcription.find({
          userEmail:
            req.params.email,
        }).sort({
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



app.get(
  "/delete-all",
  async (req, res) => {

    try {

      await Transcription.deleteMany({});

      res.json({
        message:
          "All records deleted",
      });

    } catch (error) {

      console.log(error);

      res.status(500).json({
        error:
          "Delete failed",
      });
    }
  }
);

// MongoDB Connection
// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)

  .then(() => {

    console.log(
      "MongoDB Connected Successfully"
    );

    const PORT =
      process.env.PORT || 5000;

    app.listen(PORT, () => {

      console.log(
        `Server is running on port ${PORT}`
      );
    });
  })

  .catch((error) => {

    console.log(
      "MongoDB Connection Error:"
    );

    console.log(error);
  });