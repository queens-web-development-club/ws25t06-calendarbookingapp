import React, { useState } from "react";
import { TextField, Heading, Flex, Select, Box, ScrollArea, RadioCards } from "@radix-ui/themes";
import { format } from "date-fns";

function TimePicker() {
  const [selectedTime, setSelectedTime] = useState("");
  const [error, setError] = useState("");

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
  
  const convertTo24Hour = (hour, period) => {
    let h = parseInt(hour, 10);
    if (period === "PM" && h !== 12) h += 12;
    if (period === "AM" && h === 12) h = 0;
    return h.toString().padStart(2, "0");
  };

  const handleSubmit = () => {
    // Check for empty values
    if ([startHour, endHour].includes("00")) {
      setError("Time cannot be 00 in any spot.");
      console.log("ERROR 1")
      return;
    }

    // Convert to 24-hour format for comparison
    const startTime = `${convertTo24Hour(startHour, startPeriod)}:${startMin}`;
    const endTime = `${convertTo24Hour(endHour, endPeriod)}:${endMin}`;

    if (startTime >= endTime) {
      setError("Start time must be before end time.");
      console.log("ERROR 2")
      return;
    }

    setError(""); // Clear error if validation passes
    const formattedTime = `${startHour}:${startMin} ${startPeriod} - ${endHour}:${endMin} ${endPeriod}`;
    setSelectedTime(formattedTime);
    console.log("Selected Time Interval:", formattedTime);
  };
 


  return (
    <Flex flexGrow="1" justify="center" className="w-full h-full p-6 bg-white shadow-lg rounded-lg" 
    align="center" direction="column" gap="2">

      <h2 className="text-lg font-semibold mt-2">Enter Time</h2>
      <Flex gap="3" align="center" justify="center" className="max-w-full h-full ml-auto mr-auto text-4xl font-bold">
        <Flex direction="column" align="center" width="10%"className=" mb-4">
          <span className="text-xs text-center block">Hours</span>
          <input
          type="text"
          value={startHour}
          onChange={handleNumberChange(setStartHour)}
          onBlur={handleHourBlur(setStartHour)}
          className="w-full h-[6vw] text-[4vw] text-center bg-gray-200 rounded-md"
          maxLength={2}
          />
        </Flex>
        <span className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl">:</span>
        <Flex direction="column" align="center" width="10%" className=" mb-4">
          <span className="text-xs text-center block">Minutes</span>
          <input
          type="text"
          value={startMin}
          onChange={handleNumberChange(setStartMin)}
          onBlur={handleMinBlur(setStartMin)}
          className="w-full h-[6vw] text-[4vw] text-center bg-gray-200 rounded-md"
          maxLength={2}
        />
        </Flex>
        
        <Flex direction="column" align="center">
            <RadioCards.Root className="w-[5vw]"size="1" gap="0" defaultValue="AM" onValueChange={setStartPeriod}>
                <RadioCards.Item value="AM" className="">AM</RadioCards.Item>
                <RadioCards.Item value="PM">PM</RadioCards.Item>
            </RadioCards.Root>
        </Flex>
        <span className="mr-2 ml-2 text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl"> to </span>

        <Flex direction="column"width="10%" align="center" className=" mb-4">
          <span className="text-xs text-center block">Hours</span>
          <input
          type="text"
          value={endHour}
          onChange={handleNumberChange(setEndHour)}
          onBlur={handleHourBlur(setEndHour)}
          className="w-full h-[6vw] text-[4vw] text-center bg-gray-200 rounded-md"
          maxLength={2}
        />
        </Flex>



        <span>:</span>
        <Flex direction="column"  width="10%"align="center" className=" mb-4">
          <span className="text-xs text-center block">Minutes</span>
          <input
          type="text"
          value={endMin}
          onChange={handleNumberChange(setEndMin)}
          onBlur={handleMinBlur(setEndMin)}
          className="w-full h-[6vw] text-[4vw] text-center bg-gray-200 rounded-md"
          maxLength={2}
        />
        </Flex>

        <Flex direction="column" width="8%"align="center">
            <RadioCards.Root className="w-[5vw]"size="1" gap="0" defaultValue="PM" onValueChange={setEndPeriod}>
                <RadioCards.Item value="AM" className="">AM</RadioCards.Item>
                <RadioCards.Item value="PM">PM</RadioCards.Item>
            </RadioCards.Root>
        </Flex>
        <Box className="flex justify-center items-center">
          <button onClick={handleSubmit} className="text-2xl w-full h-[6vw] flex items-center justify-center bg-red-500 text-red rounded-lg">
            ✓
          </button>
        </Box>
        
      </Flex>
      
    </Flex>
    // Root, Trigger, Content, Viewport, Item
  );
}

export default TimePicker;
