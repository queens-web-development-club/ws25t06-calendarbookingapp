import { useState } from 'react'
import reactLogo from '../assets/react.svg'
import viteLogo from '/vite.svg'
import '../App.css'
import { useParams } from "react-router-dom";
import { Heading, Flex, Button, Box, TextField, TextArea, Select, } from "@radix-ui/themes";
import { format } from "date-fns";

const CreateMeetingForm = () => {
  const { date } = useParams();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [meetingType, setMeetingType] = useState("");

  // Generate time options (30-minute intervals)
  const timeOptions = Array.from({ length: 48 }, (_, i) => {
    const hours = Math.floor(i / 2);
    const minutes = i % 2 === 0 ? "00" : "30";
    return format(new Date().setHours(hours, minutes), "h:mm a");
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = {
      title,
      description,
      date,
      startTime,
      endTime,
      meetingType,
    };
    console.log("Meeting Created:", formData);
    // TODO: Send to backend or context/store
  };

  return (
    <Box className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-lg mt-8">
      <Heading size="5" mb="4">
        Create Meeting for {date}
      </Heading>

      <form onSubmit={handleSubmit} className="space-y-4">
        

        {/* Description */}
        <div>
          <TextArea
            placeholder="What's your meeting about?"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            size="3"
          />
        </div>

        {/* Time Selection */}
        <Flex gap="4">
          <div className="w-full">
            <label className="block mb-1 font-medium">Start Time</label>
            <Select.Root value={startTime} onValueChange={setStartTime}>
              <Select.Trigger placeholder="Select start time" />
              <Select.Content>
                {timeOptions.map((time) => (
                  <Select.Item key={time} value={time}>
                    {time}
                  </Select.Item>
                ))}
              </Select.Content>
            </Select.Root>
          </div>

          <div className="w-full">
            <label className="block mb-1 font-medium">End Time</label>
            <Select.Root value={endTime} onValueChange={setEndTime}>
              <Select.Trigger placeholder="Select end time" />
              <Select.Content>
                {timeOptions.map((time) => (
                  <Select.Item key={time} value={time}>
                    {time}
                  </Select.Item>
                ))}
              </Select.Content>
            </Select.Root>
          </div>
        </Flex>

        {/* Meeting Type */}
        <div>
          <label className="block mb-1 font-medium">Meeting Type</label>
          <Select.Root value={meetingType} onValueChange={setMeetingType}>
            <Select.Trigger placeholder="Choose meeting type" />
            <Select.Content>
              <Select.Item value="group">Group</Select.Item>
              <Select.Item value="one-on-one">One on One</Select.Item>
            </Select.Content>
          </Select.Root>
        </div>

      </form>
    </Box>
  );
};

export default CreateMeetingForm;
