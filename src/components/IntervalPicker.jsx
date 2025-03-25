import { useState } from "react";
import { TextField, RadioCards, Heading, Flex, Select, ScrollArea } from "@radix-ui/themes";

export default function TimeIntervalPicker() {
  const [hour, setHour] = useState("07");
  const [minute, setMinute] = useState("00");
  const [period, setPeriod] = useState("AM");

  return (
    <div className="flex flex-col items-center bg-white p-6 rounded-lg w-full">
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
      </Flex>
      
    </div>
  );
}