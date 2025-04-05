import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase'; // adjust path if needed
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [error, setError] = useState('');  // State for error message
  const [loading, setLoading] = useState(false); // Loading state
  const navigate = useNavigate(); 

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');  // Reset error before submitting
    setLoading(true);  // Start loading

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      console.log('Logged in user:', user);

      setSuccessMessage(`🎉 Welcome back, ${user.displayName || "friend"}!`);

      // Redirect immediately after successful login
      navigate('/welcome');  // No delay anymore
    } catch (error) {
      console.error('Login failed:', error.message);
      setError('Incorrect email or password. Please try again.');
    }

    setLoading(false);  // Stop loading after process
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-sm mx-auto mt-10 p-4 border rounded-lg shadow bg-white">
      <h2 className="text-2xl font-bold mb-4">Login</h2>

      {/* ✅ Success message */}
      {successMessage && (
        <p className="text-green-600 text-sm mb-4 text-center">{successMessage}</p>
      )}

      {/* ❌ Error message */}
      {error && (
        <p className="text-red-600 text-sm mb-4 text-center">{error}</p>
      )}

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
        className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        disabled={loading} // Disable while loading
      >
        {loading ? "Signing In..." : "Log In"}
      </button>

      <p className="mt-4 text-sm text-center">
        Don’t have an account?{' '}
        <Link to="/signup" className="text-blue-600 underline hover:text-blue-800">
          Sign up here
        </Link>
      </p>
    </form>
  );
};

export default Login;
