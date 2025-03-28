import { useState } from 'react'
import reactLogo from '../assets/react.svg'
import viteLogo from '/vite.svg'
import '../App.css'
import Calendar from "../components/Calendar.jsx";
import TimePicker from "../components/TimePicker.jsx";
import { useLocation, useNavigate } from 'react-router-dom';
import {
    Box,
    Heading,
    Text,
    Flex,
    Separator,
    Button,
  } from "@radix-ui/themes";

const MeetingSummary = () => { // Accept setSelectedDates as prop
    const [selectedDates, setSelectedDates] = useState([]);
    const { state } = useLocation();
    const { title, description, meetingType, dates, duration, } = state || {};
    const navigate = useNavigate();

    const shareLink = `https://example.com/share/${Math.random()
        .toString(36)
        .substring(2, 8)}`;

    const handleCopy = () => {
        navigator.clipboard.writeText(shareLink);
        alert("Link copied to clipboard!");
    };

    const handleDelete = () => {
        const confirm = window.confirm("Are you sure you want to delete this meeting?");
        if (confirm) {
          alert("Meeting deleted.");
          navigate("/meeting");
        }
      };
      
    if (state) {
        return (
          <Box className="max-w-2xl mx-auto p-6 mt-8">
            <Heading size="5">No Meeting Data</Heading>
            <Text>Please go back and create a meeting first.</Text>
          </Box>
        );
    }

    return (
        <Flex width="100%" className="h-[calc(100vh-5rem)]">
        <Box className="w-1/3 h-1/2 mx-auto p-6 bg-white shadow-md rounded-lg mt-8 space-y-4">
          <Heading size="5" className="text-center">Meeting Summary</Heading>
          <Separator my="3" />
    
          <div className="space-y-2">
            <Flex gap="2">
              <Text className="font-semibold">Title:</Text>
              <Text>Test Title</Text>
            </Flex>
    
            <Flex gap="2">
              <Text className="font-semibold">Description:</Text>
              <Text>Test description</Text>
            </Flex>
    
            <Flex gap="2">
              <Text className="font-semibold">Meeting Type:</Text>
              <Text>Group Meeting</Text>
            </Flex>

            <Flex gap="2">
                <div>
                <Text className="font-semibold">Selected Date(s):</Text>
                <ul className="list-disc ml-6 mt-1">
                    TEst dates sssssssssssssss jjjjjjjjjj
                </ul>
                </div>
            </Flex>
            
    
            <Flex gap="2">
              <Text className="font-semibold">Duration:</Text>
              <Text>25 minutes</Text>
            </Flex>
          </div>
    
          <Separator my="3" />
    
          <Flex justify="between" align="center" className="mt-6">
            <Text className="text-sm text-gray-500">{shareLink}</Text>
            <Button onClick={handleCopy}>Copy Share Link</Button>
          </Flex>

          <div className='flex justify-end mt-4'>
            <Button color="red" variant="soft" onClick={handleDelete}>Delete Meeting</Button>
          </div>
        </Box>
        <Box height="100%">
            <Box height="70%">
              <Calendar setSelectedDates={setSelectedDates} />
            </Box>
            <Box height="30%" className="flex items-center justify-center" >
              <TimePicker />
            </Box>
        </Box>
        </Flex>
      );
    };

export default MeetingSummary