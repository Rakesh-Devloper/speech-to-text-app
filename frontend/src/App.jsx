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

  const [error, setError] =
    useState("");

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

    if (!file) return;

    if (!file.type.startsWith("audio/")) {

      setError(
        "Please upload a valid audio file"
      );

      return;
    }

    setError("");

    setSelectedFile(file);
  };

  // Upload Audio
  const uploadAudio = async () => {

    if (!selectedFile) {

      setError(
        "Please select an audio file"
      );

      return;
    }

    try {

      setLoading(true);

      setError("");

      const formData = new FormData();

      formData.append(
        "audio",
        selectedFile
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

      setError(
        error.response?.data?.error ||
        "Transcription failed"
      );
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

    mediaRecorder.ondataavailable = (
      event
    ) => {

      audioChunksRef.current.push(
        event.data
      );
    };

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

        setError(
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

    <div className="min-h-screen bg-gray-100 p-8">

      <div className="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow-lg">

        <h1 className="text-4xl font-bold text-center mb-8">

          Speech To Text App

        </h1>

        {/* Error Message */}
        {error && (

          <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-5">

            {error}

          </div>
        )}

        {/* Upload */}
        <div className="mb-8">

          <input
            type="file"
            accept="audio/*"
            onChange={handleFileUpload}
          />

          <button
            onClick={uploadAudio}
            className="bg-blue-500 text-white px-5 py-2 rounded-lg ml-3"
          >

            Upload & Transcribe

          </button>

        </div>

        {/* Recording */}
        <div className="mb-8">

          {!recording ? (

            <button
              onClick={startRecording}
              className="bg-red-500 text-white px-5 py-2 rounded-lg"
            >

              Start Recording

            </button>

          ) : (

            <button
              onClick={stopRecording}
              className="bg-black text-white px-5 py-2 rounded-lg"
            >

              Stop Recording

            </button>
          )}

          {audioURL && (

            <audio
              controls
              src={audioURL}
              className="mt-5"
            />
          )}

        </div>

        {/* Loading */}
        {loading && (
          <p className="text-blue-500 mb-5">
            Generating transcription...
          </p>
        )}

        {/* Transcriptions */}
        <div>

          <h2 className="text-2xl font-bold mb-5">

            Previous Transcriptions

          </h2>

          {transcriptions.map((item) => (

            <div
              key={item._id}
              className="border p-4 rounded-lg mb-4"
            >

              <h3 className="font-bold">

                {item.fileName}

              </h3>

              <p>
                {item.transcription}
              </p>

            </div>
          ))}
        </div>

      </div>

    </div>
  );
}

export default App;