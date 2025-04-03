import { useState, useRef, useEffect } from 'react';
import Calendar from "../components/Calendar.jsx";
import { Button, Flex, Box } from "@radix-ui/themes";
import BookingCard from "../components/BookingCard.jsx";
import TimePicker from "../components/TimePicker.jsx";
import MeetingForm from "../components/MeetingForm.jsx";
import MeetingSummary from "../components/MeetingSummary.jsx";
import Daycell from "../components/daycell.jsx";

function Meeting() {
  const [selectedDates, setSelectedDates] = useState([]);
  const [step, setStep] = useState(0);
  const formRef = useRef(null);
  const [meetingData, setMeetingData] = useState(null);
  const [showSummary, setShowSummary] = useState(false);

  const addTimeInterval = (timeInterval) => {
    setSelectedDates((prevDates) => {
      return prevDates.map(([d, interval]) => {
        // Apply the new time interval only to dates that don't have one
        return interval === null ? [d, timeInterval] : [d, interval]; 
      });
    });
  };
  
  // Checks if selectedDates updates correctly (for debugging purposes)
  useEffect(() => {
    if (selectedDates.length > 0) {
      console.log("Updated selectedDates:", selectedDates);
    }
    }, [selectedDates]
  );

  const handleCreate = () => {
    setStep(step + 1);
    formRef.current?.requestSubmit()
  }

  const handleFinish = () => {
    setSelectedDates([])
    setMeetingData(null);
    setStep(0)
  }

  return (
    <Flex className="max-w-full mx-auto h-[calc(100vh-5rem)] bg-white" direction="column">


        <Box height="100%">
            <Box maxWidth="80%" height="70%" className="ml-auto mr-auto flex justify-center" >
              <Daycell />
            </Box>
            <Box height="30%" className="flex items-center justify-center" >
              <TimePicker addTimeInterval={addTimeInterval} />
            </Box>
        </Box>
    </Flex>
  );
}

export default Meeting;
