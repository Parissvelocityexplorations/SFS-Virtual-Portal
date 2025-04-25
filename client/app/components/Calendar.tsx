import React, { useState, useEffect, useRef } from 'react';

type CalendarProps = {
  onSelectDate: (date: Date) => void;
  onSelectTimeSlot: (time: string) => void;
  selectedDate: Date | null;
  selectedTime: string | null;
};

export default function Calendar({ 
  onSelectDate, 
  onSelectTimeSlot, 
  selectedDate, 
  selectedTime 
}: CalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [isMonthChanging, setIsMonthChanging] = useState(false);
  const [transitionDirection, setTransitionDirection] = useState<'left' | 'right' | null>(null);
  const calendarRef = useRef<HTMLDivElement>(null);
  const [isTimeSlotExpanded, setIsTimeSlotExpanded] = useState(false);
  
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
  const morningSlots = ["9:00 AM", "9:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM"];
  const afternoonSlots = ["1:00 PM", "1:30 PM", "2:00 PM", "2:30 PM", "3:00 PM", "3:30 PM"];
  
  // Mock unavailable slots for demo purposes (in a real app this would come from backend)
  const unavailableSlots = ["9:30 AM", "11:00 AM", "2:30 PM"];
  
  // Effect for animating month changes
  useEffect(() => {
    if (isMonthChanging) {
      const timer = setTimeout(() => {
        setIsMonthChanging(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isMonthChanging]);
  
  // Effect to animate timeslot appearance when date is selected
  useEffect(() => {
    if (selectedDate) {
      setIsTimeSlotExpanded(true);
    } else {
      setIsTimeSlotExpanded(false);
    }
  }, [selectedDate]);

  // Navigate to previous month
  const prevMonth = () => {
    setTransitionDirection('right');
    setIsMonthChanging(true);
    setTimeout(() => {
      setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
    }, 150);
  };
  
  // Navigate to next month
  const nextMonth = () => {
    setTransitionDirection('left');
    setIsMonthChanging(true);
    setTimeout(() => {
      setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
    }, 150);
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
  
  // Handle date selection with animation
  const handleDateSelection = (date: Date) => {
    if (!isPastDate(date)) {
      // Add animation to calendar
      if (calendarRef.current) {
        calendarRef.current.classList.add('date-selected-pulse');
        setTimeout(() => {
          if (calendarRef.current) {
            calendarRef.current.classList.remove('date-selected-pulse');
          }
        }, 500);
      }
      onSelectDate(date);
    }
  };
  
  // Days of the week
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
      {/* Calendar Column */}
      <div className="md:col-span-3">
        <div 
          ref={calendarRef}
          className="bg-surface rounded-xl shadow-md border border-divider p-6 overflow-hidden relative backdrop-blur-sm bg-white/90"
        >
          {/* Subtle decoration elements */}
          <div className="absolute -top-12 -right-12 w-24 h-24 bg-primary/5 rounded-full blur-xl opacity-70" />
          <div className="absolute -bottom-12 -left-12 w-24 h-24 bg-secondary/5 rounded-full blur-xl opacity-70" />
          
          {/* Calendar header with month navigation */}
          <div className="flex justify-between items-center mb-6 pb-3 border-b border-divider/60">
            <button 
              onClick={prevMonth}
              className="p-2 text-text-secondary hover:text-primary flex items-center focus:outline-none transition-colors rounded-full hover:bg-primary/5"
              aria-label="Previous month"
              disabled={isMonthChanging}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            
            <div className="relative w-48 h-10 overflow-hidden">
              <h3 
                className={`text-xl font-semibold text-text-primary text-center absolute inset-0 flex items-center justify-center transition-all duration-300 ease-in-out ${
                  isMonthChanging 
                    ? transitionDirection === 'left' 
                      ? 'transform -translate-x-full opacity-0' 
                      : 'transform translate-x-full opacity-0'
                    : 'transform translate-x-0 opacity-100'
                }`}
              >
                {formatDate(currentMonth)}
              </h3>
            </div>
            
            <button 
              onClick={nextMonth}
              className="p-2 text-text-secondary hover:text-primary flex items-center focus:outline-none transition-colors rounded-full hover:bg-primary/5"
              aria-label="Next month"
              disabled={isMonthChanging}
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
          
          {/* Calendar grid with animation */}
          <div className={`grid grid-cols-7 gap-2 transition-opacity duration-300 ${isMonthChanging ? 'opacity-0' : 'opacity-100'}`}>
            {calendarDays.map((day, index) => {
              if (!day) {
                return <div key={`empty-${index}`} className="h-12"></div>;
              }
              
              const isCurrentDay = isToday(day);
              const isSelectedDay = isSelected(day);
              const isPast = isPastDate(day);
              
              return (
                <div 
                  key={`day-${day.getDate()}`} 
                  className={`
                    h-12 flex items-center justify-center rounded-lg relative
                    text-base font-medium transition-all duration-200 transform
                    ${isSelectedDay 
                      ? 'bg-gradient-to-br from-primary to-primary-dark text-white shadow-md scale-105 z-10' 
                      : isCurrentDay 
                        ? 'bg-primary/10 text-primary border border-primary/30 shadow-sm' 
                        : isPast
                          ? 'text-text-tertiary bg-divider/30 cursor-not-allowed'
                          : 'text-text-primary hover:bg-primary/5 hover:border hover:border-primary/30 hover:shadow-sm cursor-pointer hover:-translate-y-0.5'
                    }
                  `}
                  onClick={() => !isPast && handleDateSelection(day)}
                >
                  <span className={`transition-transform duration-150 ${isSelectedDay ? 'scale-110' : ''}`}>
                    {day.getDate()}
                  </span>
                  
                  {/* Current day indicator */}
                  {isCurrentDay && (
                    <span className="absolute w-1.5 h-1.5 bg-primary rounded-full -bottom-1 animate-pulse"></span>
                  )}
                  
                  {/* Selected day glow effect */}
                  {isSelectedDay && (
                    <span className="absolute inset-0 rounded-lg bg-primary opacity-20 animate-pulse-subtle"></span>
                  )}
                </div>
              );
            })}
          </div>
          
          {/* Date selection instruction */}
          <div className="mt-6 pt-4 border-t border-divider/60 text-text-secondary text-sm flex items-center bg-panel/20 p-3 rounded-lg">
            <svg className="w-5 h-5 mr-2 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Select an available date to see available time slots</span>
          </div>
        </div>
      </div>
      
      {/* Time slots column */}
      <div className="md:col-span-2">
        <div className="bg-surface rounded-xl shadow-md border border-divider p-6 h-full flex flex-col relative backdrop-blur-sm bg-white/90">
          {/* Subtle decoration elements */}
          <div className="absolute -top-10 -left-10 w-20 h-20 bg-secondary/5 rounded-full blur-xl opacity-70" />
          <div className="absolute -bottom-10 -right-10 w-20 h-20 bg-primary/5 rounded-full blur-xl opacity-70" />
          
          {/* Time slots header with animation */}
          <h3 className="text-xl font-semibold mb-5 pb-3 border-b border-divider/60 text-text-primary flex items-center">
            <div className="w-8 h-8 flex items-center justify-center rounded-full bg-primary/10 text-primary mr-3">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            Available Times
          </h3>
          
          {!selectedDate ? (
            <div className={`flex-grow flex flex-col items-center justify-center text-center p-6 bg-panel/30 rounded-lg border border-divider/40 transition-all duration-500 ease-in-out ${isTimeSlotExpanded ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>
              <div className="w-20 h-20 rounded-full bg-primary/5 flex items-center justify-center mb-4">
                <svg className="w-10 h-10 text-primary opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <p className="text-text-secondary font-medium">
                Please select a date from the calendar to view available appointment times
              </p>
            </div>
          ) : (
            <div className={`flex-grow flex flex-col transition-all duration-500 ease-in-out ${isTimeSlotExpanded ? 'opacity-100 transform-none' : 'opacity-0 translate-y-4'}`}>
              <div className="mb-4 p-4 bg-primary/5 rounded-lg border border-primary/20 flex items-center shadow-sm fade-in-delay-1">
                <svg className="w-5 h-5 mr-3 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="font-medium">{formatSelectedDate(selectedDate)}</span>
              </div>
              
              {/* Morning slots with staggered animation */}
              <div className="fade-in-delay-2">
                <h4 className="font-medium text-text-secondary mb-2 flex items-center">
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center mr-2">
                    <svg className="w-3.5 h-3.5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </div>
                  Morning
                </h4>
                <div className="grid grid-cols-2 gap-2 mb-6">
                  {morningSlots.map((time, index) => {
                    const available = isSlotAvailable(time);
                    return (
                      <div 
                        key={time}
                        className={`
                          p-3 border rounded-lg text-center transition-all duration-200 relative overflow-hidden
                          ${selectedTime === time 
                            ? 'border-primary bg-gradient-to-br from-primary/10 to-primary/5 text-primary font-medium shadow-md' 
                            : available
                              ? 'border-divider hover:border-primary/50 hover:bg-primary/5 cursor-pointer text-text-primary hover:shadow-sm hover:-translate-y-0.5'
                              : 'border-divider bg-divider/20 text-text-tertiary cursor-not-allowed'
                          }
                          fade-in-delay-${index + 1}
                        `}
                        onClick={() => available && onSelectTimeSlot(time)}
                        style={{ animationDelay: `${100 + index * 50}ms` }}
                      >
                        {time}
                        
                        {/* Selected time indicator */}
                        {selectedTime === time && (
                          <svg className="absolute right-2 top-3 w-4 h-4 text-primary" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
              
              {/* Afternoon slots with staggered animation */}
              <div className="fade-in-delay-3">
                <h4 className="font-medium text-text-secondary mb-2 flex items-center">
                  <div className="w-6 h-6 rounded-full bg-secondary/10 flex items-center justify-center mr-2">
                    <svg className="w-3.5 h-3.5 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </div>
                  Afternoon
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  {afternoonSlots.map((time, index) => {
                    const available = isSlotAvailable(time);
                    return (
                      <div 
                        key={time}
                        className={`
                          p-3 border rounded-lg text-center transition-all duration-200 relative overflow-hidden
                          ${selectedTime === time 
                            ? 'border-primary bg-gradient-to-br from-primary/10 to-primary/5 text-primary font-medium shadow-md' 
                            : available
                              ? 'border-divider hover:border-primary/50 hover:bg-primary/5 cursor-pointer text-text-primary hover:shadow-sm hover:-translate-y-0.5'
                              : 'border-divider bg-divider/20 text-text-tertiary cursor-not-allowed'
                          }
                          fade-in-delay-${index + 7}
                        `}
                        onClick={() => available && onSelectTimeSlot(time)}
                        style={{ animationDelay: `${400 + index * 50}ms` }}
                      >
                        {time}
                        
                        {/* Selected time indicator */}
                        {selectedTime === time && (
                          <svg className="absolute right-2 top-3 w-4 h-4 text-primary" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
              
              {/* Enhanced Legend */}
              <div className="mt-6 pt-3 border-t border-divider/60 text-sm flex items-center justify-between fade-in-delay-3">
                <div className="flex items-center px-3 py-1.5 bg-gray-50 rounded-full">
                  <div className="w-3 h-3 bg-divider/50 rounded-full mr-2"></div>
                  <span className="text-text-tertiary">Unavailable</span>
                </div>
                <div className="flex items-center px-3 py-1.5 bg-primary/5 rounded-full">
                  <div className="w-3 h-3 bg-primary/30 border border-primary/50 rounded-full mr-2"></div>
                  <span className="text-primary/70">Selected</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Add custom animations */}
      <style dangerouslySetInnerHTML={{__html: `
        /* Calendar day selection pulse animation */
        @keyframes calendar-day-pulse {
          0% { box-shadow: 0 0 0 0 rgba(25, 118, 210, 0.4); }
          70% { box-shadow: 0 0 0 10px rgba(25, 118, 210, 0); }
          100% { box-shadow: 0 0 0 0 rgba(25, 118, 210, 0); }
        }
        
        .date-selected-pulse {
          animation: calendar-day-pulse 0.8s ease-out;
        }
        
        /* Custom fade-in animations with different delays */
        .fade-in-delay-1 {
          opacity: 0;
          animation: fade-in 0.5s ease-out forwards;
          animation-delay: 0.1s;
        }
        
        .fade-in-delay-2 {
          opacity: 0;
          animation: fade-in 0.5s ease-out forwards;
          animation-delay: 0.2s;
        }
        
        .fade-in-delay-3 {
          opacity: 0;
          animation: fade-in 0.5s ease-out forwards;
          animation-delay: 0.3s;
        }
        
        @keyframes fade-in {
          from { 
            opacity: 0;
            transform: translateY(10px);
          }
          to { 
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}} />
    </div>
  );
}