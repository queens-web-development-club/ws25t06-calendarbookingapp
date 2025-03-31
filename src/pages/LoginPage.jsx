// src/pages/LoginPage.jsx
import React from 'react';
import Login from '../components/Login';


const LoginPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Login />
    </div>
  );
};
import { Link } from "react-router-dom";

<p>Don’t have an account? <Link to="/signup">Sign up here</Link></p>

export default LoginPage;