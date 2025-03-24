import { useState } from 'react';
import Calendar from "../components/Calendar.jsx";
import { Button } from "@radix-ui/themes";
import BookingCard from "../components/BookingCard.jsx";
import TimePicker from "../components/TimePicker.jsx";

function Meeting() {
  const [selectedDates, setSelectedDates] = useState([]); // State for selected dates

  const handleCreateNew = () => {
    console.log("Selected Dates:", selectedDates.map(date => date.toDateString())); // Log readable dates
  };

  return (
    <div className="grid grid-cols-3 min-w-full h-screen">
      {/* Sidebar - 1 Column */}
      <div className="col-span-1 bg-gray-300 p-4">
        <BookingCard />
      </div>

      {/* Main Content - 2 Columns */}
      <div className="col-span-2 p-6 bg-gray-200">
        <div className="flex justify-end">
          <Button variant="soft" onClick={handleCreateNew} disabled={selectedDates.length === 0}>
            Create New
          </Button>
        </div>
        <Calendar setSelectedDates={setSelectedDates} /> {/* Pass state setter to Calendar */}
        <TimePicker />
      </div>
    </div>
  );
}

export default Meeting;
