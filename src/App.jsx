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
import LoginPage from "./pages/LoginPage.jsx"; // 🆕 Login Page
import MeetingAvailability from './pages/meeting-availability.jsx';
import MeetingResponses from "./pages/MeetingResponses.jsx";
import SignupPage from "./pages/SignupPage.jsx"; // 🆕 Signup Page
import InterviewForm from "./components/InterviewForm";
import InterviewSummary from "./components/InterviewSummary.jsx";
import InterviewAvailability from "./components/InterviewAvailability.jsx"

function App() {
  return (
      <Router>
          <Navbar /> {/* Navbar is always visible */}

          <Routes>
            <Route path="/meeting" element={<Meeting />} />
            <Route path="/interview" element={<Interview />} />
            <Route path="/meeting-form/:date" element={<MeetingForm />} />
            <Route path="/meeting-summary" element={<MeetingSummary />} />
            <Route path="/test" element={<MeetingAvailability />}/>
            <Route path="/login" element={<LoginPage />} /> {/* 🆕 Login Route */}
            <Route path="/signup" element={<SignupPage />} /> {/* 🆕 Signup Route */}
            <Route path="/meeting-responses" element={<MeetingResponses/>}/>
            <Route path="/interview-form" element={<InterviewForm/>}/>
            <Route path="/interview-summary" element={<InterviewSummary/>}/>
            <Route path="/interview-availability" element={<InterviewAvailability/>}/>
          </Routes>
      </Router>
  );
};

export default App;
