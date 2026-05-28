import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import UploadSection from "../components/UploadSection";
import RecordingSection from "../components/RecordingSection";
import Features from "../components/Features";

function Home() {

  return (

    <div className="bg-black text-white min-h-screen">

      {/* Navbar */}
      <Navbar />

      {/* Hero */}
      <Hero />

      {/* Main Sections */}
      <div className="px-6 md:px-12 py-14 space-y-14">

        {/* Upload */}
        <UploadSection />

        {/* Recording */}
        <RecordingSection />

        {/* Features */}
        <Features />

      </div>

    </div>
  );
}

export default Home;