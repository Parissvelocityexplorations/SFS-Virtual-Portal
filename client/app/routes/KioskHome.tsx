import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/theme.css';

export default function KioskHome() {
  const navigate = useNavigate();

  const handleStart = () => {
    navigate('/signin'); // or whatever your sign-in route is
  };

  return (
    <div className="flex flex-col justify-center items-center h-screen bg-surface text-center px-4">
      <h1 className="text-5xl font-bold mb-8 text-text-primary">Welcome to the Patrick, SFB</h1>
      <div className="card bg-white shadow-lg p-8 rounded-xl max-w-md w-full">
        <h2 className="text-3xl font-semibold mb-4">Getting Started</h2>
        <p className="mb-6 text-lg">Tap the button below to begin your sign-in process and receive a queue number.</p>
        <button
          onClick={handleStart}
          className="bg-blue-600 text-white text-xl px-6 py-4 rounded-lg hover:bg-blue-700 transition-all"
        >
          Start
        </button>
      </div>
    </div>
  );
}
