import { useState } from 'react'
import reactLogo from '../assets/react.svg'
import viteLogo from '/vite.svg'
import '../App.css'
import { useParams } from "react-router-dom";
import { Heading, Flex, Button, Box, TextArea, Select, TextField, } from "@radix-ui/themes";
import { format } from "date-fns";
import { useNavigate } from 'react-router-dom';

const CreateMeetingForm = ({ selectedDates }) => {
  const { date } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [meetingType, setMeetingType] = useState("");
  const [duration, setDuration] = useState("")

  // Generate time options (30-minute intervals)
  const timeOptions = Array.from({ length: 48 }, (_, i) => {
    const hours = Math.floor(i / 2);
    const minutes = i % 2 === 0 ? "00" : "30";
    return format(new Date().setHours(hours, minutes), "h:mm a");
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    const formattedDates = selectedDates.map((date) => format(new Date(date), "yyyy-MM-dd"));

    navigate("/meeting-summary", {
      state: {
        title, 
        description,
        meetingType,
        selectedDates: formattedDates,
        duration,
      },
    });

  };

  return (
    <Box className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-lg mt-8">
      <Heading size="5" mb="4">
        Create Meeting
      </Heading>

      <form onSubmit={handleSubmit} className="space-y-4 text-left">
        
        {/*Meeting Title*/}

        <div>
          <label className="font-medium min-w-[100px] text-left">Meeting Title:</label>
          <TextField.Root
            placeholder="Enter a title for your meeting"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="flex-1"
          />
        </div>

        {/* Description */}
        <div>
          <TextArea
            placeholder="What's your meeting about?"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            size="3"
          />
        </div>

        {/* Duration */}
        <div className="flex items-center gap-4">
          <label className="w-[130px] font-medium">Duration:</label>
          <Select.Root value={duration} onValueChange={setDuration}>
            <Select.Trigger placeholder="Select duration" />
            <Select.Content>
            <Select.Item value="30">30 minutes</Select.Item>              
            <Select.Item value="60">1 hour</Select.Item>
            <Select.Item value="90">1 hour 30 minutes</Select.Item>
            <Select.Item value="120">2 hours</Select.Item>
            </Select.Content>
          </Select.Root>
        </div>

        {/* Meeting Type */}
        <div className="flex items-center gap-4">
          <label className="w-[130px] font-medium">Meeting Type:</label>
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
