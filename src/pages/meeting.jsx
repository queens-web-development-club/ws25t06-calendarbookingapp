import { useState } from 'react'
import reactLogo from '../assets/react.svg'
import viteLogo from '/vite.svg'
import '../App.css'
import Calendar from "../components/Calendar.jsx";
import { Text, Button } from "@radix-ui/themes";

function Meeting() {
  const [count, setCount] = useState(0)

  return (
    <div className="grid grid-cols-3 min-w-full h-screen">
       {/* Sidebar - 1 Column */}
       <div className="col-span-1 bg-gray-300 p-4">Previous Bookings</div>
   
       {/* Main Content - 2 Columns */}
       <div className="col-span-2 p-6 bg-gray-200" >
          <div className="flex justify-end">
            <Button variant='soft'>Create New</Button>
          </div>
          
          <Calendar />
       </div>
    </div>

  )
}

export default Meeting