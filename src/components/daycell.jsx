import React from "react";
import { Box, Flex, ScrollArea, Button } from "@radix-ui/themes";
import { useState } from 'react';

const DayCell = ({ selectedTime }) => {

  const [day, setDay] = useState(0)

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
    ["Sun Apr 06 2025", ["9 AM", "10 AM", "11 AM", "12 PM", "1 PM", "2 PM", "3 PM", "4 PM"]],
    ["Wed Apr 16 2025" , ["9 AM", "10 AM", "11 AM", "12 PM", "1 PM", "2 PM", "3 PM", "4 PM", "5 PM"]],
    ["Thu Apr 24 2025", ["7 AM", "8 AM", "9 AM", "10 AM", "11 AM", "12 PM", "1 PM", "2 PM", "3 PM", "4 PM"]]
  ]
    
  // Fri 28

  let test = times[day][0].slice(0, 3) + times[day][0].slice(8, 10);

  let startHour = null;
  let endHour = null;

  if (selectedTime) {
    const [startStr, endStr] = selectedTime.split(" - ");
    startHour = convertTo24Hour(startStr);
    endHour = convertTo24Hour(endStr);
  }

  const handleNextDay = () => {
    if (day < times.length - 1) {
      setDay(day + 1);
    }
  }

  const handlePrevDay = () => {
    if (day > 0 ) {
      setDay(day - 1);
    }
  }

  const rowHeight = `h-[${100 / times[day][1].length + 1}%]`;
  return (
    <Flex direction="row" height="100%"className="h-full w-full pt-4">
      
      

      <Flex width="10%" direction="column">
        <Box className="mb-4 items-center justify-center text-sm font-semibold text-gray-500">
          Time
        </Box>
        {times[day][1].map((time) => (
          <Box key={time} className="flex flex-grow items-center justify-center text-sm m-btext-gray-600">
            <span>{time}</span>
          </Box>
        ))}
      </Flex>

      {/* Time Blocks using Radix Flex */}
      <Flex width="90%" direction="column" height="100%" className=" ">
        <Flex direction="row" justify="between">
          <Box className={day === 0 ? "invisible" : ""}>
            <Button size="1" variant="soft" onClick={handlePrevDay} 
            disabled={day === 0} >Previous Day</Button>
          </Box>
          
          <Box className="mb-4 items-center justify-center text-sm ">
            {times[day][0].slice(0, 3) + " " + times[day][0].slice(8, 10)}
          </Box>
          <Box className={day == times.length - 1 ? "invisible opacity-0" : ""}>
            <Button size="1" variant="soft" onClick={handleNextDay} 
            disabled={day === times.length - 1}>Next Day</Button>
        </Box>
        </Flex>
        
        {times[day][1].map((time, index) => {
          const slotStart = convertTo24Hour(time);
          const slotEnd = slotStart + 1;

          let fillType = null; // "top", "bottom", "full"
          let fillPercent = 0;

          if (startHour !== null && endHour !== null) {
            const isBeforeStart = slotEnd <= startHour;
            const isAfterEnd = slotStart >= endHour;

            if (!isBeforeStart && !isAfterEnd) {
              // Overlapping
              const overlapStart = Math.max(startHour, slotStart);
              const overlapEnd = Math.min(endHour, slotEnd);
              const overlap = Math.max(0, overlapEnd - overlapStart);
              fillPercent = (overlap / 1) * 100;

              if (fillPercent === 100) {
                fillType = "full";
              } else if (startHour > slotStart && endHour >= slotEnd) {
                fillType = "bottom"; // Partial start
              } else if (endHour < slotEnd && startHour <= slotStart) {
                fillType = "top"; // Partial end
              } else {
                fillType = "full"; // Safety fallback
              }
            }
          }

          return (
            <Box
              key={time}
              className="relative px-4 flex flex-grow items-center border border-gray-400 text-sm bg-white h-12"
            >
              {fillPercent > 0 && (
                <Box
                  className={`absolute left-0 w-full bg-green-200 z-0 ${
                    fillType === "top"
                      ? "top-0"
                      : fillType === "bottom"
                      ? "bottom-0"
                      : "top-0"
                  }`}
                  style={{
                    height: `${fillPercent}%`,
                  }}
                />
              )}
              <Box className="relative z-10 w-full h-full" />
            </Box>
          );
        })}




      </Flex>

    </Flex>
  );
};

export default DayCell;
