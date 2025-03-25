import { useState } from 'react'
import reactLogo from '../assets/react.svg'
import viteLogo from '/vite.svg'
import '../App.css'
import { useLocation } from 'react-router-dom';
import {
    Box,
    Heading,
    Text,
    Flex,
    Separator,
    Button,
  } from "@radix-ui/themes";

const MeetingSummary = () => {
    const { state } = useLocation();
    const { title, description, meetingType, selectedDates } = state || {};
    
    const shareLink = `https://example.com/share/${Math.random()
        .toString(36)
        .substring(2, 8)}`;

    const handleCopy = () => {
        navigator.clipboard.writeText(shareLink);
        alert("Link copied to clipboard!");
    };

    return (
        <Box className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-lg mt-8 space-y-4">
          <Heading size="5">Meeting Summary</Heading>
          <Separator my="3" />
    
          <Text><strong>Title:</strong> {title}</Text>
          <Text><strong>Description:</strong> {description}</Text>
          <Text><strong>Meeting Type:</strong> {meetingType}</Text>
    
          <Box>
            <Text className="font-semibold mt-4 mb-1">Selected Date(s):</Text>
            {selectedDates && selectedDates.length > 0 ? (
              <ul className="list-disc ml-6">
                {selectedDates.map((date, idx) => (
                  <li key={idx}>{date}</li>
                ))}
              </ul>
            ) : (
              <Text>No dates selected.</Text>
            )}
          </Box>

          <Text><strong>Duration:</strong> {duration} minutes</Text>
    
          <Flex justify="between" align="center" className="mt-6">
            <Text className="text-sm text-gray-500">{shareLink}</Text>
            <Button onClick={handleCopy}>Copy Share Link</Button>
          </Flex>
        </Box>
      );
    };

export default MeetingSummary