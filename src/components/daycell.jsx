import React from "react";
import { Box, Flex } from "@radix-ui/themes";

const DayCell = () => {
  const times = [
    "9 AM", "10 AM", "11 AM", "12 PM", "1 PM", "2 PM", "3 PM", "4 PM"
    
  ];


  const rowHeight = `h-[${100 / times.length + 1}%]`;
  return (
    <Flex direction="row" height="100%"className="h-full w-full">
      {/* Header */}
      <Flex width="10%" direction="column">
      <Box className="flex flex-grow items-center justify-center text-sm font-semibold text-gray-500">
          Time
        </Box>
        {times.map((time) => (
          <Box key={time} className="flex flex-grow items-center justify-center text-sm text-gray-600">
            {time}
          </Box>
        ))}
      </Flex>

      {/* Time Blocks using Radix Flex */}
      <Flex width="90%" direction="column" height="100%" className="">
        <Box className="flex flex-grow items-center text-sm ">Fri 28</Box>
        {times.map((time, index) => {
          const isBooked = index >= 1 && index <= 3; // 10 AM - 1 PM
          return (
            <Box
              key={time}
              className={`px-4 flex flex-grow items-center border border-gray-400 text-sm ${
                isBooked ? "bg-green-200" : "bg-white"
              }`}
            >
              <span className="text-gray-700">{time}</span>
            </Box>
          );
        })}
      </Flex>
    </Flex>
  );
};

export default DayCell;
