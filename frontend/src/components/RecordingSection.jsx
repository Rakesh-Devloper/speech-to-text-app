import React, {
  useRef,
  useState,
} from "react";

import {
  SignedIn,
  SignedOut,
  useUser,
} from "@clerk/clerk-react";

function RecordingSection() {

  const { user } = useUser();

  const mediaRecorderRef = useRef(null);

  const audioChunksRef = useRef([]);

  const [transcription, setTranscription] =
    useState("");

  const [isRecording, setIsRecording] =
    useState(false);

  // START RECORDING

  const startRecording = async () => {

  // USER NOT LOGGED IN
  if (!user) {

    window.location.href = "/sign-up";

    return;
  }

  try {

    const stream =
      await navigator.mediaDevices.getUserMedia({
        audio: true,
      });

    const mediaRecorder =
      new MediaRecorder(stream);

    mediaRecorderRef.current =
      mediaRecorder;

    audioChunksRef.current = [];

    mediaRecorder.ondataavailable =
      (event) => {

        if (event.data.size > 0) {

          audioChunksRef.current.push(
            event.data
          );
        }
      };

    mediaRecorder.start();

    setIsRecording(true);

  } catch (error) {

    console.log(error);

    alert(
      "Microphone access denied"
    );
  }
};
  // STOP RECORDING

  const stopRecording = async () => {

    const mediaRecorder =
      mediaRecorderRef.current;

    if (!mediaRecorder) return;

    mediaRecorder.stop();

    mediaRecorder.onstop =
      async () => {

        try {

          const audioBlob =
            new Blob(
              audioChunksRef.current,
              {
                type:
                  "audio/webm",
              }
            );

          const formData =
            new FormData();

          formData.append(
            "audio",
            audioBlob,
            "recording.webm"
          );

          formData.append(
            "type",
            "recording"
          );

          formData.append(
            "userEmail",
            user
              ?.primaryEmailAddress
              ?.emailAddress
          );

          const response =
            await fetch(
              "https://speech-to-text-app-1-srz0.onrender.com/upload",
              {
                method:
                  "POST",
                body:
                  formData,
              }
            );

          const data =
            await response.json();

          if (response.ok) {

            setTranscription(
              data.transcription
            );
          }

          setIsRecording(false);

        } catch (error) {

          console.log(error);
        }
      };
  };

  return (

    <div
      className="
      bg-[#07140d]
      border border-green-500/20
      shadow-[0_0_30px_rgba(34,197,94,0.12)]
      rounded-[40px]
      p-10
    "
    >

      <div className="text-center mb-12">

        <h2 className="text-6xl font-extrabold text-white">

          Live AI{" "}

          <span
            className="
            bg-gradient-to-r
            from-green-400
            to-emerald-400
            bg-clip-text
            text-transparent
          "
          >
            Voice Recording
          </span>

        </h2>

        <p className="text-gray-400 text-xl mt-6">

          Record voice and instantly generate AI transcriptions.

        </p>

      </div>

      {/* RECORD BOX */}

      <div
        className="
        bg-black/40
        border border-green-500/10
        rounded-[35px]
        p-12
        flex
        flex-col
        items-center
      "
      >

        <div
          className={`
          w-40
          h-40
          rounded-full
          flex
          items-center
          justify-center
          text-6xl
          mb-10
          transition-all
          duration-500
          ${
            isRecording
              ? "bg-red-500/20 animate-pulse"
              : "bg-green-500/10"
          }
        `}
        >
          🎤
        </div>

        <h3
          className={`
          text-4xl
          font-bold
          mb-4
          ${
            isRecording
              ? "text-red-400"
              : "text-green-400"
          }
        `}
        >

          {isRecording
            ? "Recording..."
            : "Ready To Record"}

        </h3>

        {!isRecording ? (

          <button
            onClick={startRecording}
            className="
            px-10 py-5
            rounded-2xl
            font-bold
            text-xl
            bg-gradient-to-r
            from-green-400
            to-green-500
            text-black
          "
          >
            🎙 Start Recording
          </button>

        ) : (

          <button
            onClick={stopRecording}
            className="
            px-10 py-5
            rounded-2xl
            font-bold
            text-xl
            bg-red-500
            text-white
          "
          >
            ⏹ Stop Recording
          </button>

        )}

      </div>

      {/* TRANSCRIPTION */}

      <div
        className="
        mt-10
        bg-[#0a0a0a]
        border border-green-500/20
        rounded-3xl
        p-8
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
              "Your AI-generated transcription will appear here after recording..."}
          </p>

        </div>

      </div>

    </div>
  );
}
export default RecordingSection;