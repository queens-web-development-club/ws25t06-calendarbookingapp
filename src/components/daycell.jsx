import React from "react";
import { Box, Flex, ScrollArea } from "@radix-ui/themes";

const DayCell = ({ selectedTime }) => {

  const convertTo24Hour = (timeStr) => {
    const [time, modifier] = timeStr.split(" ");
    let [hours, minutes] = time.split(":");
    hours = parseInt(hours, 10);
    minutes = parseInt(minutes || "0", 10);
  
    if (modifier === "PM" && hours !== 12) hours += 12;
    if (modifier === "AM" && hours === 12) hours = 0;
  
    return hours + minutes / 60;
  };

  const times = [
    "9 AM", "10 AM", "11 AM", "12 PM", "1 PM", "2 PM", "3 PM", "4 PM"
    
  ];

  let startHour = null;
  let endHour = null;

  if (selectedTime) {
    const [startStr, endStr] = selectedTime.split(" - ");
    startHour = convertTo24Hour(startStr);
    endHour = convertTo24Hour(endStr);
  }

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
      <Flex width="90%" direction="column" height="100%" className=" ">
        <Box className="flex flex-grow items-center text-sm ">Fri 28</Box>
        {times.map((time, index) => {
          const isBooked = index >= 1 && index <= 3; // 10 AM - 1 PM
          const rowHour = convertTo24Hour(time);
          const isSelected = startHour !== null && rowHour >= startHour && rowHour < endHour;
          return (
            <Box
              key={time}
              className={`px-4 flex flex-grow items-center border border-gray-400 text-sm ${
                isSelected ? "bg-green-200" : "bg-white"
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
