import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebase";

function SignupPage() {
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);  // Add loading state
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage("");  // Reset success message before submission
    setLoading(true);  // Start loading

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Update Firebase Auth profile with first name
      await updateProfile(user, { displayName: firstName });

      // Optionally, store additional user info in Firestore
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        email: user.email,
        firstName: firstName,
        createdAt: new Date(),
      });

      setSuccessMessage(`🎉 Welcome, ${firstName}! Your account was created successfully.`);

      console.log("Success: Message set and ready for redirect");

      // Delay redirect to allow user to see the success message
      setTimeout(() => {
        setLoading(false);  // Stop loading after redirect delay
        console.log("Redirecting to /welcome");
        navigate("/welcome"); // Redirect to welcome page
      }, 2000);

    } catch (error) {
      console.error("Signup failed:", error.message);
      alert("Signup failed: " + error.message);
      setLoading(false);  // Stop loading on error
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <form onSubmit={handleSubmit} className="max-w-sm w-full p-4 border rounded-lg shadow bg-white">
        <h2 className="text-2xl font-bold mb-4 text-center">Sign Up</h2>

        {/* Display success message if available */}
        {successMessage && (
          <p className="text-green-600 text-sm text-center mb-4">{successMessage}</p>
        )}

        <input
          type="text"
          placeholder="First Name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          className="w-full mb-2 p-2 border rounded"
          required
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full mb-2 p-2 border rounded"
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full mb-4 p-2 border rounded"
          required
        />

        <button
          type="submit"
          className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600"
          disabled={loading}  // Disable the button while loading
        >
          {loading ? "Creating Account..." : "Sign Up"}
        </button>

        <p className="mt-4 text-sm text-center">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600 underline hover:text-blue-800">
            Log in here
          </Link>
        </p>
      </form>
    </div>
  );
}

export default SignupPage;
