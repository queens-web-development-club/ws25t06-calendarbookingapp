import { useState } from 'react'
import reactLogo from '../assets/react.svg'
import viteLogo from '/vite.svg'
import '../App.css'
import Calendar from "../components/Calendar.jsx";
import Interview from "../pages/interview.jsx";
import { Flex, Text, Button, Card, Heading, Separator, Link } from "@radix-ui/themes";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function BookingCard() {
    const [count, setCount] = useState(0)
  
    return (
        <Card size="5" className="">
            <Flex direction={"column"} gap="2">
                <Heading className="mb-10">Booking #1</Heading>
                <Text className="mb-2 text-gray-700">30 Min Meeting At Loco</Text>
                    <Link className="" href="#">
                        View Booking Page
                    </Link>



                
                
                <Separator my="3" size="4" />
                <Link href="#">Copy Link</Link>
            </Flex>
        </Card>
    )
  }
  
  export default BookingCard