import { Link } from "react-router-dom";
import { Button, Flex, Box } from "@radix-ui/themes";
import logo from "../assets/qweb-text-white.png"


export default function Navbar() {
  return (
    <nav className="bg-sky-800 h-24 shadow-lg p-12">
      <Flex align="center" justify="between" className="flex items-center h-full">
        <Box className="flex items-center">
        <img src={logo} alt="QWeb Booking Logo" className="h-full w-full" />
        </Box>
        <Flex gap="9" align="center" className="flex items-center h-full">
          <Link to="/" className="text-base sm:text-xl md:text-2xl lg:text-3xl text-white hover:underline">home</Link>
          <Link to="/meeting" className="text-base sm:text-xl md:text-2xl lg:text-3xl text-white hover:underline">team booking</Link>
          <Link to="/interview" className="text-base sm:text-xl md:text-2xl lg:text-3xl text-white hover:underline">interview booking</Link>
          <Link to="/login" className="bg-white text-base sm:text-xl md:text-2xl lg:text-3xl text-sky-800 px-4 py-1 rounded hover:bg-gray-100 text-blue-600 transition">
            sign in
          </Link>
        </Flex>
      </Flex>
    </nav>
  );
}