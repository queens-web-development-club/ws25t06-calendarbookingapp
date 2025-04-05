import { useState, useRef, useEffect } from 'react';
import Calendar from "../components/Calendar.jsx";
import { Button, Flex, Box } from "@radix-ui/themes";
import BookingCard from "../components/BookingCard.jsx";
import TimePicker from "../components/TimePicker.jsx";
import InterviewForm from "../components/InterviewForm.jsx";
import InterviewSummary from "../components/InterviewSummary.jsx";

function Interview() {
  const [selectedDates, setSelectedDates] = useState([]);
  const [step, setStep] = useState(0);
  const formRef = useRef(null);
  const [interviewData, setInterviewData] = useState(null);
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
    setInterviewData(null);
    setStep(0)
  }

  return (
    <Flex className="max-w-full mx-auto h-[calc(100vh-5rem)] bg-gray-500" direction="row">
      
      {/* Sidebar - 1 Column */}
      <Box width="30%" height="100%"className="bg-gray-200 p-4">
        <BookingCard meetingData={interviewData} />
      </Box>

      {/* Main Content - 2 Columns */}
      <Box width="70%" height="100%" className="bg-white">
      <Flex direction="column" height="100%" className="">
        <Flex  className="">
          
          {step > 0 && (
            <Button variant="soft" onClick={() => setStep(step - 1)}>Back</Button>
          )}
          <div className="ml-auto">
            {step < 1 ? (
              <Button variant="soft" onClick={() => setStep(step + 1)}>Next</Button>
            ) : (
              <Button onClick={handleCreate}>Create</Button>
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
          <InterviewForm selectedDates={selectedDates} formRef={formRef} setInterviewData={setInterviewData} 
          setShowSummary={setShowSummary}/>
        )}

        {step === 2 && (
          <Box className="bg-white rounded-xl shadow-xl p-6 max-w-xl w-full mx-4">
              <InterviewSummary
                interviewData={interviewData}
                onClose={handleFinish}
              />
          </Box>
        )}


        </Flex>
      </Box>
    </Flex>
  );
}

export default Interview;