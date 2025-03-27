import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="bg-blue-600 p-3 h-20 flex items-center shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-white text-xl font-bold">QWeb Booking</h1>
        <div className="flex items-center space-x-6">
          <Link to="/" className="text-white hover:underline">Home</Link>
          <Link to="/meeting" className="text-white hover:underline">Team Booking</Link>
          <Link to="/interview" className="text-white hover:underline">Interview Booking</Link>
          <Link to="/login" className="bg-white text-blue-600 px-4 py-1 rounded hover:bg-gray-100 transition">
            Sign In
          </Link>
        </div>
      </div>
    </nav>
  );
}