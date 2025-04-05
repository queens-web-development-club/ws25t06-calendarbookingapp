import { useState, useEffect } from "react";
import { auth, db } from "../firebase"; // Firebase configuration
import { useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";

function ProfilePage() {
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (!user) {
        // Redirect to login if no user is logged in
        navigate("/login");
        return;
      }

      // Fetch user data from Firestore
      const getUserInfo = async () => {
        try {
          const userRef = doc(db, "users", user.uid); // Get user data from Firestore
          const docSnap = await getDoc(userRef); // Fetch the document

          if (docSnap.exists()) {
            setUserInfo(docSnap.data()); // Set the user data if document exists
          } else {
            console.log("No such user!");
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        } finally {
          setLoading(false); // Stop loading after data is fetched
        }
      };

      getUserInfo();
    });

    // Cleanup the subscription when the component unmounts
    return () => unsubscribe();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center mb-4">Your Profile</h2>

        {userInfo && (
          <div>
            <div className="mb-4">
              <label className="font-semibold">Name:</label>
              <p>{userInfo.firstName}</p>
            </div>

            <div className="mb-4">
              <label className="font-semibold">Email:</label>
              <p>{userInfo.email}</p>
            </div>

            <div className="mb-4">
              <label className="font-semibold">Password:</label>
              <p>********</p> {/* Masked password */}
            </div>
          </div>
        )}

        <div className="text-center mt-6">
          <button
            onClick={() => auth.signOut()}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Log Out
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
