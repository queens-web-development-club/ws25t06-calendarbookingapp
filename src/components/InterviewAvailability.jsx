import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { Box, Heading, Text, Button, Flex } from "@radix-ui/themes";
import { format } from "date-fns";
import Calendar from "../components/Calendar.jsx"

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
    <Box className="relative max-w-7xl mx-auto p-6 pb-24 bg-white mt-10 shadow-lg rounded-lg">
      <Heading size="5" mb="4">Select a Date & Time</Heading>

      <Flex direction="column" gap="1" className="mb-4">
        <Text size="4" weight="bold">{mockInterviewData.title}</Text>
        <Text className="mb-4">{mockInterviewData.description}</Text>
      </Flex>

      <Flex className="max-w-7xl mx-auto mt-10" direction="row" gap="6">
        {/* Time Slots Column */}
        
        {selectedDate && (
            <Box width="30%" className="bg-blue-50 p-4 rounded shadow">
                {timeSlots.map((slot) => (
                <button
                    key={`${slot.start}-${slot.end}`}
                    onClick={() => setSelectedSlot(slot)}
                    className={`block w-full text-left px-4 py-2 mb-2 rounded ${
                    selectedSlot?.start === slot.start && selectedSlot?.end === slot.end
                        ? "bg-green-500 text-white"
                        : "bg-blue-500 text-white hover:bg-blue-600"
                    }`}
                >
                    {slot.start} - {slot.end}
                </button>
                ))}
            </Box>
        )}


        {/* Calendar Column */}
        <Box width="70%" className="bg-white p-4 rounded shadow">
            <Calendar
                selectMode="single"
                onDateSelect={(date) => {
                    console.log("Selected Date:", date); // ✅ should show in console
                    setSelectedDate(date);
                }}
            />

        </Box>
        </Flex>

        {/*Submit Button*/}
        
        <div className="absolute bottom-6 right-6">
        {selectedDate && selectedSlot && (
            <Button
                className="fixed bottom-6 right-6 z-50"
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

        </div>



    </Box>
  );
};

export default InterviewBookingPage;
