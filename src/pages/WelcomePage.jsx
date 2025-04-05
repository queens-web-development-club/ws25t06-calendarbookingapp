import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";

function WelcomePage() {
  const navigate = useNavigate();

  useEffect(() => {
    const user = auth.currentUser;

    // If no user, redirect to login
    if (!user) {
      navigate("/login");
    }
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-50">
      <div className="text-center p-8 bg-white shadow-md rounded-lg">
        <h1 className="text-3xl font-bold text-green-700 mb-4">Welcome! 🎉</h1>
        <p className="text-gray-700">
          You have successfully signed up or logged in.
        </p>
        <p className="mt-2 text-sm text-gray-500">Let’s get started!</p>
      </div>
    </div>
  );
}

export default WelcomePage;
