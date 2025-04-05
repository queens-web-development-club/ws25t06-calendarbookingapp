import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="bg-gradient-to-br from-blue-900 to-blue-700 text-white font-sans shadow-lg">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold tracking-wide hover:opacity-90 transition">
          <span className="text-green-400">Q</span>
          <span className="text-white">&lt;web&gt;</span>
        </Link>

        {/* Nav links */}
        <div className="hidden md:flex items-center space-x-8 text-lg font-medium">
          <Link to="/" className="hover:text-blue-300 transition">home</Link>
          <Link to="/meeting" className="hover:text-blue-300 transition">team booking</Link>
          <Link to="/interview" className="hover:text-blue-300 transition">interview booking</Link>
        </div>

        {/* Sign-in button */}
        <Link
          to="/login"
          className="bg-white text-blue-900 font-semibold px-4 py-1.5 rounded-md shadow hover:bg-blue-100 transition"
        >
          sign in
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;
