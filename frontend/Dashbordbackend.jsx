import React, {
  useState,
  useRef,
  useEffect,
} from "react";

import axios from "axios";

import {
  UserButton,
  useUser,
} from "@clerk/clerk-react";

function Dashboard() {

  const { user } = useUser();

  const [selectedFile, setSelectedFile] =
    useState(null);

  const [recording, setRecording] =
    useState(false);

  const [transcriptions, setTranscriptions] =
    useState([]);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const mediaRecorderRef = useRef(null);

  const audioChunksRef = useRef([]);

  useEffect(() => {

    fetchHistory();

  }, []);

  const fetchHistory = async () => {

    try {

      const response =
        await axios.get(
          "http://localhost:5000/transcriptions"
        );

      setTranscriptions(response.data);

    } catch (error) {

      console.log(error);
    }
  };

  const handleFileUpload = (e) => {

    const file = e.target.files[0];

    if (!file) return;

    setSelectedFile(file);
  };

  const uploadAudio = async () => {

    if (!selectedFile) return;

    try {

      setLoading(true);

      const formData =
        new FormData();

      formData.append(
        "audio",
        selectedFile
      );

      formData.append(
        "userEmail",
        user?.primaryEmailAddress?.emailAddress
      );

      await axios.post(
        "http://localhost:5000/upload",
        formData
      );

      fetchHistory();

      setLoading(false);

      alert("Upload Success");

    } catch (error) {

      console.log(error);

      setLoading(false);
    }
  };

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

    setRecording(true);

    mediaRecorder.ondataavailable =
      (event) => {

        audioChunksRef.current.push(
          event.data
        );
      };

    mediaRecorder.onstop = async () => {

      const audioBlob =
        new Blob(
          audioChunksRef.current,
          {
            type: "audio/wav",
          }
        );

      const audioFile =
        new File(
          [audioBlob],
          "recording.wav",
          {
            type: "audio/wav",
          }
        );

      const formData =
        new FormData();

      formData.append(
        "audio",
        audioFile
      );

      formData.append(
        "userEmail",
        user?.primaryEmailAddress?.emailAddress
      );

      await axios.post(
        "http://localhost:5000/upload",
        formData
      );

      fetchHistory();

      setRecording(false);
    };

    mediaRecorder.start();
  };

  const stopRecording = () => {

    mediaRecorderRef.current.stop();

    setRecording(false);
  };

  return (

    <div className="min-h-screen bg-black text-white p-10">

      <div className="flex justify-between items-center mb-10">

        <h1 className="text-4xl font-bold">
          Dashboard
        </h1>

        <UserButton />

      </div>

      <div className="bg-gray-900 p-8 rounded-2xl mb-10">

        <input
          type="file"
          accept="audio/*"
          onChange={handleFileUpload}
          className="mb-5"
        />

        <button
          onClick={uploadAudio}
          className="bg-green-500 text-black px-6 py-3 rounded-xl mr-5"
        >
          Upload Audio
        </button>

        {!recording ? (

          <button
            onClick={startRecording}
            className="bg-blue-500 px-6 py-3 rounded-xl"
          >
            Start Recording
          </button>

        ) : (

          <button
            onClick={stopRecording}
            className="bg-red-500 px-6 py-3 rounded-xl"
          >
            Stop Recording
          </button>

        )}

      </div>

      <div>

        <h2 className="text-3xl font-bold mb-6">
          Transcription History
        </h2>

        <div className="space-y-5">

          {transcriptions.map((item) => (

            <div
              key={item._id}
              className="bg-gray-900 p-5 rounded-xl"
            >

              <p className="text-green-400 mb-2">
                {item.userEmail}
              </p>

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

export default Dashboard;