import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="bg-gray-900 text-white min-h-screen font-sans">
      {/* Hero Section */}
      <section className="text-center py-20 px-6 bg-gradient-to-br from-blue-500 to-green-400">
        <h1 className="text-4xl md:text-6xl font-extrabold text-black">
          Book Smarter with QWeb
        </h1>
        <p className="mt-4 text-lg md:text-xl text-black">
          Schedule interviews and meetings with ease, all in one place.
        </p>
        <div className="mt-8 space-x-4">
          <Link
            to="/meeting"
            className="bg-black text-white px-6 py-3 rounded-xl hover:bg-gray-800 transition"
          >
            Team Booking
          </Link>
          <Link
            to="/interview"
            className="bg-black text-white px-6 py-3 rounded-xl hover:bg-gray-800 transition"
          >
            Interview Booking
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-6 bg-gray-900">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 text-center">
          <div>
            <h2 className="text-2xl font-semibold mb-2">Team Booking</h2>
            <p className="text-gray-300">
              Organize group meetings efficiently by finding the best overlap.
            </p>
          </div>
          <div>
            <h2 className="text-2xl font-semibold mb-2">Interview Booking</h2>
            <p className="text-gray-300">
              Let others schedule 1-on-1 interviews based on your availability.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 py-6 text-center text-gray-400">
        © 2025 Queen’s Web Development Club. All rights reserved.
      </footer>
    </div>
  );
};

export default Home;
