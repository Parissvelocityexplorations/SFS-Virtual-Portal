import React, { useState, useEffect } from 'react';
import { useNavigate } from '@remix-run/react';
import type { MetaFunction } from '@remix-run/node';
import KioskLayout from '~/components/KioskLayout';
import Calendar from '~/components/Calendar';
import axios from 'axios';

export const meta: MetaFunction = () => {
  return [
    { title: "Pass Access Kiosk - Schedule Appointment" },
    { name: "description", content: "Schedule your appointment at the Pass Access Kiosk" },
  ];
};

export default function Schedule() {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [userInfo, setUserInfo] = useState<any>(null);
  const [selectedService, setSelectedService] = useState<string | null>(null);
  
  // Load user data and selected service when component mounts
  useEffect(() => {
    const storedUserInfo = localStorage.getItem('visitorInfo');
    const storedService = localStorage.getItem('selectedService');
    
    if (!storedUserInfo || !storedService) {
      // If either is missing, redirect back to the appropriate step
      if (!storedUserInfo) {
        navigate('/kiosk/service');
      } else {
        navigate('/kiosk/service-select');
      }
      return;
    }
    
    try {
      setUserInfo(JSON.parse(storedUserInfo));
      setSelectedService(storedService);
    } catch (e) {
      console.error('Error parsing stored data:', e);
      navigate('/kiosk/service');
    }
  }, [navigate]);
  
  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    // Reset time when date changes
    setSelectedTime(null);
  };
  
  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
  };
  
  const handleContinue = async () => {
    if (selectedDate && selectedTime) {
      try {
        // Store appointment details
        const appointmentDetails = {
          date: selectedDate.toISOString(),
          time: selectedTime,
          formattedDate: formatDate(selectedDate)
        };
        
        // Send to backend if user info and service are available
        if (userInfo && selectedService) {
          try {
            // First register the user if they don't exist
            console.log('Creating or fetching user in database');
            const userResponse = await axios.post('/api/users', {
              firstName: userInfo.firstName,
              lastName: userInfo.lastName,
              email: userInfo.email,
              phoneNo: userInfo.phone || '',
              service: selectedService,
              sponsor: userInfo.sponsor || ''
            });
            
            console.log('User created/updated successfully:', userResponse.data);
            const userId = userResponse.data.id;
            
            // Format the date combining selectedDate and selectedTime
            const dateTimeParts = selectedTime.split(':');
            const hours = parseInt(dateTimeParts[0]);
            const minutes = parseInt(dateTimeParts[1].substring(0, 2));
            const isPM = selectedTime.toLowerCase().includes('pm');
            
            // Create a new date object with hours and minutes
            const appointmentDateTime = new Date(selectedDate);
            appointmentDateTime.setHours(isPM && hours < 12 ? hours + 12 : hours);
            appointmentDateTime.setMinutes(minutes);
            
            console.log('Creating appointment with date:', appointmentDateTime.toISOString());
            
            // Create the appointment
            const appointmentResponse = await axios.post(`/api/appointments/userid/${userId}/date/${appointmentDateTime.toISOString()}`, userInfo);
            
            console.log('Appointment created successfully:', appointmentResponse.data);
            
            // Store the appointment ID for later reference
            const appointmentData = appointmentResponse.data;
            localStorage.setItem('appointmentId', appointmentData.id);
          } catch (error) {
            console.error('Error creating appointment in database:', error);
            // Continue with the flow even if the API call fails
          }
        }
        
        localStorage.setItem('appointmentDetails', JSON.stringify(appointmentDetails));
        navigate('/kiosk/review');
      } catch (error) {
        console.error('Error creating appointment:', error);
      }
    }
  };
  
  const handleBack = () => {
    navigate('/kiosk/service-select');
  };
  
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'long',
      month: 'long', 
      day: 'numeric',
      year: 'numeric'
    });
  };
  
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
  
  return (
    <KioskLayout 
      currentStep={3} 
      title="Schedule Your Appointment"
      onBack={handleBack}
    >
      <div className="bg-white p-8 rounded-lg shadow-md border border-divider mb-8">
        {userInfo && selectedService && (
          <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
            <h3 className="text-lg font-medium text-text-primary mb-2">Appointment Summary</h3>
            <p>
              <span className="text-text-secondary">Name:</span>{' '}
              <span className="font-medium">{userInfo.firstName} {userInfo.lastName}</span>
            </p>
            <p>
              <span className="text-text-secondary">Service:</span>{' '}
              <span className="font-medium">{getServiceName(selectedService)}</span>
            </p>
          </div>
        )}
        
        <p className="text-text-secondary mb-6">
          Please select a date and time for your appointment:
        </p>
        
        <Calendar
          onSelectDate={handleDateSelect}
          onSelectTimeSlot={handleTimeSelect}
          selectedDate={selectedDate}
          selectedTime={selectedTime}
        />
        
        {selectedDate && selectedTime && (
          <div className="mt-8 bg-primary bg-opacity-5 p-4 rounded-md border border-primary shadow-sm">
            <h4 className="font-medium mb-2 text-primary">Selected Appointment Time:</h4>
            <div className="flex items-center mb-2">
              <svg className="w-5 h-5 mr-2 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="font-medium">{formatDate(selectedDate)}</span>
            </div>
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="font-medium">{selectedTime}</span>
            </div>
          </div>
        )}
      </div>
      
      {/* Available time slots guidance */}
      <div className="bg-white p-6 rounded-lg shadow-md border border-divider mb-8">
        <h3 className="font-medium text-lg mb-3 text-text-primary">Appointment Guidelines</h3>
        <ul className="list-disc pl-5 space-y-2 text-text-secondary">
          <li>Please arrive 15 minutes before your scheduled appointment time</li>
          <li>Bring a valid government-issued photo ID</li>
          <li>Canceled appointments require 24-hour notice</li>
          <li>For {selectedService === 'vhic' ? 'Veteran Health ID Card' : 'DBIDS'} processing, additional documentation may be required</li>
        </ul>
      </div>
      
      {/* Continue Button */}
      <div className="flex justify-end mt-6">
        <button
          onClick={handleContinue}
          disabled={!selectedDate || !selectedTime}
          className={`secondary xl px-8 py-4 rounded-lg text-white font-medium ${
            (!selectedDate || !selectedTime)
              ? 'opacity-50 cursor-not-allowed'
              : ''
            }`}
        >
          Continue to Review
          <svg className="right w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </button>
      </div>
    </KioskLayout>
  );
}