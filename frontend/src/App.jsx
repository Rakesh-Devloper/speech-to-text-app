import {
  Routes,
  Route,
} from "react-router-dom";

import {
  SignIn,
  SignUp,
} from "@clerk/clerk-react";

import Home from "./pages/Home";

import Navbar from "./components/Navbar";

function AuthLayout({ children }) {

  return (

    <div className="min-h-screen bg-black text-white">

      {/* NAVBAR */}
      <Navbar />

      {/* BACKGROUND */}
      <div
        className="
        min-h-[90vh]
        flex
        items-center
        justify-center
        px-6
        relative
        overflow-hidden
      "
      >

        {/* GLOW */}
        <div
          className="
          absolute
          w-[500px]
          h-[500px]
          bg-green-500/10
          blur-[120px]
          rounded-full
        "
        />

        {/* CARD */}
        <div className="relative z-10">

          {children}

        </div>

      </div>

    </div>
  );
}

function App() {

  return (

    <Routes>

      {/* HOME */}
      <Route
        path="/"
        element={<Home />}
      />

      {/* SIGN IN */}
      <Route
        path="/sign-in/*"
        element={
          <AuthLayout>

            <SignIn />

          </AuthLayout>
        }
      />

      {/* SIGN UP */}
      <Route
        path="/sign-up/*"
        element={
          <AuthLayout>

            <SignUp />

          </AuthLayout>
        }
      />

    </Routes>
  );
}

export default App;