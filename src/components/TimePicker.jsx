import React, { useState } from "react";
import { TextField, Heading, Flex, Select, ScrollArea, RadioCards } from "@radix-ui/themes";
import { format } from "date-fns";
import IntervalPicker from "./IntervalPicker.jsx";

function TimePicker() {
  const [selectedTime, setSelectedTime] = useState("");
  const [hour, setHour] = useState("07");
  const [minute, setMinute] = useState("00");
  const [period, setPeriod] = useState("AM");

  // Generate 48 time options in 30-minute intervals
  const timeOptions = Array.from({ length: 48 }, (_, i) => {
    const hours = Math.floor(i / 2);
    const minutes = i % 2 === 0 ? "00" : "30";
    return format(new Date().setHours(hours, minutes), "h:mm a");
  });

  return (
    <Flex flexGrow="1"  className="w-full p-6 bg-white shadow-lg rounded-lg overflow-hidden" 
    align="center" direction="column" gap="2">
      <h2 className="text-lg font-semibold mb-4">Enter Time</h2>
      <Flex gap="4" align="center" className="w-full text-4xl font-bold">
        <input
          type="text"
          value={hour}
          onChange={(e) => setHour(e.target.value)}
          className="w-20 h-20 text-center bg-gray-200 rounded-md"
          maxLength={2}
        />
        <span>:</span>
        <input
          type="text"
          value={minute}
          onChange={(e) => setMinute(e.target.value)}
          className="w-20 h-20 text-center bg-gray-200 rounded-md"
          maxLength={2}
        />
        <Flex direction="column">
            <RadioCards.Root className=""size="1" gap="0">
                <RadioCards.Item value="1" className="">AM</RadioCards.Item>
                <RadioCards.Item value="2">PM</RadioCards.Item>
            </RadioCards.Root>
        </Flex>
        <span> to </span>
        <input
          type="text"
          value={hour}
          onChange={(e) => setHour(e.target.value)}
          className="w-20 h-20 text-center bg-gray-200 rounded-md"
          maxLength={2}
        />
        <span>:</span>
        <input
          type="text"
          value={minute}
          onChange={(e) => setMinute(e.target.value)}
          className="w-20 h-20 text-center bg-gray-200 rounded-md"
          maxLength={2}
        />
        <Flex direction="column">
            <RadioCards.Root className=""size="1" gap="0">
                <RadioCards.Item value="1" className="">AM</RadioCards.Item>
                <RadioCards.Item value="2">PM</RadioCards.Item>
            </RadioCards.Root>
        </Flex>
        <button className="text-2xl h-20 bg-red-500 text-red rounded-lg hover:bg-red-700">
          ✓
        </button>
      </Flex>
      
    </Flex>
    // Root, Trigger, Content, Viewport, Item
  );
}

export default TimePicker;
