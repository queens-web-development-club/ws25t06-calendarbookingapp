import React, { useState } from "react";
import { TextField, Heading, Flex } from "@radix-ui/themes";

function TimePicker() {

    const [time, setTime] = useState("00:00");

    const handleChange = (event) => {
      let value = event.target.value.replace(/[^0-9:]/g, ""); // Only allow numbers and ":"
      
      if (value.length > 5) return; // Prevent overflow
  
      // Auto-format if user types numbers without ":"
      if (value.length === 2 && !value.includes(":")) {
        value = value.slice(0, 2) + ":"; 
      }
  
      setTime(value);
    };
  
    return (
        <div className="row-span-1 bg-gray-300 p-4">
            <Heading>Add Interval</Heading>
            <Flex>
                <TextField.Root value={time} onChange={handleChange} placeholder="00:00" />
                <TextField.Root value={time} onChange={handleChange} placeholder="00:00" />
            </Flex>
            
        </div>
    );
};

export default TimePicker;