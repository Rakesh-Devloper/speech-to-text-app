import React from "react";


function Features() {

  return (

    <div className="grid md:grid-cols-3 gap-8 px-12 pb-24">

      <div className="bg-[#0d0d0d] border border-gray-800 rounded-3xl p-10 hover:border-green-500 transition">

        <div className="text-5xl mb-6">
          🎵
        </div>

        <h2 className="text-3xl font-bold mb-5 text-white">

          Audio Upload

        </h2>

        <p className="text-gray-400 text-lg leading-9">

          Upload MP3, WAV or WEBM files
          and generate AI transcriptions instantly.

        </p>

      </div>

      <div className="bg-[#0d0d0d] border border-gray-800 rounded-3xl p-10 hover:border-green-500 transition">

        <div className="text-5xl mb-6">
          🎙️
        </div>

        <h2 className="text-3xl font-bold mb-5 text-white">

          Live Recording

        </h2>

        <p className="text-gray-400 text-lg leading-9">

          Record your voice directly from browser
          using MediaRecorder API.

        </p>

      </div>

      <div className="bg-[#0d0d0d] border border-gray-800 rounded-3xl p-10 hover:border-green-500 transition">

        <div className="text-5xl mb-6">
          🤖
        </div>

        <h2 className="text-3xl font-bold mb-5 text-white">

          AI Transcription

        </h2>

        <p className="text-gray-400 text-lg leading-9">

          AI-powered voice-to-text conversion
          with high accuracy.

        </p>

      </div>

    </div>
  );
}

export default Features;