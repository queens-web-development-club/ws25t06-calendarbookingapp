import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Box } from "@radix-ui/themes";
import "./App.css";

// Global Components
import Navbar from "./components/Navbar.jsx";

// Pages & Components
import Home from "./pages/Home.jsx";
import Meeting from "./pages/meeting.jsx";
import Interview from "./pages/interview.jsx";
import MeetingForm from "./components/MeetingForm.jsx";
import MeetingSummary from "./components/MeetingSummary.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import SignupPage from "./pages/SignupPage.jsx";
import MeetingAvailability from "./pages/meeting-availability.jsx";
import MeetingResponses from "./pages/MeetingResponses.jsx";
import InterviewForm from "./components/InterviewForm.jsx";
import InterviewSummary from "./components/InterviewSummary.jsx";
import InterviewAvailability from "./components/InterviewAvailability.jsx";
import WelcomePage from "./pages/WelcomePage.jsx"; // ✅ NEW

function App() {
  return (
    <Router>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/meeting" element={<Meeting />} />
        <Route path="/interview" element={<Interview />} />
        <Route path="/meeting-form/:date" element={<MeetingForm />} />
        <Route path="/meeting-summary" element={<MeetingSummary />} />
        <Route path="/test" element={<MeetingAvailability />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/welcome" element={<WelcomePage />} /> {/* ✅ NEW ROUTE */}
        <Route path="/meeting/:id" element={<MeetingAvailability />} />
        <Route path="/interview-form" element={<InterviewForm />} />
        <Route path="/interview-summary" element={<InterviewSummary />} />
        <Route path="/interview/:id" element={<InterviewAvailability />} />
      </Routes>
    </Router>
  );
}

export default App;
