import React from 'react';
import { useNavigate } from '@remix-run/react';
import type { MetaFunction } from '@remix-run/node';
import KioskLayout from '~/components/KioskLayout';

export const meta: MetaFunction = () => {
  return [
    { title: "Pass Access Kiosk - Review Booking" },
    { name: "description", content: "Review your booking at the Pass Access Kiosk" },
  ];
};

export default function Review() {
  const navigate = useNavigate();
  
  // In a real app, we'd get this data from state or context
  // For this demo, we're using hardcoded values
  const bookingDetails = {
    service: 'Golf Pass',
    date: 'Thursday, May 15, 2025',
    time: '9:30 AM',
    location: 'Building 237, Pass Office'
  };
  
  const handleBack = () => {
    navigate('/kiosk/schedule');
  };
  
  const handleConfirm = () => {
    navigate('/kiosk/confirmation');
  };

  return (
    <KioskLayout 
      currentStep={3} 
      title="Review Your Booking"
      onBack={handleBack}
    >
      <div className="py-4">
        <p className="text-text-secondary mb-6">
          Please review the details of your booking before confirming:
        </p>
        
        <div className="bg-surface border border-divider rounded-lg p-6 mb-8">
          <h3 className="text-lg font-medium mb-4">Booking Summary</h3>
          
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              <div className="text-text-secondary">Service:</div>
              <div className="md:col-span-2 font-medium">{bookingDetails.service}</div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              <div className="text-text-secondary">Date:</div>
              <div className="md:col-span-2 font-medium">{bookingDetails.date}</div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              <div className="text-text-secondary">Time:</div>
              <div className="md:col-span-2 font-medium">{bookingDetails.time}</div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              <div className="text-text-secondary">Location:</div>
              <div className="md:col-span-2 font-medium">{bookingDetails.location}</div>
            </div>
          </div>
        </div>
        
        <div className="bg-primary bg-opacity-5 p-4 rounded-md mb-8">
          <h4 className="font-medium mb-2">Important Information:</h4>
          <ul className="list-disc pl-5 text-text-secondary space-y-1">
            <li>Please arrive 15 minutes before your scheduled time</li>
            <li>Bring a valid photo ID and your DBIDS card</li>
            <li>Verification documents may be required based on your service type</li>
            <li>Your barcode will be available after confirmation</li>
          </ul>
        </div>
        
        <div className="flex justify-center mt-8">
          <button
            onClick={handleBack}
            className="px-6 py-3 rounded-md border border-divider mr-4 hover:border-primary"
          >
            Edit Booking
          </button>
          
          <button
            onClick={handleConfirm}
            className="px-6 py-3 rounded-md bg-secondary text-white hover:bg-opacity-90"
          >
            Confirm Booking
          </button>
        </div>
      </div>
    </KioskLayout>
  );
}