import React, { useState } from "react";
import { TextField, Heading, Flex, Select, ScrollArea } from "@radix-ui/themes";
import { format } from "date-fns";
import IntervalPicker from "./IntervalPicker.jsx";

function TimePicker() {
  const [selectedTime, setSelectedTime] = useState("");

  // Generate 48 time options in 30-minute intervals
  const timeOptions = Array.from({ length: 48 }, (_, i) => {
    const hours = Math.floor(i / 2);
    const minutes = i % 2 === 0 ? "00" : "30";
    return format(new Date().setHours(hours, minutes), "h:mm a");
  });

  return (
    <Flex align="center" direction="column" gap="4" className="w-full h-full p-4 border rounded-lg bg-white">
      <IntervalPicker/>
      <IntervalPicker/>
    </Flex>
    // Root, Trigger, Content, Viewport, Item
  );
}

export default TimePicker;
