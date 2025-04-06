import { useState, useRef, useEffect } from 'react';
import Calendar from "../components/Calendar.jsx";
import { Button, Flex, Box, Heading, Separator, Text } from "@radix-ui/themes";
import BookingCard from "../components/MeetingBookingCard.jsx";
import TimePicker from "../components/TimePicker.jsx";
import MeetingForm from "../components/MeetingForm.jsx";
import MeetingSummary from "../components/MeetingSummary.jsx";
import Daycell from "../components/daycell.jsx";
import GetUser from "../components/getUser.jsx";

function Meeting() {
  const [timeInterval, setTimeInterval] = useState(null);
  const [step, setStep] = useState(0);
  const [respondents, setRespondents] = useState({})
  const [availability, setAvailability] = useState(null); // includes date + time
  const [day, setDay] = useState(0)


  const times = [
    ["Sun Apr 06 2025", ["9:30 AM","10:00 AM", "11:00 AM", "12:00 PM", "1:00 PM", "2:00 PM", "3:00 PM", "4:40 PM"]],
    ["Wed Apr 16 2025" , ["9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM"]],
    ["Thu Apr 24 2025", ["7:00 AM", "8:00 AM", "9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM"]]
  ]

  const handleStart = () => {
    setStep(1)
  }

  const addTimeInterval = (timeInterval) => {
    const currentDate = times[day][0]; // You'll need to pass this from DayCell back up
    setAvailability({ date: currentDate, timeInterval });
    setStep(2);
  };
  
  const addRespondent = (userData) => {
    setRespondents((prev) => ({
      ...prev,
      [userData.email]: {
        ...userData,
        availability,
      },
    }));
    setAvailability(null); // reset after submission
  };
  

  

  return (
    <Flex className="h-[calc(100vh-6rem)] max-w-full mx-auto bg-gray-900 p-8" direction="column">
        <Flex direction="row" width="100%" height="100%">
            <Box width="20%" height="100%" className=" p-4">
                <Flex direction="column">
                    <Heading className=''>Respondents</Heading>
                    <Separator my="3" size="4"/>
                    {Object.values(respondents).map((r, idx) => (
                        <Box key={idx} className="mb-2 text-xl text-gray-700">
                            {r.name}
                        </Box>
                        ))}
                    <Button disabled={step > 0} variant="soft" size="4" onClick={handleStart}>Add Availability</Button>
                </Flex>
 
            </Box>
            <Flex width="80%"height="100%" direction="column">
                <Box width="80%" height={step == 0 ? `90%` : `70%`} className="ml-auto mr-auto flex justify-center" >
                    <Daycell respondents={respondents} selectedTime={timeInterval}
                     day={day} setDay={setDay}/>
                </Box>
                { step > 0 && (
                    <Box height="30%" className="flex items-center justify-center" >
                    { step == 1 && (
                        <TimePicker addTimeInterval={addTimeInterval} />
                    )
                    }

                    { step == 2 && (
                        <GetUser setStep={setStep} step={step} addRespondent={addRespondent}/>
                    )
                    }
                    </Box>
                )
                }    
            </Flex>
        </Flex>

    </Flex>
  );
}

export default Meeting;
