import { useState, useEffect } from "react";
import { Box, Heading, Text, Flex, Separator, Button, AlertDialog } from "@radix-ui/themes";
import { auth } from "../firebase"; // Import Firebase auth

const MeetingSummary = ({ meetingData, onClose }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribeAuth = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribeAuth();
  }, []);

  const { title, description, meetingType, selectedDates, duration } = meetingData || {};
  const fakeId = Math.random().toString(36).substring(2, 8);
  const shareLink = `${window.location.origin}/meeting/${fakeId}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareLink);
    alert("Link copied to clipboard!");
  };

  const handleDelete = () => {
    window.location.href = "/meeting";
  };

  // If no meeting data is passed
  if (!meetingData) {
    return (
      <Box className="max-w-2xl mx-auto p-6 mt-8">
        <Heading className="text-gray-300"size="5">No Meeting Data</Heading>
        <Text className="text-gray-300">Please go back and create a meeting first.</Text>
      </Box>
    );
  }

  // If user is not logged in, show login prompt
  if (!user) {
    return (
      <Box className="p-6 bg-transparent border border-[1px] border-gray-300 shadow-md rounded-lg mt-8">
        <Heading size="5" className="text-center text-gray-300">Meeting Summary</Heading>
        <Separator my="3" size="4" />
        <Text className="text-gray-500 text-center">Login to view meeting details</Text>
      </Box>
    );
  }

  return (
    <Box minWidth="50%" className="mx-auto p-6 bg-gray-800 shadow-md rounded-lg mt-8 space-y-4">
      <Heading size="5" className="text-center text-gray-300">Meeting Summary</Heading>
      <Separator my="3" size="4" />

      <div className="space-y-2">
        <Flex gap="2">
          <Text className="font-semibold text-gray-300">Title:</Text>
          <Text>{title}</Text>
        </Flex>

        <Flex gap="2">
          <Text className="font-semibold text-gray-300">Description:</Text>
          <Text>{description}</Text>
        </Flex>

        <Flex gap="2">
          <Text className="font-semibold text-gray-300">Meeting Type:</Text>
          <Text>{meetingType}</Text>
        </Flex>

        <Box>
          <p align="left" className="font-semibold">Selected Date(s):</p>
          <ul className="flex flex-justify-left mt-1">
            {selectedDates.map((date, idx) => (
              <li key={idx} className="text-gray-300">{date}</li>
            ))}
          </ul>
        </Box>

        <Flex gap="2">
          <Text className="font-semibold">Duration:</Text>
          <Text>{duration} Minutes</Text>
        </Flex>
      </div>

      <Separator my="3" size="4" />

      <Flex justify="between" align="center" className="mt-6">
        <Text className="text-sm text-gray-500">{shareLink}</Text>
        <Button onClick={handleCopy}>Copy Share Link</Button>
      </Flex>

      <Flex justify="between">
        <AlertDialog.Root>
          <AlertDialog.Trigger>
            <Button color="red" variant="soft" >Delete Meeting</Button>
          </AlertDialog.Trigger>
          <AlertDialog.Content maxWidth="450px">
            <AlertDialog.Title>Delete Meeting</AlertDialog.Title>
            <AlertDialog.Description size="2">
              Are you sure? This meeting and all associated data will be lost.
            </AlertDialog.Description>

            <Flex gap="3" mt="4" justify="end">
              <AlertDialog.Cancel>
                <Button variant="soft" color="gray">
                  Cancel
                </Button>
              </AlertDialog.Cancel>
              <AlertDialog.Action>
                <Button onClick={handleDelete} variant="solid" color="red">
                  Delete Meeting
                </Button>
              </AlertDialog.Action>
            </Flex>
          </AlertDialog.Content>
        </AlertDialog.Root>

        <Button onClick={onClose} color="gray" variant="soft">Close</Button>
      </Flex>
    </Box>
  );
};

export default MeetingSummary;
