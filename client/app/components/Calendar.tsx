import React, { useState } from 'react';
import axios from "axios";

type CalendarProps = {
  onSelectDate: (date: Date) => void;
  onSelectTimeSlot: (time: string) => void;
  selectedDate: Date | null;
  selectedTime: string | null;
};

function getUnavailableSlots() {
  const apts = axios.get(`http://localhost:5288/Appointments`);
  console.log(apts);
  return ["9:30 AM", "11:00 AM", "2:30 PM"];
};

export default function Calendar({ 
  onSelectDate, 
  onSelectTimeSlot, 
  selectedDate, 
  selectedTime 
}: CalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  
  // Generate days for the calendar
  const daysInMonth = new Date(
    currentMonth.getFullYear(), 
    currentMonth.getMonth() + 1, 
    0
  ).getDate();
  
  const firstDayOfMonth = new Date(
    currentMonth.getFullYear(), 
    currentMonth.getMonth(), 
    1
  ).getDay();
  
  // Generate calendar days with padding for first row
  const calendarDays = [];
  
  // Add empty cells for days before the first day of the month
  for (let i = 0; i < firstDayOfMonth; i++) {
    calendarDays.push(null);
  }
  
  // Add actual days
  for (let i = 1; i <= daysInMonth; i++) {
    calendarDays.push(new Date(currentMonth.getFullYear(), currentMonth.getMonth(), i));
  }
  
  // Today's date
  const today = new Date();
  
  // Time slots
  const morningSlots = [
    "7:00 AM",
    "7:10 AM",
    "7:20 AM",
    "7:30 AM",
    "7:40 AM",
    "7:50 AM",
    "8:00 AM",
    "8:10 AM",
    "8:20 AM",
    "8:30 AM",
    "8:40 AM",
    "8:50 AM",
    "9:00 AM",
    "9:10 AM",
    "9:10 AM",
    "9:20 AM",
    "9:30 AM",
    "9:40 AM",
    "9:50 AM",
    "10:00 AM",
    "10:10 AM",
    "10:20 AM",
    "10:30 AM",
    "10:40 AM",
    "10:50 AM",
    "11:00 AM",
    "11:10 AM",
    "11:20 AM",
    "11:30 AM",
    "11:40 AM",
    "11:50 AM",
  ];
  const afternoonSlots = [
    "12:00 PM",
    "12:10 PM",
    "12:20 PM",
    "12:30 PM",
    "12:40 PM",
    "12:50 PM",
    "1:00 PM",
    "1:10 PM",
    "1:20 PM",
    "1:30 PM",
    "1:40 PM",
    "1:50 PM",
    "2:00 PM",
    "2:10 PM",
    "2:10 PM",
    "2:20 PM",
    "2:30 PM",
    "2:40 PM",
    "2:50 PM",
  ];
  
  // Mock unavailable slots for demo purposes (in a real app this would come from backend)
  const unavailableSlots = getUnavailableSlots();
  
  // Navigate to previous month
  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };
  
  // Navigate to next month
  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };
  
  // Format date for display
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };
  
  // Format selected date for display
  const formatSelectedDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'long',
      month: 'long', 
      day: 'numeric',
      year: 'numeric'
    });
  };
  
  // Check if date is today
  const isToday = (date: Date) => {
    return date.getDate() === today.getDate() && 
           date.getMonth() === today.getMonth() && 
           date.getFullYear() === today.getFullYear();
  };
  
  // Check if a date is selected
  const isSelected = (date: Date) => {
    if (!selectedDate) return false;
    return date.getDate() === selectedDate.getDate() && 
           date.getMonth() === selectedDate.getMonth() && 
           date.getFullYear() === selectedDate.getFullYear();
  };
  
  // Check if a date is in the past
  const isPastDate = (date: Date) => {
    // Set times to midnight for proper comparison
    const currentDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const compareDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    return compareDate < currentDate;
  };
  
  // Check if a time slot is available
  const isSlotAvailable = (time: string) => {
    return !unavailableSlots.includes(time);
  };
  
  // Days of the week
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
      {/* Calendar Column */}
      <div className="md:col-span-3">
        <div className="bg-surface rounded-xl shadow-md border border-divider p-6 overflow-hidden relative">
          {/* Calendar header with month navigation */}
          <div className="flex justify-between items-center mb-6 pb-3 border-b border-divider">
            <button 
              onClick={prevMonth}
              className="p-2 text-text-secondary hover:text-primary flex items-center focus:outline-none transition-colors"
              aria-label="Previous month"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            
            <h3 className="text-xl font-semibold text-text-primary">
              {formatDate(currentMonth)}
            </h3>
            
            <button 
              onClick={nextMonth}
              className="p-2 text-text-secondary hover:text-primary flex items-center focus:outline-none transition-colors"
              aria-label="Next month"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
          
          {/* Days of week header */}
          <div className="grid grid-cols-7 mb-3">
            {weekDays.map(day => (
              <div key={day} className="text-center font-medium text-text-secondary text-sm py-2">
                {day}
              </div>
            ))}
          </div>
          
          {/* Calendar grid */}
          <div className="grid grid-cols-7 gap-2">
            {calendarDays.map((day, index) => {
              if (!day) {
                return <div key={`empty-${index}`} className="h-11"></div>;
              }
              
              const isCurrentDay = isToday(day);
              const isSelectedDay = isSelected(day);
              const isPast = isPastDate(day);
              
              return (
                <div 
                  key={`day-${day.getDate()}`} 
                  className={`
                    h-11 flex items-center justify-center rounded-lg cursor-pointer
                    text-base font-medium transition-all duration-200
                    ${isSelectedDay 
                      ? 'bg-primary text-white shadow-md' 
                      : isCurrentDay 
                        ? 'bg-primary/10 text-primary border border-primary/30' 
                        : isPast
                          ? 'text-text-tertiary bg-divider/30 cursor-not-allowed'
                          : 'text-text-primary hover:bg-primary/5 hover:border hover:border-primary/30'
                    }
                  `}
                  onClick={() => !isPast && onSelectDate(day)}
                >
                  {day.getDate()}
                  
                  {/* Current day indicator */}
                  {isCurrentDay && (
                    <span className="absolute w-1 h-1 bg-primary rounded-full -bottom-1"></span>
                  )}
                </div>
              );
            })}
          </div>
          
          {/* Date selection instruction */}
          <div className="mt-6 pt-4 border-t border-divider text-text-secondary text-sm flex items-center">
            <svg className="w-4 h-4 mr-2 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Select an available date to see available time slots</span>
          </div>
        </div>
      </div>
      
      {/* Time slots column */}
      <div className="md:col-span-2">
        <div className="bg-surface rounded-xl shadow-md border border-divider p-6 h-full flex flex-col relative">
          {/* Time slots header */}
          <h3 className="text-xl font-semibold mb-5 pb-3 border-b border-divider text-text-primary flex items-center">
            <svg className="w-5 h-5 mr-2 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Available Times
          </h3>
          
          {!selectedDate ? (
            <div className="flex-grow flex flex-col items-center justify-center text-center p-6 bg-panel/30 rounded-lg">
              <div className="w-16 h-16 rounded-full bg-divider/50 flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <p className="text-text-secondary font-medium">
                Please select a date from the calendar to view available appointment times
              </p>
            </div>
          ) : (
            <div className="flex-grow flex flex-col">
              <div className="mb-4 p-3 bg-primary/5 rounded-lg border border-primary/20 flex items-center">
                <svg className="w-5 h-5 mr-2 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="font-medium">{formatSelectedDate(selectedDate)}</span>
              </div>
              
              {/* Morning slots */}
              <h4 className="font-medium text-text-secondary mb-2 flex items-center">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                Morning
              </h4>
              <div className="grid grid-cols-2 gap-2 mb-6">
                {morningSlots.map(time => {
                  const available = isSlotAvailable(time);
                  return (
                    <div 
                      key={time}
                      className={`
                        p-3 border rounded-lg text-center transition-all duration-200
                        ${selectedTime === time 
                          ? 'border-primary bg-primary/5 text-primary font-medium shadow-sm' 
                          : available
                            ? 'border-divider hover:border-primary/50 hover:bg-primary/5 cursor-pointer text-text-primary'
                            : 'border-divider bg-divider/20 text-text-tertiary cursor-not-allowed'
                        }
                      `}
                      onClick={() => available && onSelectTimeSlot(time)}
                    >
                      {time}
                    </div>
                  );
                })}
              </div>
              
              {/* Afternoon slots */}
              <h4 className="font-medium text-text-secondary mb-2 flex items-center">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.513 8.279l-12 12-5.234-5.234 12-12 5.234 5.234zm-9.613 2.121l7.5 7.5M16 5l3 3-3-3z" />
                </svg>
                Afternoon
              </h4>
              <div className="grid grid-cols-2 gap-2">
                {afternoonSlots.map(time => {
                  const available = isSlotAvailable(time);
                  return (
                    <div 
                      key={time}
                      className={`
                        p-3 border rounded-lg text-center transition-all duration-200
                        ${selectedTime === time 
                          ? 'border-primary bg-primary/5 text-primary font-medium shadow-sm' 
                          : available
                            ? 'border-divider hover:border-primary/50 hover:bg-primary/5 cursor-pointer text-text-primary'
                            : 'border-divider bg-divider/20 text-text-tertiary cursor-not-allowed'
                        }
                      `}
                      onClick={() => available && onSelectTimeSlot(time)}
                    >
                      {time}
                    </div>
                  );
                })}
              </div>
              
              {/* Legend */}
              <div className="mt-6 pt-3 border-t border-divider text-sm flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-divider/20 rounded-full mr-1"></div>
                  <span className="text-text-tertiary">Unavailable</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-primary/5 border border-primary/50 rounded-full mr-1"></div>
                  <span className="text-text-tertiary">Selected</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}