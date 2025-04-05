import { useEffect, useState } from "react";
import { db, auth } from "../firebase";
import { collection, query, where, onSnapshot } from "firebase/firestore";

const BookingSummary = ({ type }) => {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

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

    return () => unsubscribe();
  }, [type]);

  return (
    <div className="p-4 bg-white rounded-md shadow-md w-full max-w-sm text-left">
      <h2 className="text-xl font-bold mb-4 capitalize">{type} bookings</h2>

      {bookings.length === 0 ? (
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
