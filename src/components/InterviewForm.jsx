import { useState } from 'react'
import reactLogo from '../assets/react.svg'
import viteLogo from '/vite.svg'
import '../App.css'
import { useParams } from "react-router-dom";
import { Heading, Flex, Button, Box, TextArea, Select, TextField, } from "@radix-ui/themes";
import { format } from "date-fns";
import { useNavigate } from 'react-router-dom';

const CreateInterviewForm = ({ selectedDates, formRef, setInterviewData, setShowSummary}) => {
  const { date } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [interviewType, setInterviewType] = useState("");
  const [duration, setDuration] = useState("")
  const [gap , setGap] = useState("")

  // Generate time options (30-minute intervals)
  const timeOptions = Array.from({ length: 48 }, (_, i) => {
    const hours = Math.floor(i / 2);
    const minutes = i % 2 === 0 ? "00" : "30";
    return format(new Date().setHours(hours, minutes), "h:mm a");
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    const formattedDates = selectedDates.map((date) => format(new Date(date), "yyyy-MM-dd"));

    setInterviewData({
      title,
      description,
      interviewType,
      selectedDates: formattedDates,
      duration,
      gap,
    })

    setShowSummary(true);

  };

  return (
    <Box className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-lg mt-8">
      <Heading size="5" mb="4">
        Create Interview
      </Heading>

      <form ref={formRef} onSubmit={handleSubmit} className="space-y-4 text-left">
        

        

        <div>
          <label className="font-medium min-w-[100px] text-left">Interview Title:</label>
          <TextField.Root
            placeholder="Enter a title for your interview"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="flex-1"
          />
        </div>

        {/* Description */}
        <div>
          <TextArea
            placeholder="What's your interview about?"
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

        {/* Gap Between Interviews */}
        <div className="flex items-center gap-4">
        <label className="w-[130px] font-medium">Break Between Interviews:</label>
        <Select.Root value={gap} onValueChange={setGap}>
            <Select.Trigger placeholder="Select break time" />
            <Select.Content>
            <Select.Item value="0">No Break</Select.Item>
            <Select.Item value="5">5 minutes</Select.Item>
            <Select.Item value="10">10 minutes</Select.Item>
            <Select.Item value="15">15 minutes</Select.Item>
            <Select.Item value="30">30 minutes</Select.Item>
            </Select.Content>
        </Select.Root>
        </div>


      </form>
    </Box>
  );
};

export default CreateInterviewForm;
