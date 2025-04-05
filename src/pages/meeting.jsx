import { useState, useRef, useEffect } from 'react';
import Calendar from "../components/Calendar.jsx";
import { Button, Flex, Box } from "@radix-ui/themes";
import BookingSummary from "../components/BookingSummary.jsx"; // ✅ Replaces BookingCard
import TimePicker from "../components/TimePicker.jsx";
import MeetingForm from "../components/MeetingForm.jsx";
import MeetingSummary from "../components/MeetingSummary.jsx";

function Meeting() {
  const [selectedDates, setSelectedDates] = useState([]);
  const [step, setStep] = useState(0);
  const formRef = useRef(null);
  const [meetingData, setMeetingData] = useState(null);
  const [showSummary, setShowSummary] = useState(false);
  const [isFormComplete, setIsFormComplete] = useState(false);

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
    setStep(step + 1);
    formRef.current?.requestSubmit();
  };

  const handleFinish = () => {
    setSelectedDates([]);
    setMeetingData(null);
    setStep(0);
  };

  return (
    <Flex className="max-w-full mx-auto h-[calc(100vh-6rem)] bg-gray-500" direction="row">

      {/* ✅ Sidebar with team bookings */}
      <Box width="30%" height="100%" className="bg-gray-200 p-4 overflow-y-auto">
        <BookingSummary type="team" />
      </Box>

      {/* Main Content */}
      <Box width="70%" height="100%" className="bg-white">
        <Flex direction="column" height="100%">
          {/* Navigation Buttons */}
          <Flex justify="between" className="mt-4">
            <Box className={step === 1 ? "ml-4" : "invisible"}>
              <Button color="blue" variant="soft" onClick={() => setStep(step - 1)}>Back</Button>
            </Box>
            <Box className="mr-4">
              {step === 0 && (
                <Button
                  color="blue"
                  variant="soft"
                  disabled={!selectedDates.some(([_, interval]) => interval != null)}
                  onClick={() => setStep(step + 1)}
                >
                  Next
                </Button>
              )}
              {step === 1 && (
                <Button
                  color="blue"
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
