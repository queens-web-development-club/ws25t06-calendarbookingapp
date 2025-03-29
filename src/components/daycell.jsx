import React from "react";
import { Box, Flex } from "@radix-ui/themes";

const DayCell = () => {
  const times = [
    "9 AM", "10 AM", "11 AM", "12 PM", "1 PM", "2 PM", "3 PM", "4 PM"
  ];

  return (
    <Box className="w-full max-w-md mx-auto border border-gray-300 rounded overflow-hidden">
      {/* Header */}
      <Box className="text-center py-2 border-b border-gray-300 bg-white">
        <div className="text-xs text-gray-500">EST</div>
        <div className="text-sm font-semibold">Fri</div>
        <div className="text-lg font-bold">28</div>
      </Box>

      {/* Time Blocks using Radix Flex */}
      <Flex direction="column">
        {times.map((time, index) => {
          const isBooked = index >= 1 && index <= 3; // 10 AM - 1 PM
          return (
            <Box
              key={time}
              className={`h-16 px-4 flex items-center border-b border-gray-200 text-sm ${
                isBooked ? "bg-green-200" : "bg-white"
              }`}
            >
              <span className="text-gray-700">{time}</span>
            </Box>
          );
        })}
      </Flex>
    </Box>
  );
};

export default DayCell;
