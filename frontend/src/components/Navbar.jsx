import { Link } from "react-router-dom";

import {
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/clerk-react";

function Navbar() {

  return (

    <nav
      className="
      flex
      items-center
      justify-between
      px-8
      md:px-14
      py-6
      border-b
      border-gray-900
      bg-black
      text-white
    "
    >

      {/* LOGO */}
      <Link to="/">

        <h1
          className="
          text-4xl
          font-extrabold
          bg-gradient-to-r
          from-green-400
          to-blue-500
          bg-clip-text
          text-transparent
        "
        >

          TranscriptoAI

        </h1>

      </Link>

      {/* RIGHT SIDE */}
      <div className="flex items-center gap-8">

        {/* HOME */}
        <Link
          to="/"
          className="
          text-lg
          hover:text-green-400
          transition
        "
        >
          Home
        </Link>

        {/* HISTORY */}
        <Link
          to="/history"
          className="
          text-lg
          hover:text-green-400
          transition
        "
        >
          History
        </Link>

        {/* LOGGED OUT */}
        <SignedOut>

          <Link
            to="/sign-in"
            className="
            text-lg
            hover:text-green-400
          "
          >
            Login
          </Link>

          <Link to="/sign-up">

            <button
              className="
              bg-white
              text-black
              px-6
              py-3
              rounded-2xl
              font-semibold
              hover:bg-green-400
              transition
            "
            >

              Get Started

            </button>

          </Link>

        </SignedOut>

        {/* LOGGED IN */}
        <SignedIn>

          <UserButton />

        </SignedIn>

      </div>

    </nav>
  );
}

export default Navbar;