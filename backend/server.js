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


// Upload Middleware
const upload = multer({ storage });


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
      });

      res.json({
        message: "File uploaded successfully",
        transcription: transcription.text,
      });
    } catch (error) {
      console.log(error);

      res.status(500).json({
        error: "Transcription failed",
      });
    }
  }
);

app.get("/transcriptions", async (req, res) => {
  try {
    const history =
      await Transcription.find().sort({
        createdAt: -1,
      });

    res.json(history);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      error: "Failed to fetch transcriptions",
    });
  }
});

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)

  .then(() => {

    console.log("MongoDB Connected Successfully");
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

  console.log(`Server is running on port ${port}`);
});