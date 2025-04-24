import React, { useState } from 'react';
import { useNavigate } from '@remix-run/react';
import type { MetaFunction } from '@remix-run/node';
import KioskLayout from '~/components/KioskLayout';

export const meta: MetaFunction = () => {
  return [
    { title: "Pass Access Kiosk - Scanner Mode" },
    { name: "description", content: "Scanner Mode for the Pass Access Kiosk" },
  ];
};

export default function Scanner() {
  const navigate = useNavigate();
  const [scanned, setScanned] = useState(false);
  const [bookingDetails, setBookingDetails] = useState<null | {
    id: string;
    service: string;
    date: string;
    time: string;
    name: string;
    status: string;
    location: string;
  }>(null);
  
  // This function simulates scanning a barcode
  const handleScan = () => {
    // In a real app, this would use the device camera to scan a QR code
    // For this demo, we'll simulate scanning by retrieving the data we stored
    
    // Get the stored data
    const appointmentDetails = localStorage.getItem('appointmentDetails');
    const userInfo = localStorage.getItem('visitorInfo');
    const serviceType = localStorage.getItem('selectedService');
    const confirmationId = localStorage.getItem('confirmationId');
    
    let appointmentDate = '';
    let appointmentTime = '';
    let visitorName = '';
    let serviceName = '';
    let bookingId = confirmationId || 'PASS-92384765';
    
    // Parse the appointment details
    if (appointmentDetails) {
      try {
        const details = JSON.parse(appointmentDetails);
        appointmentDate = details.formattedDate || '';
        appointmentTime = details.time || '';
      } catch (error) {
        console.error('Error parsing appointment details:', error);
      }
    }
    
    // Parse user info
    if (userInfo) {
      try {
        const user = JSON.parse(userInfo);
        visitorName = `${user.firstName} ${user.lastName}`.trim();
      } catch (error) {
        console.error('Error parsing user info:', error);
      }
    }
    
    // Get service name
    if (serviceType) {
      const services: {[key: string]: string} = {
        'golf': 'Golf Pass',
        'visitor': 'Visitor Pass',
        'vhic': 'Veteran Health ID Card',
        'dbids': 'DBIDS Card'
      };
      serviceName = services[serviceType] || 'Selected Service';
    }
    
    // Simulate a successful scan
    setScanned(true);
    setBookingDetails({
      id: bookingId,
      service: serviceName || 'Visitor Pass',
      date: appointmentDate || 'Saturday, April 26, 2025',
      time: appointmentTime || '2:00 PM',
      name: visitorName || 'John Doe',
      status: 'Confirmed',
      location: 'Patrick Space Force Base, FL 32925'
    });
  };
  
  const handleReset = () => {
    setScanned(false);
    setBookingDetails(null);
  };
  
  const handleExit = () => {
    navigate('/kioskhome');
  };

  return (
    <KioskLayout 
      currentStep={0} 
      title="Kiosk Scanner Mode"
      showBackButton={false}
      showProgressSteps={false}
    >
      <div className="py-4">
        {!scanned ? (
          <div className="text-center">
            <div className="mb-8">
              <div className="bg-divider rounded-lg p-6 max-w-md mx-auto relative">
                {/* Camera viewfinder */}
                <div className="aspect-video bg-black rounded-md mb-4 flex items-center justify-center">
                  <div className="w-48 h-48 border-2 border-primary relative">
                    {/* Corner marks */}
                    <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-primary"></div>
                    <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-primary"></div>
                    <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-primary"></div>
                    <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-primary"></div>
                    
                    <div className="absolute inset-0 flex items-center justify-center text-white">
                      Scan barcode
                    </div>
                  </div>
                </div>
                
                <p className="text-text-secondary text-sm mb-4">
                  Position the barcode within the frame
                </p>
                
                <button 
                  onClick={handleScan}
                  className="bg-primary text-white px-6 py-3 rounded-md hover:bg-opacity-90 w-full"
                >
                  Simulate Scan
                </button>
              </div>
            </div>
            
            <div className="mt-8">
              <p className="text-text-secondary mb-2">Having trouble?</p>
              <p className="text-sm">
                Make sure the barcode is well-lit and clearly visible
              </p>
              <p className="text-sm mt-1">
                You can also manually enter the booking ID at the front desk
              </p>
            </div>
          </div>
        ) : (
          <div>
            <div className="bg-secondary bg-opacity-10 p-4 rounded-md border border-secondary border-opacity-20 mb-6">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-white mr-3">
                  ✓
                </div>
                <div>
                  <h3 className="font-medium">Booking Found</h3>
                  <p className="text-text-secondary text-sm">Booking ID: {bookingDetails?.id}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-surface border border-divider rounded-lg p-6 mb-8">
              <h3 className="text-lg font-medium mb-4">Booking Details</h3>
              
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                  <div className="text-text-secondary">Name:</div>
                  <div className="md:col-span-2 font-medium">{bookingDetails?.name}</div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                  <div className="text-text-secondary">Service:</div>
                  <div className="md:col-span-2 font-medium">{bookingDetails?.service}</div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                  <div className="text-text-secondary">Date:</div>
                  <div className="md:col-span-2 font-medium">{bookingDetails?.date}</div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                  <div className="text-text-secondary">Time:</div>
                  <div className="md:col-span-2 font-medium">{bookingDetails?.time}</div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                  <div className="text-text-secondary">Location:</div>
                  <div className="md:col-span-2 font-medium">{bookingDetails?.location}</div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                  <div className="text-text-secondary">Status:</div>
                  <div className="md:col-span-2">
                    <span className="inline-block bg-secondary bg-opacity-10 text-secondary px-2 py-1 rounded-md font-medium">
                      {bookingDetails?.status}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-primary bg-opacity-5 p-4 rounded-md mb-8">
              <h4 className="font-medium mb-2">Next Steps:</h4>
              <ol className="list-decimal pl-5 space-y-1">
                <li>Verify visitor's identity with photo ID</li>
                <li>Check DBIDS status in the system</li>
                <li>Direct visitor to the appropriate waiting area</li>
                <li>Update booking status in the admin panel</li>
              </ol>
            </div>
            
            <div className="flex justify-center gap-4">
              <button
                onClick={handleReset}
                className="px-6 py-3 rounded-md border border-divider hover:border-primary"
              >
                Scan Another
              </button>
              
              <button
                onClick={handleExit}
                className="px-6 py-3 rounded-md bg-primary text-white hover:bg-opacity-90"
              >
                Exit Scanner Mode
              </button>
            </div>
          </div>
        )}
      </div>
    </KioskLayout>
  );
}