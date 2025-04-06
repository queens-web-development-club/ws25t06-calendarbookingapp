import { useEffect, useState } from "react";
import { db, auth } from "../firebase";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { Flex, Text, Button, Card, Heading, Separator, Link } from "@radix-ui/themes";

const BookingSummary = ({ type }) => {
  const [bookings, setBookings] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Listen for changes in the authentication state
    const unsubscribeAuth = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
    });

    // Cleanup the auth listener
    return () => unsubscribeAuth();
  }, []);

  useEffect(() => {
    if (!user) return; // If no user is logged in, do not fetch bookings

    const q = query(
      collection(db, "bookings"),
      where("userId", "==", user.uid),
      where("type", "==", type)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const results = [];
      snapshot.forEach((doc) => {
        results.push({ id: doc.id, ...doc.data() });
      });
      setBookings(results);
    });

    // Cleanup the snapshot listener
    return () => unsubscribe();
  }, [type, user]); // Re-run the effect when the user or type changes

  return (
    <div className="p-4 bg-white rounded-md shadow-md w-full max-w-sm text-left">
      <h2 className="text-xl font-bold mb-4 capitalize">{type} bookings</h2>

      {/* Show login prompt if the user is not logged in */}
      {!user ? (
        <p className="text-gray-500">Login to view bookings</p>
      ) : bookings.length === 0 ? (
        <p className="text-gray-500">No bookings yet.</p>
      ) : (
        <div className="space-y-3">
          {bookings.map((booking) => (
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

                <Link className="text-sm" target="_blank">View Booking Page</Link>
                <Button size="2" className="text-sm">
                    Copy Link
                </Button>
                <Button size="2" className="text-sm">
                    Share Link
                </Button>
            </Flex>
        </Card>
          ))}
          </div>
        )}
      </div>

  );
};

export default BookingSummary;
