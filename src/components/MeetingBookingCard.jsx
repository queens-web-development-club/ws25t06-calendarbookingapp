import { useState } from 'react';
import { Flex, Text, Button, Card, Heading, Separator, Box, Link } from "@radix-ui/themes";

function BookingCard({ index, meetingData }) {
    const [copySuccess, setCopySuccess] = useState('');

    if (!meetingData) {
        return (
            <Card size="5">
                <Flex direction="column" gap="2">
                    <Heading className="mb-10">No meeting created yet.</Heading>
                    <Text>Select whatever days and times you want to create a meeting!</Text>
                </Flex>
            </Card>
        );
    }

    const { title, description, meetingType, selectedDates, duration, bookingLink } = meetingData;

    const handleCopyClick = () => {
        navigator.clipboard.writeText(bookingLink)
            .then(() => setCopySuccess('Link copied!'))
            .catch(() => setCopySuccess('Failed to copy link.'));
    };

    const handleShareClick = () => {
        // Check if the browser supports the share API
        if (navigator.share) {
            navigator.share({
                title: title,
                text: `Join the event: ${title}`,
                url: bookingLink,
            })
            .then(() => {
                console.log('Successfully shared');
            })
            .catch((error) => {
                console.error('Error sharing:', error);
                // Fallback to copy if sharing fails
                handleCopyClick();
            });
        } else {
            // Fallback for browsers that don't support the share API
            console.log("Share API not supported, falling back to copy.");
            handleCopyClick();
        }
    };

    return (
        <Card size="5">
            <Flex direction="column" gap="2">
                <Heading className="mb-4">{title}</Heading>
                <Text className="text-gray-700">{description}</Text>
                <Text className="text-sm"><strong>Type:</strong> {meetingType}</Text>
                <Text className="text-sm"><strong>Duration:</strong> {duration} minutes</Text>

                {Array.isArray(selectedDates) && selectedDates.length > 0 ? (
                    <ul className="list-disc ml-5 text-sm">
                        {selectedDates.map((date, i) => (
                            <li key={i}>{date}</li>
                        ))}
                    </ul>
                ) : (
                    <Text className="text-sm text-gray-500">No dates selected.</Text>
                )}

                <Separator my="3" size="4" />

                <Link href={bookingLink} className="text-sm" target="_blank">View Booking Page</Link>
                <Flex gap="3" direction="column" className="mt-4">

                
                <Button variant="soft" onClick={handleCopyClick} size="2" className="text-sm">
                    Copy Link
                </Button>
                <Button variant="soft" onClick={handleShareClick} size="2" className="text-sm">
                    Share Link
                </Button>
                </Flex>
                {copySuccess && <Text className="text-sm text-green-500 mt-2">{copySuccess}</Text>}
            </Flex>
        </Card>
    );
}

export default BookingCard;
