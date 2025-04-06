import React from "react";
import { Box, Flex, ScrollArea, Button } from "@radix-ui/themes";
import { useState, useRef, useEffect } from 'react';

const DayCell = ({ selectedTime, respondents, setDay, day }) => {

  
  const refSlot = useRef(null);
  const [boxHeight, setBoxHeight] = useState(0);


  const times = [
    ["Sun Apr 06 2025", ["9:30 AM","10:00 AM", "11:00 AM", "12:00 PM", "1:00 PM", "2:00 PM", "3:00 PM", "4:40 PM"]],
    ["Wed Apr 16 2025" , ["9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM"]],
    ["Thu Apr 24 2025", ["7:00 AM", "8:00 AM", "9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM"]]
  ]

  const convertTo24Hour = (timeStr) => {
    const [time, modifier] = timeStr.split(" ");
    let [hours, minutes] = time.split(":");
    hours = parseInt(hours, 10);
    minutes = parseInt(minutes || "0", 10);
  
    if (modifier === "PM" && hours !== 12) hours += 12;
    if (modifier === "AM" && hours === 12) hours = 0;
  
    return hours + minutes / 60;
  };

  // Measure height of first full slot dynamically
  useEffect(() => {
    if (!refSlot.current) return;
  
    const observer = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const measured = entry.contentRect.height;
        setBoxHeight(measured);
      }
    });
  
    observer.observe(refSlot.current);
  
    return () => observer.disconnect();
  }, [day]);
  
  const hourNum = times[day][1].length;
  let startMod = (convertTo24Hour(times[day][1][0]) - Math.floor(convertTo24Hour(times[day][1][0]))).toFixed(2);
  let endMod = (convertTo24Hour(times[day][1][hourNum - 1]) - Math.floor(convertTo24Hour(times[day][1][hourNum - 1]))).toFixed(2);
  if (startMod == 0) {
    startMod = 1
  }
  if (endMod == 0) {
    endMod = 1
  }



  // Calculate startMod and endMod when day changes
  useEffect(() => {
    if (times[day].length > 1) {
      const hourNum = times[day][1].length;
      const start = convertTo24Hour(times[day][1][0]);
      const end = convertTo24Hour(times[day][1][hourNum - 1]);

      let startMod = (start - Math.floor(start)).toFixed(2);
      let endMod = (end - Math.floor(end)).toFixed(2);

      if (startMod == 0) {
        startMod = 1
      }
      if (endMod == 0) {
        endMod = 1
      }

      console.log("startMod:", startMod, "endMod:", endMod);
    }
  }, [day]);
    

  const getHourLabel = (timeStr) => {
    const [time, modifier] = timeStr.split(" ");
    const [hour] = time.split(":");
    return `${hour}:00 ${modifier}`;
  };
  
  
  
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
        <Box className=" items-center justify-center text-sm m-btext-gray-600"
        style={{ height: `${boxHeight * startMod}px` }}>
            <span className="text-gray-300">{times[day][1][0]}</span>
          </Box>
        {times[day][1].slice(1, times[day][1].length - 1).map((time) => (
          <Box key={time} className="flex flex-grow items-center justify-center text-sm m-btext-gray-600">
            <span className="text-gray-300">{time}</span>
          </Box>
        ))}
        <Box className=" items-center justify-center text-sm m-btext-gray-600"
        style={{ height: `${boxHeight * endMod}px` }}>
            <span className="text-gray-300">{getHourLabel(times[day][1][times[day][1].length - 1])}</span>
          </Box>
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
        <Box 
              className="relative px-4 items-center border border-gray-600 text-sm bg-gray-800"
              style={{ height: `${boxHeight * startMod}px` }}>
                
        </Box>
        {times[day][1].slice(1, times[day][1].length - 1).map((time, index) => {
          
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
              className="relative px-4 flex flex-grow items-center border border-gray-600 bg-gray-800"
              ref={index === 0 ? refSlot : null} 
        
              // attach ref to first full slot
            >
              <Box className="absolute right-2 top-0 text-[10px] text-gray-400 z-50">
              
            </Box>
            {Object.values(respondents || {}).map((r, i) => {
  const availability = r.availability;
  if (!availability || availability.date !== times[day][0]) return null;

  const [startStr, endStr] = availability.timeInterval.split(" - ");
  if (!startStr || !endStr) return null;

  const rStart = convertTo24Hour(startStr);
  const rEnd = convertTo24Hour(endStr);
  const isBeforeStart = slotEnd <= rStart;
  const isAfterEnd = slotStart >= rEnd;

  if (isBeforeStart || isAfterEnd) return null;

  const overlapStart = Math.max(rStart, slotStart);
  const overlapEnd = Math.min(rEnd, slotEnd);
  const fillPercent = (overlapEnd - overlapStart) * 100;
  const fillTop = (overlapStart - slotStart) * 100;

  const cyanShades = [
    "bg-cyan-100",
    "bg-cyan-200",
    "bg-cyan-300",
    "bg-cyan-400",
    "bg-cyan-500",
    "bg-cyan-600",
    "bg-cyan-700",
    "bg-cyan-800",
    "bg-cyan-900"
  ];

  return (
    <Box
      key={r.email}
      className={`absolute left-0 w-full opacity-[50%] ${cyanShades[i % cyanShades.length]} z-0`}
      style={{
        top: `${fillTop}%`,
        height: `${fillPercent}%`,
      }}
    />
  );
})}

              <Box className="relative z-10 w-full h-full" />
            </Box>
          );
        })}
        <Box
              className="relative px-4 items-center border border-gray-600 text-sm bg-gray-800"
              style={{ height: `${boxHeight * endMod}px` }}>
                
        </Box>



      </Flex>

    </Flex>
  );
};

export default DayCell;
