import { useUser } from "@clerk/clerk-react";
import { Link } from "react-router-dom";

function Hero({ scrollToUpload }) {
  const { isSignedIn } = useUser();

  return (
    <section
      className="
      min-h-[80vh]
      flex
      flex-col
      items-center
      justify-center
      text-center
      px-6
      bg-black
      text-white
    "
    >
      <p className="text-green-400 text-2xl mb-6">
        AI Powered Speech-To-Text Platform
      </p>

      <h1
        className="
        text-6xl
        md:text-8xl
        font-extrabold
        leading-tight
      "
      >
        Convert Voice Into
        <br />
        <span className="text-green-400">
          Smart Text
        </span>
      </h1>

      <p
        className="
        text-gray-400
        text-xl
        mt-10
        max-w-4xl
        leading-relaxed
      "
      >
        Upload audio files or record your voice live and
        generate accurate AI-powered transcriptions instantly.
      </p>

      <div className="mt-14">
        {isSignedIn ? (
          <button
            onClick={scrollToUpload}
            className="
            bg-green-500
            hover:bg-green-400
            text-black
            font-bold
            text-2xl
            px-14
            py-5
            rounded-2xl
            shadow-[0_0_40px_rgba(34,197,94,0.5)]
            transition-all
          "
          >
            Get Started
          </button>
        ) : (
          <Link to="/sign-up">
            <button
              className="
              bg-green-500
              hover:bg-green-400
              text-black
              font-bold
              text-2xl
              px-14
              py-5
              rounded-2xl
              shadow-[0_0_40px_rgba(34,197,94,0.5)]
              transition-all
            "
            >
              Get Started
            </button>
          </Link>
        )}
      </div>
    </section>
  );
}

export default Hero;