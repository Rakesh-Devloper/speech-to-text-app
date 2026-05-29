import { useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-react";

import Navbar from "../components/Navbar";
import HistorySection from "../components/HistorySection";

function History() {
  const { user, isLoaded } = useUser();

  const [transcriptions, setTranscriptions] =
    useState([]);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const email =
          user?.primaryEmailAddress?.emailAddress;

        if (!email) return;

        const response = await fetch(
          `https://speech-to-text-app-1-srz0.onrender.com/transcriptions/${email}`
        );

        const data = await response.json();

        setTranscriptions(data);
      } catch (error) {
        console.log(error);
      }
    };

    if (isLoaded && user) {
      fetchHistory();
    }
  }, [user, isLoaded]);

  return (
    <div className="bg-black min-h-screen text-white">
      <Navbar />

      <div className="p-10">
        <HistorySection
          transcriptions={transcriptions}
        />
      </div>
    </div>
  );
}

export default History;