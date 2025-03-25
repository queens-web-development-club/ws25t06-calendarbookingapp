import { useState, useRef } from 'react';
import Calendar from "../components/Calendar.jsx";
import { Button, Flex, Box } from "@radix-ui/themes";
import BookingCard from "../components/BookingCard.jsx";
import TimePicker from "../components/TimePicker.jsx";
import MeetingForm from "../components/MeetingForm.jsx";

function Meeting() {
  const [selectedDates, setSelectedDates] = useState([]);
  const [step, setStep] = useState(0);
  const formRef = useRef(null);
  const [meetingData, setMeetingData] = useState(null);

  return (
    <Flex height="90vh"className="max-w-full mx-auto h-full bg-gray-500" direction="row">
      
      {/* Sidebar - 1 Column */}
      <Box width="33.33%" height="100%"className="bg-gray-200 p-4">
        <BookingCard meetingData={meetingData} />
      </Box>

      {/* Main Content - 2 Columns */}
      <Box width="66.66%" height="100%" className="bg-gray-300">
      <Flex direction="column" height="100%" className="">
        <Flex justify="between" className="">
          
          {step > 0 && (
            <Button variant="soft" onClick={() => setStep(step - 1)}>Back</Button>
          )}
          <div className="ml-auto">
            {step < 1 ? (
              <Button variant="soft" onClick={() => setStep(step + 1)}>Next</Button>
            ) : (
              <Button onClick={() => formRef.current?.requestSubmit()}>Create</Button>
            )}
          </div>
        </Flex>

        {/* Content Switching */}
        {step === 0 && (
          
          <Box height="100%">
            <Box height="80%">
              <Calendar setSelectedDates={setSelectedDates} />
            </Box>
            <Box height="20%" className="flex items-center justify-center" >
              <TimePicker />
            </Box>
            </Box>
          
        )}
        {step === 1 && (
          <MeetingForm selectedDates={selectedDates} formRef={formRef} setMeetingData={setMeetingData}/>
        )}
        </Flex>
      </Box>
    </Flex>
  );
}

export default Meeting;
