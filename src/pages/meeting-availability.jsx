import { useState, useRef, useEffect } from 'react';
import Calendar from "../components/Calendar.jsx";
import { Button, Flex, Box, Heading, Separator } from "@radix-ui/themes";
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


  const handleStart = () => {
    setStep(1)
  }

  const addTimeInterval = (timeInterval) => {
    setTimeInterval(timeInterval);
    setStep(2);
  };
  
  const addRespondent = (userData) => {
    setRespondents((prev) => ({
      ...prev,
      [userData.email]: {
        ...userData,
        timeInterval, // store their selected time
      },
    }));
    setTimeInterval(null); // reset after submission
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
                    <Daycell respondents={respondents} selectedTime={timeInterval}/>
                </Box>
                { step > 0 && (
                    <Box height="30%" className="flex items-center justify-center" >
                    { step == 1 && (
                        <TimePicker addTimeInterval={addTimeInterval} />
                    )
                    }
                    { step == 2 && (
                        <GetUser setStep={setStep} addRespondent={addRespondent}/>
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
