import React, { useState, useEffect } from 'react';
import { useNavigate } from '@remix-run/react';
import type { MetaFunction } from '@remix-run/node';
import KioskLayout from '~/components/KioskLayout';
import Barcode from '~/components/Barcode';

export const meta: MetaFunction = () => {
  return [
    { title: "Pass Access Kiosk - Appointment Confirmation" },
    { name: "description", content: "Your appointment is confirmed at the Pass Access Kiosk" },
  ];
};

export default function Confirmation() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState<any>(null);
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [appointmentDetails, setAppointmentDetails] = useState<any>(null);
  const [confirmationId, setConfirmationId] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  
  // Load all stored data when component mounts
  useEffect(() => {
    setLoading(true);
    const storedUserInfo = localStorage.getItem('visitorInfo');
    const storedService = localStorage.getItem('selectedService');
    const storedAppointment = localStorage.getItem('appointmentDetails');
    const storedConfirmationId = localStorage.getItem('confirmationId');
    
    // Generate a confirmation ID if one doesn't exist
    const confirmId = storedConfirmationId || `PASS-${Math.floor(100000 + Math.random() * 900000)}`;
    if (!storedConfirmationId) {
      localStorage.setItem('confirmationId', confirmId);
    }
    setConfirmationId(confirmId);
    
    // Check if we have all the required data
    if (!storedUserInfo || !storedService || !storedAppointment) {
      // For demo purposes, we'll just use specified values instead of redirecting
      setUserData({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        phone: '555-123-4567'
      });
      setSelectedService('visitor');
      setAppointmentDetails({
        formattedDate: 'Saturday, April 26, 2025',
        time: '2:00 PM'
      });
    } else {
      try {
        const parsedUserData = JSON.parse(storedUserInfo);
        setUserData(parsedUserData);
        setSelectedService(storedService);
        setAppointmentDetails(JSON.parse(storedAppointment));
        
        // Automatically trigger email confirmation if email is available
        if (parsedUserData.email) {
          setTimeout(() => {
            // This will trigger the email client to open with the confirmation details
            const serviceName = storedService ? getServiceName(storedService) : 'Selected Service';
            const name = `${parsedUserData.firstName} ${parsedUserData.lastName}`;
            const date = JSON.parse(storedAppointment).formattedDate || 'Scheduled Date';
            const time = JSON.parse(storedAppointment).time || 'Scheduled Time';
            
            const emailBody = `Hello ${name},%0A%0AYour Space Force Pass Access appointment has been confirmed!%0A%0AAppointment Details:%0A- Service: ${serviceName}%0A- Date: ${date}%0A- Time: ${time}%0A- Location: Pass Office, Patrick Space Force Base, FL 32925%0A- Confirmation ID: ${confirmId}%0A%0AImportant Information:%0A- Please arrive 15 minutes before your scheduled time%0A- Bring all required documentation for your service type%0A- Present this confirmation when you arrive%0A%0AThank you for using the Space Force Pass Access Kiosk.`;
            
            // In a production app, this would send the confirmation data to the backend
            // For demo purposes, we'll just log what would be sent
            console.log('Email confirmation would be sent to:', parsedUserData.email, {
              subject: 'Space Force Pass Access Appointment Confirmation',
              confirmationId: confirmId
            });
            
            // No actual API call for demo
          }, 1000);
        }
      } catch (e) {
        console.error('Error parsing stored data:', e);
      }
    }
    
    setLoading(false);
  }, []);
  
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
  
  const handleNewAppointment = () => {
    // Clear all stored data before starting a new appointment
    localStorage.removeItem('visitorInfo');
    localStorage.removeItem('selectedService');
    localStorage.removeItem('appointmentDetails');
    localStorage.removeItem('confirmationId');
    
    navigate('/kiosk');
  };
  
  const handlePrint = () => {
    window.print();
  };
  
  // Format email body with details
  const getEmailBody = () => {
    const serviceName = selectedService ? getServiceName(selectedService) : 'Selected Service';
    const name = userData ? `${userData.firstName} ${userData.lastName}` : 'Guest';
    const date = appointmentDetails?.formattedDate || 'Scheduled Date';
    const time = appointmentDetails?.time || 'Scheduled Time';
    
    return `Hello ${name},%0A%0AYour Space Force Pass Access appointment has been confirmed!%0A%0AAppointment Details:%0A- Service: ${serviceName}%0A- Date: ${date}%0A- Time: ${time}%0A- Location: Pass Office, Patrick Space Force Base, FL 32925%0A- Confirmation ID: ${confirmationId}%0A%0AImportant Information:%0A- Please arrive 15 minutes before your scheduled time%0A- Bring all required documentation for your service type%0A- Present this confirmation when you arrive%0A%0AThank you for using the Space Force Pass Access Kiosk.`;
  };

  if (loading) {
    return (
      <KioskLayout 
        currentStep={5} 
        title="Generating Confirmation"
        showBackButton={false}
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
      currentStep={5} 
      title="Appointment Confirmed!"
      showBackButton={false}
    >
      <div className="bg-white p-8 rounded-lg shadow-md border border-divider mb-8">
        <div className="text-center mb-8">
          <div className="inline-block bg-secondary bg-opacity-10 p-4 rounded-full mb-4 animate-pulse">
            <div className="w-20 h-20 flex items-center justify-center bg-secondary rounded-full text-white">
              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
          </div>
          <h2 className="text-2xl font-bold mb-3 text-text-primary">Your appointment has been confirmed!</h2>
          <p className="text-text-secondary text-lg max-w-lg mx-auto">
            Please save the details below and bring your confirmation barcode to the appointment
          </p>
        </div>
        
        <div className="mb-8 p-6 border-2 border-dashed border-divider rounded-lg bg-gray-50">
          <Barcode bookingId={confirmationId} />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-blue-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <svg className="w-5 h-5 mr-2 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
              </svg>
              Visitor Information
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-text-secondary">Name:</span>
                <span className="font-medium">{userData?.firstName} {userData?.lastName}</span>
              </div>
              {userData?.email && (
                <div className="flex justify-between">
                  <span className="text-text-secondary">Email:</span>
                  <span className="font-medium">{userData.email}</span>
                </div>
              )}
              {userData?.phone && (
                <div className="flex justify-between">
                  <span className="text-text-secondary">Phone:</span>
                  <span className="font-medium">{userData.phone}</span>
                </div>
              )}
            </div>
          </div>
          
          <div className="bg-blue-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <svg className="w-5 h-5 mr-2 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
              </svg>
              Appointment Details
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-text-secondary">Service:</span>
                <span className="font-medium">Visitor Pass</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-secondary">Date:</span>
                <span className="font-medium">Saturday, April 26, 2025</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-secondary">Time:</span>
                <span className="font-medium">2:00 PM</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-secondary">Location:</span>
                <span className="font-medium">Pass Office, Patrick Space Force Base, FL 32925</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-green-50 p-5 rounded-lg border-l-4 border-green-400 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-6 w-6 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h4 className="text-green-800 font-medium">Confirmation ID: {confirmationId}</h4>
              <p className="mt-1 text-green-700">Please keep this ID for your records and bring it with you to your appointment.</p>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row justify-center gap-4 mt-8">
          <button
            onClick={handlePrint}
            className="px-6 py-4 rounded-lg border-2 border-divider hover:border-primary flex items-center justify-center font-medium transition-all"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path>
            </svg>
            Print Confirmation
          </button>
          
          <button
            onClick={handleNewAppointment}
            className="px-6 py-4 rounded-lg bg-primary text-white hover:bg-opacity-90 flex items-center justify-center font-medium transition-all hover:shadow-lg transform hover:-translate-y-1"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            New Appointment
          </button>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-md border border-divider mb-8">
        <h3 className="text-xl font-medium text-primary mb-4 text-center">Visitors Control Center Information</h3>
        
        <div className="mb-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
          <h4 className="text-lg font-medium mb-2 text-yellow-800">Appointment Summary</h4>
          <div className="grid grid-cols-2 gap-2">
            <div className="text-yellow-800">Service:</div>
            <div className="font-medium text-yellow-900">Visitor Pass</div>
            
            <div className="text-yellow-800">Date:</div>
            <div className="font-medium text-yellow-900">Saturday, April 26, 2025</div>
            
            <div className="text-yellow-800">Time:</div>
            <div className="font-medium text-yellow-900">2:00 PM</div>
            
            <div className="text-yellow-800">Location:</div>
            <div className="font-medium text-yellow-900">Pass Office, Patrick Space Force Base, FL 32925</div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-lg font-medium mb-2">Location</h4>
            <p className="text-text-secondary mb-2">Patrick Space Force Base, FL 32925</p>
            <a 
              href="https://maps.app.goo.gl/Pxsf9AWEoANBALWL8" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary hover:underline flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              View on Google Maps
            </a>
          </div>
          
          <div>
            <h4 className="text-lg font-medium mb-2">VCC Hours</h4>
            <p className="text-text-secondary">7:30 a.m. to 3 p.m.</p>
            <p className="text-text-secondary">Closed Sat & Sun</p>
            
            <div className="mt-4">
              <a 
                href="https://www.patrick.spaceforce.mil/Visitors-Control-Center/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:underline flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
                Visit VCC Website
              </a>
            </div>
          </div>
        </div>
      </div>
      
      <div className="text-center text-text-secondary">
        <p>Thank you for using the Space Force Pass Access Kiosk</p>
        <p className="text-sm mt-2">For assistance, please call (555) 123-4567</p>
      </div>
    </KioskLayout>
  );
}