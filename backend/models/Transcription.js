const mongoose = require("mongoose");

const transcriptionSchema =
  new mongoose.Schema(
    {
      fileName: {
        type: String,
        required: true,
      },

      transcription: {
        type: String,
        required: true,
      },

      userEmail: {
        type: String,
      },
    },
    {
      timestamps: true,
    }
  );

module.exports = mongoose.model(
  "Transcription",
  transcriptionSchema
);