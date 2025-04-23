import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/theme.css';

const SignIn: React.FC = () => {
  const navigate = useNavigate();

  const handleSignIn = () => {
    // add actual sign-in logic here
    navigate('/queue'); // route to the queue number page
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-surface px-4 text-center">
      <h1 className="text-4xl font-bold mb-6">Sign In</h1>
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-sm w-full">
        <input
          type="text"
          placeholder="First Name"
          className="w-full px-4 py-2 mb-4 border border-gray-300 rounded"
        />
        <input
          type="text"
          placeholder="Last Name"
          className="w-full px-4 py-2 mb-4 border border-gray-300 rounded"
        />
        <input
          type="text"
          placeholder="Phone Number"
          className="w-full px-4 py-2 mb-4 border border-gray-300 rounded"
        />
        <input
          type="text"
          placeholder="Email Address"
          className="w-full px-4 py-2 mb-4 border border-gray-300 rounded"
        />
        <input
          type="text"
          placeholder="Sponsor Name"
          className="w-full px-4 py-2 mb-4 border border-gray-300 rounded"
        />
        <button
          onClick={handleSignIn}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-all"
        >
          Get Queue Number
        </button>
      </div>
    </div>
  );
};

export default SignIn;
