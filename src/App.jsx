import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Box } from "@radix-ui/themes";
import "./App.css";

import Navbar from "./components/Navbar.jsx";
import Meeting from "./pages/meeting.jsx";
import Interview from "./pages/interview.jsx";
import MeetingForm from "./components/MeetingForm.jsx";
import MeetingSummary from "./components/MeetingSummary.jsx";
import LoginPage from "./pages/LoginPage.jsx"; // 🆕 import LoginPage
import MeetingResponses from "./pages/MeetingResponses.jsx"

function App() {
  return (
      <Router>
          <Navbar /> {/* Navbar is always visible */}
          <Routes>
            <Route path="/meeting" element={<Meeting />} />
            <Route path="/interview" element={<Interview />} />
            <Route path="/meeting-form/:date" element={<MeetingForm />} />
            <Route path="/meeting-summary" element={<MeetingSummary />} />
            <Route path="/login" element={<LoginPage />} /> {/* 🆕 login route */}
            <Route path="/meeting-responses" element={<MeetingResponses/>}/>
          </Routes>
      </Router>
  );
};

export default App;