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
