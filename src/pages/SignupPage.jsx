import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { Button, Flex, Box, Separator} from "@radix-ui/themes";
import { doc, setDoc, Timestamp } from "firebase/firestore";
import { auth, db } from "../firebase";

function SignupPage() {
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");  // State for error message
  const [loading, setLoading] = useState(false);  
  const navigate = useNavigate();


  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");  
    setLoading(true);
  
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
  
      await updateProfile(user, { displayName: firstName });
  
      console.log("Yes this code is running!")

      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
      
        await updateProfile(user, { displayName: firstName });
      
        console.log("Yes this code is running!");
      
        await Promise.race([
          setDoc(doc(db, "users", user.uid), {
            uid: user.uid,
            email: user.email,
            firstName: firstName,
            createdAt: Timestamp.now(),
          }),
          timeout(5000),
        ]);
      
        console.log("HELLO");
      
        setTimeout(() => navigate("/welcome"), 100);
      } catch (error) {
        console.error("Signup failed:", error.message);
        // ... existing error handling
      }
      
      console.log("HELLO")

  
      setTimeout(() => navigate("/welcome"), 100);

  
    } catch (error) {
      console.error("Signup failed:", error.message);
      if (error.code === "auth/email-already-in-use") {
        setError("This email is already registered. Please use a different email.");
      } else if (error.code === "auth/weak-password") {
        setError("The password is too weak. Please use a stronger password.");
      } else {
        setError("Signup failed: " + error.message);
      }
      setLoading(false); 
    }
    setLoading(false)
  };
  

  return (
    <Flex className="h-[calc(100vh-6rem)] w-full flex flex-col items-center justify-center bg-gray-900">
      <form onSubmit={handleSubmit} className="max-w-sm my-auto w-full p-4 rounded-lg shadow bg-gray-800">
        <h2 className="text-2xl font-bold mb-4 text-center">Sign Up</h2>

        
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
    </Flex>
  );
}

export default SignupPage;
