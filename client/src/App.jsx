import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./features/auth/AuthContext";
import "./App.css";

// Layout Components
import Navbar from "./components/layout/Navbar";

// Pages
import Home from "./pages/Home";
import MeetingsPage from "./pages/MeetingsPage";
import InterviewsPage from "./pages/InterviewsPage";
import BookingsPage from "./pages/BookingsPage";
import InterviewBookingPage from "./pages/InterviewBookingPage";
import BookingVerificationPage from "./pages/BookingVerificationPage";
import MeetingCreationPage from "./pages/MeetingCreationPage";
import MeetingBookingPage from "./pages/MeetingBookingPage";
import MeetingVerificationPage from "./pages/MeetingVerificationPage";

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen w-full bg-gray-50">
          <Navbar />
          <main className="w-full">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/meetings" element={<MeetingsPage />} />
              <Route path="/interviews" element={<InterviewsPage />} />
              <Route path="/bookings" element={<BookingsPage />} />

              <Route path="/create-meeting" element={<MeetingCreationPage />} />
              <Route path="/book-meeting/:meetingId" element={<MeetingBookingPage />} />
              <Route path="/meeting-verification" element={<MeetingVerificationPage />} />
 
              <Route path="/book-interview/:token" element={<InterviewBookingPage />} />
              <Route path="/booking/:token" element={<InterviewBookingPage />} />
              <Route path="/booking-verification" element={<BookingVerificationPage />} />


              {/* Legacy routes for backward compatibility */}
              <Route path="/meeting" element={<MeetingsPage />} />
              <Route path="/interview" element={<InterviewsPage />} />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;



