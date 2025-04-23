import React, { useState } from 'react';
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
  
  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    // Reset time when date changes
    setSelectedTime(null);
  };
  
  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
  };
  
  const handleContinue = () => {
    if (selectedDate && selectedTime) {
      // In a real app, we'd store the selected date and time in state or context
      navigate('/kiosk/review');
    }
  };
  
  const handleBack = () => {
    navigate('/kiosk/service');
  };
  
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'long',
      month: 'long', 
      day: 'numeric',
      year: 'numeric'
    });
  };
  
  return (
    <KioskLayout 
      currentStep={2} 
      title="Schedule Your Appointment"
      onBack={handleBack}
    >
      <div className="py-4">
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
          <div className="mt-8 bg-primary bg-opacity-5 p-4 rounded-md border border-primary border-opacity-20">
            <h4 className="font-medium mb-2">Selected Appointment:</h4>
            <p className="mb-1">
              <span className="text-text-secondary">Date:</span>{' '}
              <span className="font-medium">{formatDate(selectedDate)}</span>
            </p>
            <p>
              <span className="text-text-secondary">Time:</span>{' '}
              <span className="font-medium">{selectedTime}</span>
            </p>
          </div>
        )}
        
        <div className="flex justify-end mt-6">
          <button
            onClick={handleContinue}
            disabled={!selectedDate || !selectedTime}
            className={`px-6 py-3 rounded-md text-white ${
              selectedDate && selectedTime
                ? 'bg-secondary hover:bg-opacity-90' 
                : 'bg-divider cursor-not-allowed'
            }`}
          >
            NEXT
          </button>
        </div>
      </div>
    </KioskLayout>
  );
}