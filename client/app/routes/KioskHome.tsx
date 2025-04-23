import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/theme.css';

export default function kioskHome() {
  const navigate = useNavigate();

  const handleStart = () => {
    navigate('/signin'); // or your actual sign-in route
  };

  const handleQRScan = () => {
    navigate('/kiosk/scanner'); // this route should lead to your QR scan logic
  };

  return (
    <div className="flex flex-col justify-center items-center h-screen bg-surface text-center px-4">
      <h1 className="text-5xl font-bold mb-12 text-text-primary">
        Welcome to Patrick SFB
      </h1>

      {/* Two Options Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 w-full max-w-5xl">
        {/* New Visitor Sign-In */}
        <div className="card bg-white shadow-lg p-8 rounded-xl flex flex-col items-center">
          <h2 className="text-3xl font-semibold mb-4">New Visitor</h2>
          <p className="mb-6 text-lg">
            Tap below to begin the sign-in process and receive a queue number.
          </p>
          <button
            onClick={handleStart}
            className="bg-blue-600 text-white text-xl px-6 py-4 rounded-lg hover:bg-blue-700 transition-all"
          >
            Start
          </button>
        </div>

        {/* QR Code Scanner Option */}
        <div className="card bg-white shadow-lg p-8 rounded-xl flex flex-col items-center">
          <h2 className="text-3xl font-semibold mb-4">Scan QR Code</h2>
          <p className="mb-6 text-lg">
            Already started? Scan your QR code to autofill the sign-in form.
          </p>
          <button
            onClick={handleQRScan}
            className="bg-green-600 text-white text-xl px-6 py-4 rounded-lg hover:bg-green-700 transition-all"
          >
            Scan Now
          </button>
        </div>
      </div>
    </div>
  );
}
