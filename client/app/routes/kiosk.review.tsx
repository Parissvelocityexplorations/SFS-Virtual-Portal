import React, { useState, useEffect } from 'react';
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
  const [userData, setUserData] = useState<any>(null);
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [appointmentDetails, setAppointmentDetails] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  
  // Load all stored data when component mounts
  useEffect(() => {
    setLoading(true);
    const storedUserInfo = localStorage.getItem('visitorInfo');
    const storedService = localStorage.getItem('selectedService');
    const storedAppointment = localStorage.getItem('appointmentDetails');
    
    // Check if all required data is available
    if (!storedUserInfo || !storedService || !storedAppointment) {
      // Redirect to the appropriate step if data is missing
      if (!storedUserInfo) {
        navigate('/kiosk/service');
      } else if (!storedService) {
        navigate('/kiosk/service-select');
      } else {
        navigate('/kiosk/schedule');
      }
      return;
    }
    
    try {
      setUserData(JSON.parse(storedUserInfo));
      setSelectedService(storedService);
      setAppointmentDetails(JSON.parse(storedAppointment));
      setLoading(false);
    } catch (e) {
      console.error('Error parsing stored data:', e);
      navigate('/kiosk/service');
    }
  }, [navigate]);
  
  // Get service name based on selected service ID
  const getServiceName = (serviceId: string) => {
    const services: {[key: string]: string} = {
      'golf': 'Golf Pass',
      'visitor': 'Visitor Pass',
      'vhic': 'Veteran Health ID Card',
      'dbids': 'DBIDS Card'
    };
    
    return services[serviceId] || 'Selected Service';
  };
  
  // Determine the required documents based on service type
  const getRequiredDocuments = (serviceId: string) => {
    switch(serviceId) {
      case 'golf':
        return "Valid photo ID";
      case 'visitor':
        return "Valid photo ID and DBIDS card";
      case 'vhic':
        return "Veteran Health ID Card, DD214, and valid photo ID";
      case 'dbids':
        return "Two forms of valid photo ID and sponsorship letter";
      default:
        return "Valid photo ID";
    }
  };
  
  const handleBack = () => {
    navigate('/kiosk/schedule');
  };
  
  const handleConfirm = () => {
    // In a real application, this would send the data to the server
    // For now, we'll just store a confirmation ID in localStorage
    const confirmationId = Math.floor(100000 + Math.random() * 900000).toString();
    localStorage.setItem('confirmationId', confirmationId);
    
    navigate('/kiosk/confirmation');
  };

  if (loading) {
    return (
      <KioskLayout 
        currentStep={4} 
        title="Loading Booking Details"
        onBack={handleBack}
      >
        <div className="flex justify-center items-center py-20">
          <svg className="animate-spin h-10 w-10 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
      </KioskLayout>
    );
  }

  return (
    <KioskLayout 
      currentStep={4} 
      title="Review Your Booking"
      onBack={handleBack}
    >
      <div className="bg-white p-8 rounded-lg shadow-md border border-divider mb-8">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-text-primary mb-2">Booking Summary</h2>
          <p className="text-text-secondary">
            Please review the details of your appointment before confirming
          </p>
        </div>
        
        <div className="border border-divider rounded-lg p-6 mb-8 bg-blue-50">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-blue-200">
            <div className="flex items-center">
              <div className="bg-primary rounded-full p-3 mr-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-text-primary">Personal Information</h3>
                <p className="text-text-secondary">Visitor details</p>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <p className="text-text-secondary text-sm">Full Name</p>
              <p className="font-medium">{userData?.firstName} {userData?.lastName}</p>
            </div>
            
            <div>
              <p className="text-text-secondary text-sm">Phone Number</p>
              <p className="font-medium">{userData?.phone || "Not provided"}</p>
            </div>
            
            <div>
              <p className="text-text-secondary text-sm">Email Address</p>
              <p className="font-medium">{userData?.email || "Not provided"}</p>
            </div>
            
            {userData?.sponsor && (
              <div>
                <p className="text-text-secondary text-sm">Sponsor Name</p>
                <p className="font-medium">{userData.sponsor}</p>
              </div>
            )}
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="border border-divider rounded-lg p-6 transition-all hover:shadow-md">
            <div className="flex items-center mb-4">
              <div className="bg-primary bg-opacity-10 rounded-full p-3 mr-4">
                <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11m0-5.5a1.5 1.5 0 013 0v3m0 0V11"></path>
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-medium">Service Type</h3>
                <p className="text-primary font-semibold">
                  {selectedService && getServiceName(selectedService)}
                </p>
              </div>
            </div>
            
            <div className="ml-14 text-text-secondary">
              <p>Required Documents:</p>
              <p className="font-medium">{selectedService && getRequiredDocuments(selectedService)}</p>
            </div>
          </div>
          
          <div className="border border-divider rounded-lg p-6 transition-all hover:shadow-md">
            <div className="flex items-center mb-4">
              <div className="bg-primary bg-opacity-10 rounded-full p-3 mr-4">
                <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-medium">Appointment Time</h3>
                <p className="text-primary font-semibold">
                  {appointmentDetails?.time}
                </p>
              </div>
            </div>
            
            <div className="ml-14 text-text-secondary">
              <p>Date:</p>
              <p className="font-medium">{appointmentDetails?.formattedDate}</p>
              <p className="mt-2">Location:</p>
              <p className="font-medium">Building 237, Pass Office</p>
            </div>
          </div>
        </div>
        
        <div className="mt-8 bg-yellow-50 p-5 rounded-lg border-l-4 border-yellow-400">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-6 w-6 text-yellow-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h4 className="text-yellow-800 font-medium">Important Information</h4>
              <ul className="mt-2 list-disc pl-5 text-yellow-700 space-y-1">
                <li>Please arrive 15 minutes before your scheduled time</li>
                <li>Bring all required documentation for your service type</li>
                <li>Your appointment barcode will be available after confirmation</li>
                <li>Rescheduling requires 24-hour notice</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex justify-center mt-8 space-x-6">
        <button
          onClick={handleBack}
          className="px-8 py-4 rounded-lg border-2 border-primary text-primary font-medium transition-all hover:bg-primary hover:text-white"
        >
          Edit Appointment
        </button>
        
        <button
          onClick={handleConfirm}
          className="px-8 py-4 rounded-lg bg-secondary text-white font-medium transition-all hover:bg-opacity-90 shadow-md hover:shadow-lg transform hover:-translate-y-1"
        >
          Confirm Appointment
        </button>
      </div>
    </KioskLayout>
  );
}