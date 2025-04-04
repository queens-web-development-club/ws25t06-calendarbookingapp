import React, { useState } from "react";
import { TextField, Heading, Flex, Box, Button, ScrollArea, RadioCards } from "@radix-ui/themes";
import { format, isValid } from "date-fns";

function GetUser( { setStep } ) {

    const handleConfirm = () => {
        console.log("It works!")
        setStep(2);
    }

  return (
    <Flex flexGrow="1" justify="center" width="100%" className="w-full h-full p-6 bg-white shadow-lg rounded-lg" 
    align="center" direction="column" gap="2">
        <Box width="50%">
            <TextField.Root size="3" className="min-w-128"placeholder="What's your name? " />
        </Box>
        <Box width="50%">
            <TextField.Root size="3" className="min-w-128"placeholder="What's your email? " />
        </Box>
        <Box width="50%">
            <button onClick={handleConfirm} className="p-4 h-full w-full rounded-[8px] bg-sky-300 text-white transition hover:bg-sky-400">
                Add Availability
            </button>
        </Box>
        
    </Flex>
  );
}

export default GetUser;
