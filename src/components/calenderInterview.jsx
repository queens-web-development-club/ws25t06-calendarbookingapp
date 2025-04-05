import React, { useState } from "react";
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addMonths, subMonths, eachDayOfInterval, isSameDay } from "date-fns";
import { Box, Flex, Grid, Button} from "@radix-ui/themes";


const Calendar = ({ selectMode, setSelectedDates, onDateSelect }) => { // Accept setSelectedDates as prop
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [localSelectedDates, setLocalSelectedDates] = useState([]); // Local state
  const [selectedDate, setSelectedDate] = useState(null)
  const [selectedPopupDate, setSelectedPopupDate] = useState(null);

  const days = eachDayOfInterval({
    start: startOfWeek(startOfMonth(currentMonth)),
    end: endOfWeek(endOfMonth(currentMonth)),
  });

  const handleClick = (date) => {
    if (selectMode === "single") {
      setSelectedDate(date);         // ✅ sets local highlight
      onDateSelect && onDateSelect(date); // ✅ sends to parent
    } else {
      setLocalSelectedDates((prevSelected) => {
        const isAlreadySelected = prevSelected.some((d) => isSameDay(d, date));
        const updatedDates = isAlreadySelected
          ? prevSelected.filter((d) => !isSameDay(d, date))
          : [...prevSelected, date];
  
        setSelectedDates(updatedDates);
        return updatedDates;
      });
    }
  };
  

  return (
    <div className="w-full h-full mx-auto p-4 bg-white rounded-lg flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))} className="p-2 bg-gray-200 rounded">◀</button>
        <h2 className="text-lg font-bold">{format(currentMonth, "MMMM yyyy")}</h2>
        <button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} className="p-2 bg-gray-200 rounded">▶</button>
      </div>

      <div className="flex-1 grid grid-cols-7 gap-1 text-center">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div key={day} className="font-bold text-gray-700">{day}</div>
        ))}
        
        {days.map((day) => {
          const isSelected = selectMode === "single"
          ? selectedDate && isSameDay(selectedDate, day)
          : localSelectedDates.some((d) => isSameDay(d, day));
        

          return (
            <button
              key={day.toISOString()}
              onClick={() => handleClick(day)}
              className={`p-4 h-full w-full rounded-[8px] border-[1px] transition bg-[#f9f9f9] ${
                isSelected ? "border-[#1E88E5] border-2 text-[#1E88E5] " : "hover:bg-gray-200 border-transparent"
              }`}
            >
              {format(day, "d")}
            </button>
          );
        })}
      </div>

      {/* Popup Modal */}
      {selectedPopupDate && (
        <div className="absolute inset fixed top-0 left-0 w-full h-full flex items-center justify-center">
          <Flex direction="column" gap="4" justify="center" className="bg-white p-6 rounded-lg shadow-xl text-center">
            <h2 className="text-xl font-bold mb-2">
              Time Interval for {format(selectedPopupDate[0], "MMMM d, yyyy")}
            </h2>
            
            <Flex justify={"center"} gap={"4"}>
              <p className="text-gray-700 text-[1vw]">{selectedPopupDate[1]}</p>
              <Button size="1" color="crimson" variant="soft">Delete</Button>
            </Flex>
              <Button
                onClick={() => setSelectedPopupDate(null)} 
                className="mt-4 px-4 py-2 w-1/2 bg-blue-500 text-white rounded"
              >
                Close
              </Button>
            

          </Flex>
        </div>
      )}  

    </div>

    
  );
};

export default Calendar;