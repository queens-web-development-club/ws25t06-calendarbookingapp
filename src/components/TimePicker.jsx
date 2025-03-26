import React, { useState } from "react";
import { TextField, Heading, Flex, Select, ScrollArea, RadioCards } from "@radix-ui/themes";
import { format } from "date-fns";

function TimePicker() {
  const [selectedTime, setSelectedTime] = useState("");

  const [startHour, setStartHour] = useState("00");
  const [startMin, setStartMin] = useState("00");
  const [startPeriod, setStartPeriod] = useState("AM");

  const [endHour, setEndHour] = useState("00");
  const [endMin, setEndMin] = useState("00");
  const [endPeriod, setEndPeriod] = useState("AM");

  const handleNumberChange = (setter) => (e) => {
    let value = e.target.value.replace(/\D/g, ""); // Remove non-numeric characters

    if (value === "") {
      setter(""); // Allow clearing the input
      return;
    }
    setter(value.slice(0, 2)); // Limit to 2 digits

  }
  
  const handleHourBlur = (setter) => (e) => {
    if (e.target.value.length == 0) {
      setter("00") // Adds 00 if user deletes all characters
    }
    else if (parseInt(e.target.value, 10) > 12) {
      setter("12") // Autocorrects to 12 if a value greater 12 is entered
    }
    else if (e.target.value.length == 1) {
      setter(e.target.value + "0") // Pads with 0 if user enters a single digit
    }
  
  };

  const handleMinBlur = (setter) => (e) => {
    if (e.target.value.length == 0) {
      setter("00") // Adds 00 if user deletes all characters
    }
    else if (parseInt(e.target.value, 10) > 60) {
      setter("60") // Autocorrects to 12 if a value greater 12 is entered
    }
    else if (e.target.value.length == 1) {
      setter(e.target.value + "0") // Pads with 0 if user enters a single digit
    }
  
  };


  return (
    <Flex flexGrow="1" justify="center" className="w-full h-full p-6 bg-white shadow-lg rounded-lg overflow-hidden" 
    align="center" direction="column" gap="2">

      <h2 className="text-lg font-semibold mt-2">Enter Time</h2>
      <Flex gap="4" align="center" justify="center" className="w-full text-4xl font-bold">
        <Flex direction="column" align="center" className="mb-4">
          <span className="text-xs text-center block">Hours</span>
            <input
          type="text"
          value={startHour}
          onChange={handleNumberChange(setStartHour)}
          onBlur={handleHourBlur(setStartHour)}
          className="w-20 h-20 text-center bg-gray-200 rounded-md"
          maxLength={2}
        />
        </Flex>
        <span>:</span>
        <Flex direction="column" align="center" className="mb-4">
          <span className="text-xs text-center block">Minutes</span>
          <input
          type="text"
          value={startMin}
          onChange={handleNumberChange(setStartMin)}
          onBlur={handleMinBlur(setStartMin)}
          className="w-20 h-20 text-center bg-gray-200 rounded-md"
          maxLength={2}
        />
        </Flex>
        
        <Flex direction="column" align="center">
            <RadioCards.Root className=""size="1" gap="0">
                <RadioCards.Item value="1" className="">AM</RadioCards.Item>
                <RadioCards.Item value="2">PM</RadioCards.Item>
            </RadioCards.Root>
        </Flex>
        <span> to </span>

        <Flex direction="column" align="center" className="mb-4">
          <span className="text-xs text-center block">Hours</span>
          <input
          type="text"
          value={endHour}
          onChange={handleNumberChange(setEndHour)}
          onBlur={handleHourBlur(setEndHour)}
          className="w-20 h-20 text-center bg-gray-200 rounded-md"
          maxLength={2}
        />
        </Flex>



        <span>:</span>
        <Flex direction="column" align="center" className="mb-4">
          <span className="text-xs text-center block">Minutes</span>
          <input
          type="text"
          value={endMin}
          onChange={handleNumberChange(setEndMin)}
          onBlur={handleMinBlur(setEndMin)}
          className="w-20 h-20 text-center bg-gray-200 rounded-md"
          maxLength={2}
        />
        </Flex>

        <Flex direction="column" align="center">
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
