import React, { useState } from "react";
 import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addMonths, subMonths, eachDayOfInterval, isSameDay } from "date-fns";
 import { Box, Flex, Grid, Button} from "@radix-ui/themes";
 
 
 const Calendar = ({ selectedDates, setSelectedDates }) => { // Accept setSelectedDates as prop
   const [currentMonth, setCurrentMonth] = useState(new Date());
   const [localSelectedDates, setLocalSelectedDates] = useState([]); // Local state
   const [selectedPopupDate, setSelectedPopupDate] = useState(null);
 
   const days = eachDayOfInterval({
     start: startOfWeek(startOfMonth(currentMonth)),
     end: endOfWeek(endOfMonth(currentMonth)),
   });
 
   const toggleDate = (date) => {
      setSelectedDates((prevSelected) => {
        const selectedEntry = prevSelected.find(([d]) => isSameDay(d, date));
        const hasTimeInterval = selectedEntry && selectedEntry[1];
    
        if (hasTimeInterval) {
          setSelectedPopupDate(selectedEntry); // Open modal for that date
          return prevSelected; // Keep selection unchanged
        }

        // Ensures popup does not open if new date is selected
        setSelectedPopupDate(null);
    
        // Modify only untagged dates
        const isAlreadySelected = prevSelected.some(([d, interval]) => isSameDay(d, date) && !interval);
        const updatedDates = isAlreadySelected
          ? prevSelected.filter(([d, interval]) => !(isSameDay(d, date) && !interval)) // Remove untagged selection
          : [...prevSelected, [date, null]]; // Add new date with no interval
    
        return updatedDates;
      });
    };
 
   return (
     <div className="w-full h-full mx-auto p-4 bg-white shadow-lg rounded-lg flex flex-col">
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
            const selectedEntry = Array.isArray(selectedDates)
              ? selectedDates.find((d) => Array.isArray(d) && isSameDay(d[0],date))
              : null;           const isSelected = !!selectedEntry;
           const hasTimeInterval = isSelected && selectedEntry[1];
 
           return (
             <button
               key={day}
               onClick={() => toggleDate(day)}
               className={`p-4 h-full w-full rounded-[8px] border-[1px] transition bg-[#f9f9f9] 
                 ${hasTimeInterval ? "bg-sky-300 text-white" : 
                 isSelected ? "border-[#1E88E5] border-2 text-[#1E88E5]" 
                 : "hover:bg-gray-200 border-transparent"}`}
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