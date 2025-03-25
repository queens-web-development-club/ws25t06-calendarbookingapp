import { useState } from 'react'
import reactLogo from '../assets/react.svg'
import viteLogo from '/vite.svg'
import '../App.css'
import Calendar from "../components/Calendar.jsx";
import Interview from "../pages/interview.jsx";
import { Flex, Text, Button, Card, Heading, Separator, Link } from "@radix-ui/themes";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function BookingCard(meetingData) {
    if (!meetingData) {
        return (
          <Card size="5">
            <Flex direction="column" gap="2">
              <Heading className="mb-10">Booking #1</Heading>
              <Text>No meeting created yet.</Text>
            </Flex>
          </Card>
        );
      }

    const { title, description, meetingType, selectedDates, duration } = meetingData;

    return (
        <Card size="5">
          <Flex direction="column" gap="2">
            <Heading className="mb-4">{title}</Heading>
            <Text className="text-gray-700">{description}</Text>
            <Text className="text-sm"><strong>Type:</strong> {meetingType}</Text>
            <Text className="text-sm"><strong>Duration:</strong> {duration} minutes</Text>
    
        {Array.isArray(selectedDates) && selectedDates.length > 0 ? (
            <ul className="list-disc ml-5 text-sm">
                {selectedDates.map((date, i) => (
                <li key={i}>{date}</li>
                ))}
            </ul>
            ) : (
            <Text className="text-sm text-gray-500">No dates selected.</Text>
        )}
    
            <Separator my="3" size="4" />
    
            <Link href="#" className="text-sm">View Booking Page</Link>
            <Link href="#" className="text-sm">Copy Link</Link>
          </Flex>
        </Card>
      );
    }
  
  export default BookingCard