import { useState, useRef, useEffect } from 'react';
import Calendar from "../components/Calendar.jsx";
import { Button, Flex, Box } from "@radix-ui/themes";
import BookingCard from "../components/BookingCard.jsx";
import TimePicker from "../components/TimePicker.jsx";
import MeetingForm from "../components/MeetingForm.jsx";
import MeetingSummary from "../components/MeetingSummary.jsx";

function Meeting() {
  const [selectedDates, setSelectedDates] = useState([]);
  const [step, setStep] = useState(0);
  const formRef = useRef(null);
  const [meetingData, setMeetingData] = useState(null);
  const [showSummary, setShowSummary] = useState(false);

  const addTimeInterval = (timeInterval) => {
    setSelectedDates((prevDates) => {
      return prevDates.map((date) => [date[0], timeInterval]);
    });
  };
  
  // Checks if selectedDates updates correctly (for debugging purposes)
  useEffect(() => {
    if (selectedDates.length > 0) {
      console.log("Updated selectedDates:", selectedDates);
    }
    }, [selectedDates]
  );

  return (
    <Flex className="max-w-full mx-auto h-[calc(100vh-5rem)] bg-gray-500" direction="row">
      
      {/* Sidebar - 1 Column */}
      <Box width="30%" height="100%"className="bg-gray-200 p-4">
        <BookingCard meetingData={meetingData} />
      </Box>

      {/* Main Content - 2 Columns */}
      <Box width="70%" height="100%" className="bg-white">
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
            <Box height="70%">
              <Calendar selectedDates={selectedDates} setSelectedDates={setSelectedDates} />
            </Box>
            <Box height="30%" className="flex items-center justify-center" >
              <TimePicker addTimeInterval={addTimeInterval} />
            </Box>
            </Box>
          
        )}
        {step === 1 && (
          <MeetingForm selectedDates={selectedDates} formRef={formRef} setMeetingData={setMeetingData} setShowSummary={setShowSummary}/>
        )}

        {showSummary && (
          <div className="absolute top-0 left-0 w-full h-full bg-gray-100 bg-opacity-60 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-xl p-6 max-w-xl w-full mx-4">
              <MeetingSummary
                meetingData={meetingData}
                onClose={() => setShowSummary(false)}
              />
            </div>
          </div>
        )}


        </Flex>
      </Box>
    </Flex>
  );
}

export default Meeting;
