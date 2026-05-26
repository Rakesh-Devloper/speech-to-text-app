import React, {
  useRef,
  useState,
  useEffect,
} from "react";

import axios from "axios";

import { supabase } from "./supabase";

function App() {

  // Auth States
  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [user, setUser] =
    useState(null);

  // App States
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

  // Check Session
  useEffect(() => {

    supabase.auth.getSession()
      .then(({ data }) => {

        setUser(data.session?.user || null);
      });

  }, []);

  // Fetch History
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

  // Signup
  const signUp = async () => {

    const { data, error } =
      await supabase.auth.signUp({
        email,
        password,
      });

    if (error) {

      setError(error.message);

    } else {

      alert("Signup successful");

      setUser(data.user);
    }
  };

  // Login
  const login = async () => {

    const { data, error } =
      await supabase.auth.signInWithPassword({
        email,
        password,
      });

    if (error) {

      setError(error.message);

    } else {

      alert("Login successful");

      setUser(data.user);
    }
  };

  // Logout
  const logout = async () => {

    await supabase.auth.signOut();

    setUser(null);
  };

  // Handle Upload
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

      const formData = new FormData();

      formData.append(
        "audio",
        selectedFile
      );

      formData.append(
        "userEmail",
        user?.email || "guest"
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
        "Upload failed"
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

        formData.append(
          "userEmail",
          user?.email || "guest"
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
          "Recording upload failed"
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

        {/* Auth */}
        {!user ? (

          <div className="mb-6 space-y-4">

            <input
              type="email"
              placeholder="Enter Email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              className="border p-3 w-full rounded-lg"
            />

            <input
              type="password"
              placeholder="Enter Password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              className="border p-3 w-full rounded-lg"
            />

            <div className="flex gap-4">

              <button
                onClick={signUp}
                className="bg-green-500 text-white px-5 py-2 rounded-lg"
              >
                Sign Up
              </button>

              <button
                onClick={login}
                className="bg-blue-500 text-white px-5 py-2 rounded-lg"
              >
                Login
              </button>

            </div>

          </div>

        ) : (

          <div className="flex justify-between items-center mb-6">

            <p>
              Logged in as:
              <strong>
                {" "}
                {user.email}
              </strong>
            </p>

            <button
              onClick={logout}
              className="bg-red-500 text-white px-4 py-2 rounded-lg"
            >
              Logout
            </button>

          </div>
        )}

        {/* Error */}
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

        {/* History */}
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