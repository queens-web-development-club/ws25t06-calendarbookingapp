import { useState } from 'react';
import Calendar from "../components/Calendar.jsx";
import { Button, Flex, Box} from "@radix-ui/themes";
import BookingCard from "../components/BookingCard.jsx";
import TimePicker from "../components/TimePicker.jsx";
import MeetingForm from "../components/MeetingForm.jsx";
import { useRef } from 'react';

function Meeting() {
  const [selectedDates, setSelectedDates] = useState([]); // State for selected dates
  const [step, setStep] = useState(0); // State for selected dates
  const formRef = useRef(null)
  const [meetingData, setMeetingData] = useState(null)

  const handleCreateNew = () => {
    console.log("Selected Dates:", selectedDates.map(date => date.toDateString())); // Log readable dates
    setShowForm(true);
  };

  return (
    <Flex className="max-h-full min-w-full h-full" direction="row">
      {/* Sidebar - 1 Column */}
      <Box className="bg-gray-300 p-4 w-1/3">
        <BookingCard meetingData={meetingData}/>
      </Box>

      {/* Main Content - 2 Columns */}
      <Box className="p-6 bg-gray-200 flex-1">
        <Flex justify="between">
        
          {step > 0 && (
            <Button variant="soft" className="flex justify-left" onClick={() => setStep(step - 1)}>Back</Button>
          )}
          <div className="ml-auto">
            {step < 1 ? (
              <Button className="" variant="soft" onClick={() => setStep(step + 1)}>Next</Button>
            ) : (<Button onClick={() => formRef.current?.requestSubmit()}>Create</Button>)}
          </div>
        </Flex>

        {step == 0 && (
          <Flex direction="column" height={"97%"}>
            <Calendar setSelectedDates={setSelectedDates} />
            <TimePicker />
          </Flex>
        )}
        {step == 1 && (
          <MeetingForm selectedDates={selectedDates} formRef={formRef} setMeetingData={setMeetingData}/>
        )}
        
        

      </Box>
    </Flex>
  );
}

export default Meeting;
