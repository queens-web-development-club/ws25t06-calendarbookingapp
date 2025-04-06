import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button, Flex, Box } from "@radix-ui/themes";
import { auth } from "../firebase"; // Import Firebase auth
import { signOut } from "firebase/auth"; // Import signOut method

function Navbar() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate(); // To navigate after logout

  // Listen to auth state changes
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser); // Set user data if logged in
    });

    return () => unsubscribe(); // Clean up listener on unmount
  }, []);

  // Handle logout
  const handleLogout = async () => {
    try {
      await signOut(auth); // Firebase sign out
      setUser(null); // Clear the user state
      navigate("/login"); // Redirect to login page after logging out
    } catch (error) {
      console.error("Error signing out: ", error.message);
    }
  };

  return (
    <nav className="bg-gradient-to-br h-24 px-12 from-blue-900 to-blue-700 text-white font-sans shadow-lg">
      <Flex align="center" justify="between" className="flex items-center h-full">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold tracking-wide hover:opacity-90 transition">
          <span className="text-green-400 text-base sm:text-lg md:text-xl lg:text-2xl">Q</span>
          <span className="text-white text-base sm:text-lg md:text-xl lg:text-2xl">&lt;web&gt;</span>
        </Link>

        {/* Nav links */}
        <Flex gapX="7" className="hidden md:flex items-center space-x-8 text-lg font-medium">
          <Link to="/" className="text-base sm:text-xs md:text-base lg:text-2xl text-white hover:underline
          hover:text-blue-300 transition">home</Link>
          <Link to="/meeting" className="text-base sm:text-xs md:text-base lg:text-2xl text-white hover:underline
          hover:text-blue-300 transition">team booking</Link>
          <Link to="/interview" className="text-base sm:text-xs md:text-base lg:text-2xl text-white hover:underline
          hover:text-blue-300 transition">interview booking</Link>
        </Flex>

        {/* Conditional Sign-In / User Name and Logout Button */}
        {user ? (
          <Box className="flex items-center space-x-6">
            {/* Display user name instead of link to profile */}
            <span className="text-white font-medium 
            sm:text-xs md:text-base lg:text-2xl">{user.displayName}</span>  {/* Static name */}

            {/* Logout button */}
            <button
              onClick={handleLogout}
              className="sm:text-xs md:text-base lg:text-2xl
              bg-red-600 text-white font-semibold px-4 py-1.5 rounded-md shadow hover:bg-red-700 transition"
            >
              <span className="text-white font-medium sm:text-xs md:text-base lg:text-2xl">
                log out
              </span>
              
            </button>
          </Box>
        ) : (
          <Link
            to="/login"
            className="sm:text-xs md:text-base lg:text-3xl
            bg-white text-blue-900 font-semibold px-4 py-1.5 rounded-md shadow hover:bg-blue-100 transition"
          >
            sign in
          </Link>
        )}
      </Flex>
    </nav>
  );
}

export default Navbar;
