import React, { useState } from "react";
import { TextField, Heading, Flex, Select, ScrollArea } from "@radix-ui/themes";
import { format } from "date-fns";

function TimePicker() {
  const [selectedTime, setSelectedTime] = useState("");

  // Generate 48 time options in 30-minute intervals
  const timeOptions = Array.from({ length: 48 }, (_, i) => {
    const hours = Math.floor(i / 2);
    const minutes = i % 2 === 0 ? "00" : "30";
    return format(new Date().setHours(hours, minutes), "h:mm a");
  });

  return (
    <div className="row-span-1 bg-gray-300 p-4">
      <Heading>Add Interval</Heading>
      <Flex gap="2">
      <Select.Root size="3" value={selectedTime} onValueChange={setSelectedTime}>
          <Select.Trigger className="p-2 border rounded w-40">
            {selectedTime || "Select a time"}
          </Select.Trigger>
          <Select.Content className="max-h-2 overflow-y-hidden" position="popper" >
            {/* Custom div wrapper to apply Tailwind styling correctly */}
              {timeOptions.map((time) => (
                <Select.Item key={time} value={time} className="p-2 hover:bg-gray-100 cursor-pointer">
                  {time}
                </Select.Item>
              ))}
          </Select.Content>
        </Select.Root>
      </Flex>
    </div>
    // Root, Trigger, Content, Viewport, Item
  );
}

export default TimePicker;
