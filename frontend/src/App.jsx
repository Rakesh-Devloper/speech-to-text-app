import React, {
  useRef,
  useState,
  useEffect,
} from "react";

import axios from "axios";

function App() {

  // States
  const [selectedFile, setSelectedFile] =
    useState(null);

  const [recording, setRecording] =
    useState(false);

  const [audioURL, setAudioURL] =
    useState("");

  const [transcriptions, setTranscriptions] =
    useState([]);

  const [loading, setLoading] =
    useState(false);


  // Refs
  const mediaRecorderRef = useRef(null);

  const audioChunksRef = useRef([]);


  // Fetch Previous Transcriptions
  useEffect(() => {

    fetchHistory();

  }, []);


  const fetchHistory = async () => {

    try {

      const response = await axios.get(
        "http://localhost:5000/transcriptions"
      );

      setTranscriptions(response.data);

    } catch (error) {

      console.log(error);
    }
  };


  // Handle File Upload
  const handleFileUpload = (e) => {

    const file = e.target.files[0];

    setSelectedFile(file);
  };


  // Upload Audio to Backend
  const uploadAudio = async () => {

    if (!selectedFile) {

      alert("Please select an audio file");

      return;
    }

    try {

      setLoading(true);

      const formData = new FormData();

      formData.append("audio", selectedFile);

      await axios.post(
        "http://localhost:5000/upload",
        formData
      );

      fetchHistory();

      setLoading(false);

    } catch (error) {

      console.log(error);

      setLoading(false);

      alert("Transcription failed");
    }
  };


  // Start Recording
  const startRecording = async () => {

    const stream =
      await navigator.mediaDevices.getUserMedia({
        audio: true,
      });

    const mediaRecorder =
      new MediaRecorder(stream);

    mediaRecorderRef.current =
      mediaRecorder;

    audioChunksRef.current = [];


    // Store Audio Chunks
    mediaRecorder.ondataavailable = (
      event
    ) => {

      audioChunksRef.current.push(
        event.data
      );
    };


    // When Recording Stops
    mediaRecorder.onstop = async () => {

      const audioBlob = new Blob(
        audioChunksRef.current,
        {
          type: "audio/webm",
        }
      );

      const url =
        URL.createObjectURL(audioBlob);

      setAudioURL(url);

      try {

        setLoading(true);

        const formData = new FormData();

        formData.append(
          "audio",
          audioBlob,
          "recording.webm"
        );

        await axios.post(
          "http://localhost:5000/upload",
          formData
        );

        fetchHistory();

        setLoading(false);

      } catch (error) {

        console.log(error);

        setLoading(false);

        alert(
          "Recording transcription failed"
        );
      }
    };


    mediaRecorder.start();

    setRecording(true);
  };


  // Stop Recording
  const stopRecording = () => {

    mediaRecorderRef.current.stop();

    setRecording(false);
  };


  return (

    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-purple-100 flex justify-center items-center p-6">

      <div className="bg-white/80 backdrop-blur-md shadow-2xl rounded-3xl p-8 w-full max-w-3xl border border-white/30 transition-all duration-300">

        <h1 className="text-5xl font-extrabold text-center mb-8 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent tracking-tight">

          🎤 Speech To Text App

        </h1>


        {/* File Upload */}
        <div className="mb-8">

          <label className="block font-semibold mb-3 text-lg text-gray-700">

            Upload Audio File

          </label>

          <input
            type="file"
            accept="audio/*"
            onChange={handleFileUpload}
            className="w-full border border-gray-300 p-3 rounded-xl bg-white shadow-sm"
          />


          {selectedFile && (

            <p className="mt-3 text-green-600 font-medium">

              Selected: {selectedFile.name}

            </p>
          )}


          {/* Upload Button */}
          <button
            onClick={uploadAudio}
            className="mt-5 bg-gradient-to-r from-blue-500 to-indigo-600 hover:scale-105 hover:shadow-xl transition-all duration-300 text-white px-6 py-3 rounded-xl font-semibold"
          >

            Upload & Transcribe

          </button>

        </div>


        {/* Recording Section */}
        <div className="mb-8">

          <label className="block font-semibold mb-3 text-lg text-gray-700">

            Record Audio

          </label>


          {!recording ? (

            <button
              onClick={startRecording}
              className="bg-gradient-to-r from-red-500 to-pink-600 hover:scale-105 hover:shadow-xl transition-all duration-300 text-white px-6 py-3 rounded-xl font-semibold"
            >

              🎙 Start Recording

            </button>

          ) : (

            <button
              onClick={stopRecording}
              className="bg-gradient-to-r from-gray-700 to-black hover:scale-105 hover:shadow-xl transition-all duration-300 text-white px-6 py-3 rounded-xl font-semibold"
            >

              ⏹ Stop Recording

            </button>
          )}


          {audioURL && (

            <audio
              controls
              src={audioURL}
              className="mt-5 w-full rounded-xl"
            />
          )}

        </div>


        {/* Loading */}
        {loading && (

          <div className="mb-6 flex items-center gap-3">

            <div className="w-4 h-4 rounded-full bg-blue-500 animate-bounce"></div>

            <p className="text-blue-600 font-semibold text-lg">

              Generating transcription...

            </p>

          </div>
        )}


        {/* Transcriptions */}
        <div>

          <h2 className="text-3xl font-bold mb-5 text-gray-800">

            Previous Transcriptions

          </h2>


          <div className="bg-gray-50 border border-gray-200 rounded-2xl p-5 space-y-4">

            {transcriptions.length > 0 ? (

              transcriptions.map((item) => (

                <div
                  key={item._id}
                  className="bg-white/90 border border-gray-200 p-5 rounded-2xl shadow-md hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
                >

                  <h3 className="font-bold text-xl text-blue-700 mb-2">

                    {item.fileName}

                  </h3>

                  <p className="mt-2 text-gray-700 leading-relaxed">

                    {item.transcription}

                  </p>

                  <small className="text-gray-400 italic block mt-3">

                    {new Date(
                      item.createdAt
                    ).toLocaleString()}

                  </small>

                </div>
              ))

            ) : (

              <div className="text-center py-10">

                <p className="text-4xl">
                  🎤
                </p>

                <p className="text-gray-500 mt-3 text-lg">

                  No transcriptions yet.

                </p>

              </div>
            )}

          </div>

        </div>

      </div>

    </div>
  );
}

export default App;