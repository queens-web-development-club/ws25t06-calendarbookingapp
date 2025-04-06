import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Heading, Flex, Button, Box, TextArea, Select, TextField } from "@radix-ui/themes";
import { format } from "date-fns";
import DayCell from './daycell';
import '../App.css';

// ✅ Firebase setup
import { db, auth } from "../firebase";
import { collection, addDoc } from "firebase/firestore";

const CreateMeetingForm = ({ selectedDates, formRef, setMeetingData, setShowSummary, onFormChange }) => {
  const { date } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [meetingType, setMeetingType] = useState("");
  const [duration, setDuration] = useState("");

  const timeOptions = Array.from({ length: 48 }, (_, i) => {
    const hours = Math.floor(i / 2);
    const minutes = i % 2 === 0 ? "00" : "30";
    return format(new Date().setHours(hours, minutes), "h:mm a");
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const user = auth.currentUser;
    if (!user) {
      alert("You must be signed in to create a meeting.");
      return;
    }

    const formattedDates = selectedDates.map(
      (date) => format(new Date(date[0]), "yyyy-MM-dd") + ": " + date[1]
    );

    const meetingData = {
      userId: user.uid,
      title,
      description,
      meetingType,
      selectedDates: formattedDates,
      duration,
      type: "team",
      createdAt: new Date(),
    };

    try {
      await addDoc(collection(db, "bookings"), meetingData);
      setMeetingData(meetingData);
      setShowSummary(true);
      console.log("✅ Meeting booking saved!");
    } catch (error) {
      console.error("Error saving meeting to Firebase:", error);
    }
  };

  useEffect(() => {
    const complete =
      title.trim() !== "" &&
      description.trim() !== "" &&
      meetingType !== "" &&
      duration !== "";
    onFormChange?.(complete);
  }, [title, description, meetingType, duration]);

  return (
    <Flex direction="column" minWidth="100%" height="100%" className="max-w-2xl pl-12 bg-white shadow-md rounded-lg ">
      <Heading size="5" mb="4">
        Create Meeting
      </Heading>

      <form ref={formRef} onSubmit={handleSubmit} className="space-y-4 text-left">
        <Flex gap="5" width="100%">
          <Box width="70%">
            <label className="font-medium min-w-[100px] text-left">Meeting Title:</label>
            <TextField.Root
              placeholder="Enter a title for your meeting"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="flex-1"
            />
          </Box>
          <Box width="30%" className="flex items-center gap-4">
            <label className="w-[130px] font-medium">Duration:<br /></label>
            <Select.Root value={duration} onValueChange={setDuration}>
              <Select.Trigger placeholder="Select duration" />
              <Select.Content>
                <Select.Item value="30">30 minutes</Select.Item>
                <Select.Item value="60">1 hour</Select.Item>
                <Select.Item value="90">1 hour 30 minutes</Select.Item>
                <Select.Item value="120">2 hours</Select.Item>
              </Select.Content>
            </Select.Root>
          </Box>
        </Flex>

        <Flex gap="4" width="100%">
          <Box width="70%">
            <TextArea
              placeholder="What's your meeting about?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              size="3"
            />
          </Box>
          <Box width="30%" className="flex items-center gap-4">
            <label className="w-[130px] font-medium">Meeting Type:</label><br />
            <Select.Root value={meetingType} onValueChange={setMeetingType}>
              <Select.Trigger placeholder="Choose meeting type" />
              <Select.Content>
                <Select.Item value="group">Group</Select.Item>
                <Select.Item value="one-on-one">One on One</Select.Item>
              </Select.Content>
            </Select.Root>
          </Box>
        </Flex>
      </form>
    </Flex>
  );
};

export default CreateMeetingForm;
