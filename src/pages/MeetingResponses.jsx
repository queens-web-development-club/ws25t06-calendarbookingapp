import { useState, useRef } from 'react';
import Calendar from "../components/Calendar.jsx";
import { Button, Flex, Box } from "@radix-ui/themes";
import BookingCard from "../components/BookingCard.jsx";
import TimePicker from "../components/TimePicker.jsx";
import MeetingForm from "../components/MeetingForm.jsx";

function MeetingResponses() {
  const [selectedDates, setSelectedDates] = useState([]);
  const [step, setStep] = useState(0);
  const formRef = useRef(null);
  const [meetingData, setMeetingData] = useState(null);

  return (
        <h1>Hello</h1>
  );
}

export default MeetingResponses;
