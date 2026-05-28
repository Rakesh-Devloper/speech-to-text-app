import React, { useState } from "react";

import {
  SignedIn,
  SignedOut,
  useUser,
} from "@clerk/clerk-react";
function UploadSection() {

  const { user } = useUser();

  const [selectedFile, setSelectedFile] =
    useState(null);

  const [transcription, setTranscription] =
    useState("");

  // Select File
  const handleFileChange = (e) => {

    setSelectedFile(
      e.target.files[0]
    );
  };

  const handleUpload = async () => {

  // USER NOT LOGGED IN
  if (!user) {

    window.location.href = "/sign-up";

    return;
  }

  // NO FILE
  if (!selectedFile) {

    alert("Please choose audio file");

    return;
  }

  try {

    const formData = new FormData();

    formData.append(
      "audio",
      selectedFile
    );

    formData.append(
      "type",
      "upload"
    );

    formData.append(
      "userEmail",
      user?.primaryEmailAddress?.emailAddress
    );

    const response = await fetch(
      "http://localhost:5000/upload",
      {
        method: "POST",
        body: formData,
      }
    );

    const data =
      await response.json();

    if (response.ok) {

      setTranscription(
        data.transcription
      );
    }

  } catch (error) {

    console.log(error);
  }
};

  return (

    <div
      className="
      bg-[#07140d]
      border border-green-500/20
      shadow-[0_0_25px_rgba(34,197,94,0.15)]
      p-10
      rounded-3xl
    "
    >

      <h2 className="text-5xl font-extrabold text-center mb-6 text-white">

        Upload Audio For{" "}

        <span
          className="
          bg-gradient-to-r
          from-green-400
          to-green-600
          bg-clip-text
          text-transparent
        "
        >
          AI Transcription
        </span>

      </h2>

      <p
        className="
        text-gray-400
        text-center
        text-lg
        mb-10
      "
      >
        Upload MP3, WAV or WEBM audio files
        and generate instant AI-powered transcriptions securely.
      </p>

      {/* LOGGED IN */}

      <SignedIn>

        <div
          className="
          border-2 border-dashed
          border-green-500/20
          rounded-3xl
          p-10
          flex flex-col
          items-center
          justify-center
          gap-8
          bg-black/30
        "
        >

          <label
            className="
            cursor-pointer
            px-8 py-4
            rounded-2xl
            font-bold
            text-lg
            bg-gradient-to-r
            from-green-400
            to-green-500
            text-black
            shadow-[0_0_25px_rgba(34,197,94,0.4)]
            hover:scale-105
            hover:shadow-[0_0_40px_rgba(34,197,94,0.7)]
            transition-all duration-300
          "
          >

            📁 Choose Audio File

            <input
              type="file"
              accept="audio/*"
              className="hidden"
              onChange={handleFileChange}
            />

          </label>

          {selectedFile && (

            <div
              className="
              bg-[#10131c]
              border border-green-500/20
              rounded-2xl
              p-6
              w-full
              text-center
            "
            >

              <p className="text-green-400 font-bold mb-2">
                Selected File
              </p>

              <p className="text-gray-300">
                {selectedFile.name}
              </p>

            </div>

          )}

          <button
            onClick={handleUpload}
            className="
            px-10 py-4
            rounded-2xl
            font-bold
            text-lg
            bg-gradient-to-r
            from-green-400
            to-green-500
            text-black
            shadow-[0_0_25px_rgba(34,197,94,0.4)]
            hover:scale-105
            hover:shadow-[0_0_40px_rgba(34,197,94,0.7)]
            transition-all duration-300
          "
          >

            ⚡ Generate Transcript

          </button>

        </div>

      </SignedIn>

      {/* LOGGED OUT */}


      {/* TRANSCRIPTION */}

      <div
        className="
        mt-10
        bg-[#0a0a0a]
        border border-green-500/20
        rounded-3xl
        p-8
        shadow-[0_0_35px_rgba(34,197,94,0.12)]
      "
      >

        <h3 className="text-4xl font-extrabold text-white mb-4">
          AI Transcription
        </h3>

        <div
          className="
          bg-[#111111]
          border border-green-500/10
          rounded-2xl
          p-6
        "
        >

          <p
            className="
            text-gray-300
            text-lg
            leading-9
          "
          >
            {transcription ||
              "Your AI-generated transcription will appear here after upload..."}
          </p>

        </div>

      </div>

    </div>
  );
}

export default UploadSection;