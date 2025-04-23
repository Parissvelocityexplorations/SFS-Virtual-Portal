import React from 'react';
import { useNavigate } from '@remix-run/react';
import type { MetaFunction } from '@remix-run/node';
import KioskLayout from '~/components/KioskLayout';
import Barcode from '~/components/Barcode';

export const meta: MetaFunction = () => {
  return [
    { title: "Pass Access Kiosk - Booking Confirmation" },
    { name: "description", content: "Your booking is confirmed at the Pass Access Kiosk" },
  ];
};

export default function Confirmation() {
  const navigate = useNavigate();
  
  // In a real app, we'd generate a unique booking ID
  // For this demo, we're using a hardcoded value
  const bookingId = 'PASS-92384765';
  
  // In a real app, we'd get this data from state or context
  const bookingDetails = {
    service: 'Golf Pass',
    date: 'Thursday, May 15, 2025',
    time: '9:30 AM',
    location: 'Building 237, Pass Office'
  };
  
  const handleNewBooking = () => {
    navigate('/kiosk');
  };
  
  const handlePrint = () => {
    window.print();
  };

  return (
    <KioskLayout 
      currentStep={4} 
      title="Booking Confirmed!"
      showBackButton={false}
    >
      <div className="py-4">
        <div className="text-center mb-8">
          <div className="inline-block bg-secondary bg-opacity-10 p-3 rounded-full mb-4">
            <div className="w-16 h-16 flex items-center justify-center bg-secondary rounded-full text-white text-3xl">
              ✓
            </div>
          </div>
          <h3 className="text-xl font-medium mb-2">Your booking has been confirmed</h3>
          <p className="text-text-secondary">
            Please save your barcode and present it at the kiosk
          </p>
        </div>
        
        <div className="mb-8">
          <Barcode bookingId={bookingId} />
        </div>
        
        <div className="bg-surface border border-divider rounded-lg p-6 mb-8">
          <h3 className="text-lg font-medium mb-4">Booking Details</h3>
          
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
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              <div className="text-text-secondary">Booking ID:</div>
              <div className="md:col-span-2 font-medium">{bookingId}</div>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row justify-center gap-4 mt-8">
          <button
            onClick={handlePrint}
            className="px-6 py-3 rounded-md border border-divider hover:border-primary flex items-center justify-center"
          >
            <span className="mr-2">🖨️</span> Print
          </button>
          
          <button
            onClick={() => window.location.href = `mailto:?subject=My Pass Access Booking&body=Booking Details:%0A- Service: ${bookingDetails.service}%0A- Date: ${bookingDetails.date}%0A- Time: ${bookingDetails.time}%0A- Location: ${bookingDetails.location}%0A- Booking ID: ${bookingId}%0A%0APlease bring your booking ID and barcode to the kiosk.`}
            className="px-6 py-3 rounded-md border border-divider hover:border-primary flex items-center justify-center"
          >
            <span className="mr-2">📧</span> Email
          </button>
          
          <button
            onClick={handleNewBooking}
            className="px-6 py-3 rounded-md bg-primary text-white hover:bg-opacity-90 flex items-center justify-center"
          >
            <span className="mr-2">➕</span> New Booking
          </button>
        </div>
      </div>
    </KioskLayout>
  );
}