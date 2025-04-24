import React, { useState, useEffect } from 'react';
import { useNavigate } from '@remix-run/react';
import type { MetaFunction } from '@remix-run/node';
import KioskLayout from '~/components/KioskLayout';
import Calendar from '~/components/Calendar';

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
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const storedUserInfo = localStorage.getItem('visitorInfo');
    const storedService = localStorage.getItem('selectedService');
    const storedUserId = localStorage.getItem('userId');

    console.log('👀 visitorInfo:', storedUserInfo);
    console.log('📦 storedUserId:', storedUserId);

    if (!storedUserInfo || !storedService || !storedUserId) {
      console.warn('❌ Redirecting due to missing required info');
      navigate('/kiosk/service');
      return;
    }

    try {
      setUserInfo(JSON.parse(storedUserInfo));
      setSelectedService(storedService);
      setUserId(storedUserId);
    } catch (e) {
      console.error('Error parsing stored data:', e);
      navigate('/kiosk/service');
    }
  }, [navigate]);

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    setSelectedTime(null);
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
  };

  const handleContinue = async () => {
    if (!selectedDate || !selectedTime || !userId || !userInfo) return;

    const isoDate = selectedDate.toISOString();

    try {
      const response = await fetch(`http://localhost:8080/Appointments/userid/${userId}/date/${isoDate}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          user: {
            firstName: userInfo.firstName,
            lastName: userInfo.lastName,
            email: userInfo.email,
            phoneNo: userInfo.phone
          }
        })
      });

      if (!response.ok) {
        throw new Error('Failed to create appointment');
      }

      const appointment = await response.json();
      localStorage.setItem('appointmentId', appointment.id);

      const appointmentDetails = {
        date: selectedDate.toISOString(),
        time: selectedTime,
        formattedDate: formatDate(selectedDate)
      };

      localStorage.setItem('appointmentDetails', JSON.stringify(appointmentDetails));
      navigate('/kiosk/review');
    } catch (error) {
      console.error('Error creating appointment:', error);
      alert('There was a problem scheduling your appointment. Please try again.');
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

  const getServiceName = (serviceId: string) => {
    const services: { [key: string]: string } = {
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
            <p><span className="text-text-secondary">Name:</span> <span className="font-medium">{userInfo.firstName} {userInfo.lastName}</span></p>
            <p><span className="text-text-secondary">Service:</span> <span className="font-medium">{getServiceName(selectedService)}</span></p>
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
              <svg className="w-5 h-5 mr-2 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="font-medium">{formatDate(selectedDate)}</span>
            </div>
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="font-medium">{selectedTime}</span>
            </div>
          </div>
        )}
      </div>

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
          <svg className="right w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </button>
      </div>
    </KioskLayout>
  );
}
