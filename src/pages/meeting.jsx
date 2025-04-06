import { useState, useRef, useEffect } from 'react';
import Calendar from "../components/Calendar.jsx";
import { Button, Flex, Box, Separator} from "@radix-ui/themes";
import BookingSummary from "../components/BookingSummary.jsx";
import TimePicker from "../components/TimePicker.jsx";
import MeetingForm from "../components/MeetingForm.jsx";
import MeetingSummary from "../components/MeetingSummary.jsx";
import BookingCard from "../components/MeetingBookingCard.jsx";

function Meeting() {
  const [selectedDates, setSelectedDates] = useState([]);
  const [step, setStep] = useState(0);
  const formRef = useRef(null);
  const [meetingData, setMeetingData] = useState(null);
  const [showSummary, setShowSummary] = useState(false);
  const [isFormComplete, setIsFormComplete] = useState(false);
  const [meetings, setMeetings] = useState([])

  const addTimeInterval = (timeInterval) => {
    setSelectedDates((prevDates) => {
      return prevDates.map(([d, interval]) => {
        return interval === null ? [d, timeInterval] : [d, interval];
      });
    });
  };

  useEffect(() => {
    if (selectedDates.length > 0) {
      console.log("Updated selectedDates:", selectedDates);
    }
  }, [selectedDates]);

  const handleCreate = () => {
    
    
    formRef.current?.requestSubmit();
  };

  useEffect(() => {
    if (meetingData) {
      setMeetings(prev => [...prev, meetingData]);
      setStep(2);
      console.log("New Meeting Added:", meetingData);
    }
  }, [meetingData])

  const handleFinish = () => {
    setSelectedDates([]);
    setMeetingData(null);
    setStep(0);
  };

  return (
    <Flex className="max-w-full mx-auto h-[calc(100vh-6rem)] " direction="row">

      {/* ✅ Sidebar with team bookings */}
      <Box width="30%" height="100%" className="bg-gray-900 p-4 overflow-y-auto">
            {meetings.length === 0 ? (
          <BookingCard/>
        ) : (
          meetings.map((meeting, index) => (
            <BookingCard key={index} meetingData={meeting} />
          ))
        )}
      </Box>

      <Separator orientation="vertical" size="4" color="white"/>
      {/* Main Content */}
      <Box width="70%" height="100%" className=" bg-gray-900">
        <Flex direction="column" height="100%">
          {/* Navigation Buttons */}
          <Flex justify="between" className="mt-4">
            <Box className={step === 1 ? "ml-4" : "invisible"}>
              <Button variant="soft" onClick={() => setStep(step - 1)}>Back</Button>
            </Box>
            <Box className="mr-4">
              {step === 0 && (
                <Button
                  variant="soft"
                  disabled={!selectedDates.some(([_, interval]) => interval != null)}
                  onClick={() => setStep(step + 1)}
                >
                  Next
                </Button>
              )}
              {step === 1 && (
                <Button
                  disabled={!isFormComplete}
                  onClick={handleCreate}
                >
                  Create
                </Button>
              )}
            </Box>
          </Flex>

          {/* Content Switching */}
          {step < 2 && (
            <Box height="100%">
              <Box height="70%">
                <Calendar selectedDates={selectedDates} setSelectedDates={setSelectedDates} />
              </Box>
              <Box height="30%" className="flex items-center justify-center">
                {step !== 1 ? (
                  <TimePicker addTimeInterval={addTimeInterval} />
                ) : (
                  <MeetingForm
                    selectedDates={selectedDates}
                    formRef={formRef}
                    setMeetingData={setMeetingData}
                    setShowSummary={setShowSummary}
                    onFormChange={setIsFormComplete}
                  />
                )}
              </Box>
            </Box>
          )}

          {step === 2 && (
            <MeetingSummary
              meetingData={meetingData}
              onClose={handleFinish}
            />
          )}
        </Flex>
      </Box>
    </Flex>
  );
}

export default Meeting;
