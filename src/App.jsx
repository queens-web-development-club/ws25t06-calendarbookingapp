import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Navbar from "./components/Navbar.jsx";
import Meeting from "./pages/meeting.jsx";
import Interview from "./pages/interview.jsx";
import MeetingForm from "./components/MeetingForm.jsx";

function App() {
  const [randomLink, setRandomLink] = useState("");

  // Function to generate a completely random link
  const generateRandomLink = () => {
    const randomString = Math.random().toString(36).substring(7);
    setRandomLink(`https://example.com/${randomString}`);
  };

  return (
    <div>
      <Router>
        <div className="min-height-screen bg-gray-100">
          <Navbar /> {/* Navbar is always visible */}
          <div className="w-full p-4">
            <Routes>
              <Route path="/meeting" element={<Meeting />} />
              <Route path="/interview" element={<Interview />} />
              <Route path="/meeting-form/:date" element={<MeetingForm/>} />
            </Routes>
          </div>
        </div>
      </Router>

      <h1 className="text-2xl font-bold text-center mt-6">Testing</h1>

      {/* Random Link Generator */}
      <div className="flex flex-col items-center mt-4">
        <button
          onClick={generateRandomLink}
          className="px-6 py-3 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-700 transition mb-4"
        >
          Generate Random Link
        </button>
        {randomLink && (
          <a
            href={randomLink}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline"
          >
            {randomLink}
          </a>
        )}
      </div>
    </div>
  );
}

export default App;
