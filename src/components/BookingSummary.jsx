import { useEffect, useState } from "react";
import { db, auth } from "../firebase";
import { collection, query, where, onSnapshot } from "firebase/firestore";

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
            <div key={booking.id} className="border border-gray-200 rounded p-3">
              <p className="font-semibold text-black">{booking.title}</p>
              <p className="text-sm text-gray-600">{booking.description}</p>
              <p className="text-xs text-gray-500 mt-1">{booking.selectedDates?.join(", ")}</p>
              <p className="text-xs text-gray-500">Duration: {booking.duration} min</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BookingSummary;
