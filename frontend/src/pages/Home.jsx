import { useRef } from "react";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import UploadSection from "../components/UploadSection";
import RecordingSection from "../components/RecordingSection";
import Features from "../components/Features";

function Home() {
  const uploadRef = useRef(null);

  const scrollToUpload = () => {
    uploadRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <div className="bg-black text-white min-h-screen">
      {/* Navbar */}
      <Navbar />

      {/* Hero */}
      <Hero scrollToUpload={scrollToUpload} />

      {/* Main Sections */}
      <div className="px-6 md:px-12 py-14 space-y-14">
        {/* Upload */}
        <div ref={uploadRef}>
          <UploadSection />
        </div>

        {/* Recording */}
        <RecordingSection />

        {/* Features */}
        <Features />
      </div>
    </div>
  );
}

export default Home;