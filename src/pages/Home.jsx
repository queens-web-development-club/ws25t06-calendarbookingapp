import React from "react";
import { Link } from "react-router-dom";
import { Box, Section, Flex } from "@radix-ui/themes";
import { motion } from "framer-motion";

const Home = () => {
  return (
    <Flex direction="column" className="bg-gray-900 h-[calc(100vh-6rem)] text-white font-sans overflow-y-auto">
      {/* Hero Section */}
      <Section height="60%" className="space-y-8 flex flex-col items-center justify-center text-center 
      px-6 bg-gradient-to-br from-blue-500 to-green-400">
        <motion.h1
          className="text-[7vh] font-extrabold text-black"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Book Smarter with the QWeb Booking App
        </motion.h1>

        <motion.p
          className="mt-4 text-[1.4vw] text-black"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          Schedule interviews and meetings with ease, all in one place.
        </motion.p>

        <motion.div
          className="mt-8 space-x-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.8 }}
        >
          <Link
            to="/meeting"
            className="bg-black text-white px-6 py-4 rounded-xl hover:bg-gray-800 transition"
          >
            Team Booking
          </Link>
          <Link
            to="/interview"
            className="bg-black text-white px-6 py-4 rounded-xl hover:bg-gray-800 transition"
          >
            Interview Booking
          </Link>
        </motion.div>
      </Section>

      {/* Features Section */}
      <Section height="30%" className=" px-6 bg-gray-900 flex flex-col items-center">
        <div className="flex flex-col items-center mx-auto my-auto grid grid-cols-1 md:grid-cols-2 gap-12 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-[1.7vw] font-semibold mb-2">Team Booking</h2>
            <p className="text-gray-300 text-[1.2vw]">
              Organize group meetings efficiently by finding the best overlap.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <h2 className="text-[1.7vw] font-semibold mb-2 ">Interview Booking</h2>
            <p className="text-[1.2vw] text-gray-300">
              Let others schedule 1-on-1 interviews based on your availability.
            </p>
          </motion.div>
        </div>
      </Section>

      {/* Footer */}
      <footer className="bg-gray-800 h-[10%] py-6 text-center text-gray-400
      text-sm sm:text-base md:text-lg lg:text-xl">
        © 2025 Queen’s Web Development Club. All rights reserved.
      </footer>
    </Flex>
  );
};

export default Home;
