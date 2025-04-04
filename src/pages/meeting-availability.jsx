import { useState, useRef, useEffect } from 'react';
import Calendar from "../components/Calendar.jsx";
import { Button, Flex, Box, Heading } from "@radix-ui/themes";
import BookingCard from "../components/BookingCard.jsx";
import TimePicker from "../components/TimePicker.jsx";
import MeetingForm from "../components/MeetingForm.jsx";
import MeetingSummary from "../components/MeetingSummary.jsx";
import Daycell from "../components/daycell.jsx";
import GetUser from "../components/getUser.jsx";

function Meeting() {
  const [timeInterval, setTimeInterval] = useState(null);
  const [step, setStep] = useState(0);

  const addTimeInterval = (timeInterval) => {
    setTimeInterval(timeInterval);
    setStep(1);
  };
  

  return (
    <Flex className="max-w-full mx-auto h-[calc(100vh-5rem)] bg-white" direction="column">
        
        {
            step < 2 && (
                <Box height="100%">
                    <Box maxWidth="80%" height="70%" className="ml-auto mr-auto flex justify-center" >
                        <Daycell selectedTime={timeInterval}/>
                    </Box>
                    <Box height="30%" className="flex items-center justify-center" >
                        {
                            step == 0 && (
                                <TimePicker addTimeInterval={addTimeInterval} />
                            )
                        }
                        {
                            step == 1 && (
                                <GetUser setStep={setStep}/>
                            )
                        }
                        
                    </Box>
                </Box>
            )
        }
        { step == 2 && (
            <Box>
                <p className='text-sky-400 text-[10vw]'>Everything is done!</p>
                <p className='text-sky-400 text-[10vw]'>Good job!</p>
            </Box>
        )
            
        }
        
    </Flex>
  );
}

export default Meeting;
