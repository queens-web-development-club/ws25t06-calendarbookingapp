import { useState } from 'react'
import reactLogo from '../assets/react.svg'
import viteLogo from '/vite.svg'
import '../App.css'
import { useLocation, useNavigate } from 'react-router-dom';
import {
    Box,
    Heading,
    Text,
    Flex,
    Separator,
    Button,
  } from "@radix-ui/themes";

const MeetingSummary = ({meetingData, onClose}) => {
    const { title, description, meetingType, selectedDates, duration, } = meetingData || {};
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
      
    if (!meetingData) {
        return (
          <Box className="max-w-2xl mx-auto p-6 mt-8">
            <Heading size="5">No Meeting Data</Heading>
            <Text>Please go back and create a meeting first.</Text>
          </Box>
        );
    }

    return (
        <Box className="max-w-2xl mx-auto p-6 bg-transparent shadow-md rounded-lg mt-8 space-y-4">
          <Heading size="5" className="text-center">Meeting Summary</Heading>
          <Separator my="3" />
    
          <div className="space-y-2">
            <Flex gap="2">
              <Text className="font-semibold">Title:</Text>
              <Text>{title}</Text>
            </Flex>
    
            <Flex gap="2">
              <Text className="font-semibold">Description:</Text>
              <Text>{description}</Text>
            </Flex>
    
            <Flex gap="2">
              <Text className="font-semibold">Meeting Type:</Text>
              <Text>{meetingType}</Text>
            </Flex>

            <Flex gap="2">
                <div>
                <Text className="font-semibold">Selected Date(s):</Text>
                <ul className="list-disc ml-6 mt-1">
                    {selectedDates.map((date, idx) => (
                    <li key={idx} className="text-gray-800">{date}</li>
                    ))}
                </ul>
                </div>
            </Flex>
            
    
            <Flex gap="2">
              <Text className="font-semibold">Duration:</Text>
              <Text>{duration} minutes</Text>
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
          
          <Button onClick={onClose} color="gray" variant="soft">Close</Button>


        </Box>
      );
    };

export default MeetingSummary