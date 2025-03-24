import { useState } from 'react';
import Calendar from "../components/Calendar.jsx";
import { Button, Flex} from "@radix-ui/themes";
import BookingCard from "../components/BookingCard.jsx";
import TimePicker from "../components/TimePicker.jsx";
import MeetingForm from "./MeetingForm.jsx";

function Meeting() {
  const [selectedDates, setSelectedDates] = useState([]); // State for selected dates
  const [step, setStep] = useState(0); // State for selected dates

  const handleCreateNew = () => {
    console.log("Selected Dates:", selectedDates.map(date => date.toDateString())); // Log readable dates
    setShowForm(true);
  };

  return (
    <div className="grid grid-cols-3 min-w-full h-screen">
      {/* Sidebar - 1 Column */}
      <div className="col-span-1 bg-gray-300 p-4">
        <BookingCard />
      </div>

      {/* Main Content - 2 Columns */}
      <div className="col-span-2 p-6 bg-gray-200">
        <div className="flex justify-between">
        
          {step > 0 && (
            <Button variant="soft" className="flex justify-left" onClick={() => setStep(step - 1)}>Back</Button>
          )}
          <div className="ml-auto">
            {step < 1 ? (
              <Button className="" variant="soft" onClick={() => setStep(step + 1)}>Next</Button>
            ) : (<Button variant="soft" onClick={() => setStep(step + 1)}>Create</Button>)}
          </div>
        </div>

        {step == 0 && (
          <Flex direction="column">
            <Calendar setSelectedDates={setSelectedDates} />
            <TimePicker />
          </Flex>
        )}
        {step == 1 && (
          <MeetingForm/>
        )}
        {step == 2 && (
          <h1>Form created!</h1>
        )}
        

      </div>
    </div>
  );
}

export default Meeting;
