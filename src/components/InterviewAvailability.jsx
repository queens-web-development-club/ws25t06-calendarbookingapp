import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { Box, Heading, Text, Button, Flex, ScrollArea } from "@radix-ui/themes";
import { format } from "date-fns";
import CalendarInterview from "../components/calenderInterview.jsx";

// mock interview data for now 
const mockInterviewData = {
  title: "Software Developer Interview",
  description: "Interview for entry-level dev role",
  selectedDates: ["2025-04-02", "2025-04-03"],
  duration: 15, // in minutes
  breakBetween: 5, // in minutes
  startTime: "09:00", // default start time
  endTime: "17:00", // default end time
};

const InterviewBookingPage = () => {
  const { id } = useParams(); // from the share link: /interview/:id
  const [selectedDate, setSelectedDate] = useState(mockInterviewData.selectedDates[0]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [timeSlots, setTimeSlots] = useState([]);

  useEffect(() => {
    if (selectedDate) {
        generateTimeSlots();
        setSelectedSlot(null);
    }
  }, [selectedDate]);

  const generateTimeSlots = () => {
    const { duration, breakBetween, startTime, endTime } = mockInterviewData;
    const slots = [];
    let [h, m] = startTime.split(":").map(Number);
    const [endH, endM] = endTime.split(":").map(Number);

    const totalMinutes = (endH * 60 + endM);
    let currentMinutes = h * 60 + m;

    while (currentMinutes + duration <= totalMinutes) {
      const start = format(new Date().setHours(0, currentMinutes), "h:mm a");
      const end = format(new Date().setHours(0, currentMinutes + duration), "h:mm a");
      slots.push({ start, end });
      currentMinutes += duration + breakBetween;
    }

    setTimeSlots(slots);
  };

  const toggleSlotSelection = (slot) => {
    setSelectedSlot(slot);
  };

  return (
    <Flex direction="column" width="100%"className="h-[calc(100vh-6rem)] bg-gray-900">
      <Box height="15%" className="mt-8">
        <Heading size="5" mb="4">Select a Date & Time</Heading>
        <Flex height="1"direction="column" gap="1" className="mb-4">
          <Text size="4" weight="bold">{mockInterviewData.title}</Text>
          <Text className="mb-4">{mockInterviewData.description}</Text>
        </Flex>
      </Box>

      <Flex className="px-8 mx-auto" height="70%" width="100%"direction="row" gap="6">
        {/* Time Slots Column */}
        
        {selectedDate && (
          <ScrollArea scrollbars="vertical" style={{ height: "100%", width: "30%"}}>
            <Box width="" className="">
                {timeSlots.map((slot) => (
                <button
                    key={`${slot.start}-${slot.end}`}
                    onClick={() => setSelectedSlot(slot)}
                    className={`block w-full text-left px-4 py-2 mb-2 rounded ${
                    selectedSlot?.start === slot.start && selectedSlot?.end === slot.end
                        ? "bg-cyan-700 text-gray-300"
                        : "bg-gray-800 text-gray-300 hover:bg-gray-500"
                    }`}
                >
                    {slot.start} - {slot.end}
                </button>
                ))}
            </Box>
          </ScrollArea>
        )}


        {/* Calendar Column */}
        <Box width="70%" height="100%"className="bg-gray-900 rounded">
            <CalendarInterview
                selectMode="single"
                onDateSelect={(date) => {
                    console.log("Selected Date:", date); // ✅ should show in console
                    setSelectedDate(date);
                }}
            />

        </Box>
      </Flex>

        {/*Submit Button*/}
        
        <Flex justify="center" align="center" height="15%" className="px-8">
          {selectedDate && selectedSlot && (
              <Button size="3" variant="soft"
                  
                  onClick={() => {
                  alert(`Submitted: ${format(selectedDate, 'yyyy-MM-dd')} at ${selectedSlot.start}`);
                  console.log("Submitted:", {
                      date: selectedDate,
                      time: selectedSlot,
                  });
                  }}
              >
                  Submit Availability
              </Button>
          )}

        </Flex>
    </Flex>
  );
};

export default InterviewBookingPage;
