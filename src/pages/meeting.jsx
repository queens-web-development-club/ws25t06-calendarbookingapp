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
    <Flex className="max-w-screen mx-auto h-full" direction="row">
      
      {/* Sidebar - 1 Column */}
      <Box className="bg-gray-300 p-4 w-1/3 max-h-full overflow-auto">
        <BookingCard meetingData={meetingData} />
      </Box>

      {/* Main Content - 2 Columns */}
      <Box className="bg-gray-200 flex-1 h-full">
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
          <Flex direction="column" className="h-full">
            <Box flexGrow={3} className="overflow-auto">
              <Calendar setSelectedDates={setSelectedDates} />
            </Box>
            <Box flexGrow={1} className="overflow-auto">
              <TimePicker />
            </Box>
          </Flex>
        )}
        {step === 1 && (
          <MeetingForm selectedDates={selectedDates} formRef={formRef} setMeetingData={setMeetingData}/>
        )}
      </Box>
    </Flex>
  );
}

export default Meeting;
