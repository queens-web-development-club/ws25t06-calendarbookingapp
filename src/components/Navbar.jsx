import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="bg-blue-600 p-4 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-white text-xl font-bold">QWeb Booking</h1>
        <div className="space-x-6">
          <Link to="/" className="text-white hover:underline">Home</Link>
          <Link to="/meeting" className="text-white hover:underline">Team Booking</Link>
          <Link to="/interview" className="text-white hover:underline">Interview Booking</Link>
        </div>
      </div>
    </nav>
  );
}