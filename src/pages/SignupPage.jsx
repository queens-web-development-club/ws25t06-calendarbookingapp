import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebase";

function SignupPage() {
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [error, setError] = useState("");  // State for error message
  const [loading, setLoading] = useState(false);  
  const navigate = useNavigate();

  useEffect(() => {
    if (successMessage) {
      // Stop loading once the success message is set
      setLoading(false);
      navigate("/welcome"); // Redirect to the welcome page immediately
    }
  }, [successMessage, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");  // Reset error state before submission
    setSuccessMessage("");  
    setLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await updateProfile(user, { displayName: firstName });

      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        email: user.email,
        firstName: firstName,
        createdAt: new Date(),
      });

      // Set success message
      setSuccessMessage(`🎉 Welcome, ${firstName}! Your account was created successfully.`); 

    } catch (error) {
      console.error("Signup failed:", error.message);
      if (error.code === "auth/email-already-in-use") {
        setError("This email is already registered. Please use a different email.");
      } else if (error.code === "auth/weak-password") {
        setError("The password is too weak. Please use a stronger password.");
      } else {
        setError("Signup failed: " + error.message);
      }
      setLoading(false);  // Stop loading after error
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <form onSubmit={handleSubmit} className="max-w-sm w-full p-4 border rounded-lg shadow bg-white">
        <h2 className="text-2xl font-bold mb-4 text-center">Sign Up</h2>

        {/* ✅ Success message */}
        {successMessage && (
          <p className="text-green-600 text-sm mb-4 text-center">{successMessage}</p>
        )}

        {/* ❌ Error message */}
        {error && (
          <p className="text-red-600 text-sm mb-4 text-center">{error}</p>
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
          disabled={loading}
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
