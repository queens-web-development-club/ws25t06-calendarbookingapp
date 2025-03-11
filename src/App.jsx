import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css'
import Navbar from "./components/Navbar.jsx";
import Meeting from "./pages/meeting.jsx";
import Interview from "./pages/interview.jsx";

function App() {

  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Navbar />  {/* Navbar is always visible */}
        <div className="container mx-auto p-4">
          <Routes>
            <Route path="/meeting" element={<Meeting />} />
            <Route path="/interview" element={<Interview />} />
          </Routes>
        </div>
      </div>
    </Router>

  )
}

export default App
