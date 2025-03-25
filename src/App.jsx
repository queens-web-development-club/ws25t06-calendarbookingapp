import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Box} from "@radix-ui/themes";
import "./App.css";
import Navbar from "./components/Navbar.jsx";
import Meeting from "./pages/meeting.jsx";
import Interview from "./pages/interview.jsx";
import MeetingForm from "./components/MeetingForm.jsx";
import MeetingSummary from "./components/MeetingSummary.jsx";

function App() {
  return (
    <Box height="85vh">
      <Router>
        <div className="bg-gray-100 h-full">
          <Navbar /> {/* Navbar is always visible */}
            <Routes>
              <Route path="/meeting" element={<Meeting />} />
              <Route path="/interview" element={<Interview />} />
              <Route path="/meeting-form/:date" element={<MeetingForm/>} />
              <Route path="/meeting-summary" element={<MeetingSummary/>} />
            </Routes>
        </div>
      </Router>
    </Box>
  );
}

export default App;