import React, { useState } from "react";
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addMonths, subMonths, eachDayOfInterval } from "date-fns";

const Calendar = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  const days = eachDayOfInterval({
    start: startOfWeek(startOfMonth(currentMonth)),
    end: endOfWeek(endOfMonth(currentMonth)),
  });

  return (
    
      <div className="w-full row-span-1 mx-auto p-4 bg-white shadow-lg rounded-lg">
        <div className="flex justify-between items-center mb-4">
          <button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))} className="p-2 bg-gray-200 rounded">◀</button>
          <h2 className="text-lg font-bold">{format(currentMonth, "MMMM yyyy")}</h2>
          <button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} className="p-2 bg-gray-200 rounded">▶</button>
        </div>
        <div className="grid grid-cols-7 gap-1 text-center">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div key={day} className="font-bold text-gray-700">{day}</div>
          ))}
          {days.map((day) => (
            <button
              key={day}
              onClick={() => setSelectedDate(day)}
              className={`p-2 rounded-full ${format(day, "yyyy-MM-dd") === format(selectedDate, "yyyy-MM-dd") 
                ? "bg-blue-500" : "hover:bg-gray-200"}`}
            >
              {format(day, "d")}
            </button>
          ))}
        </div>
      </div>
      
   
  );
};

export default Calendar;