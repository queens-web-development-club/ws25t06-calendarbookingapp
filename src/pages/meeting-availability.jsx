import { useState, useRef, useEffect } from 'react';
import Calendar from "../components/Calendar.jsx";
import { Button, Flex, Box, Heading, Separator } from "@radix-ui/themes";
import BookingCard from "../components/BookingCard.jsx";
import TimePicker from "../components/TimePicker.jsx";
import MeetingForm from "../components/MeetingForm.jsx";
import MeetingSummary from "../components/MeetingSummary.jsx";
import Daycell from "../components/daycell.jsx";
import GetUser from "../components/getUser.jsx";

function Meeting() {
  const [timeInterval, setTimeInterval] = useState(null);
  const [step, setStep] = useState(0);


  const handleStart = () => {
    setStep(1)
  }

  const addTimeInterval = (timeInterval) => {
    setTimeInterval(timeInterval);
    setStep(2);
  };
  

  return (
    <Flex className="max-w-full mx-auto h-[calc(100vh-5rem)] bg-white" direction="column">
        <Flex direction="row" width="100%" height="100%">
            <Box width="20%" height="100%" className=" p-4">
                <Flex direction="column">
                    <Heading className=''>Respondents</Heading>
                    <Separator my="3" size="4"/>
                    <Button disabled={step > 0} variant="soft" size="4" onClick={handleStart}>Add Availability</Button>
                </Flex>
 
            </Box>
            <Flex width="80%"height="100%" direction="column">
                <Box width="80%" height={step == 0 ? `90%` : `70%`} className="ml-auto mr-auto flex justify-center" >
                    <Daycell selectedTime={timeInterval}/>
                </Box>
                { step > 0 && (
                    <Box height="30%" className="flex items-center justify-center" >
                    { step == 1 && (
                        <TimePicker addTimeInterval={addTimeInterval} />
                    )
                    }
                    { step == 2 && (
                        <GetUser setStep={setStep}/>
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
