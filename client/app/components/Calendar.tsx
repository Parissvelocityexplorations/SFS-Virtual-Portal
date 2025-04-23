import React, { useState } from 'react';

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
  
  // Time slots
  const timeSlots = [
    "9:00 AM", "9:30 AM", "10:00 AM", "10:30 AM", 
    "11:00 AM", "11:30 AM", "1:00 PM", "1:30 PM", 
    "2:00 PM", "2:30 PM", "3:00 PM", "3:30 PM"
  ];
  
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
  
  // Check if date is today
  const isToday = (date: Date) => {
    const today = new Date();
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
  
  // Days of the week
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Calendar */}
      <div className="bg-surface rounded-lg shadow-sm border border-divider p-4">
        <div className="flex justify-between items-center mb-4">
          <button 
            onClick={prevMonth}
            className="p-2 rounded-full hover:bg-background"
          >
            &lt;
          </button>
          <h3 className="text-lg font-medium">{formatDate(currentMonth)}</h3>
          <button 
            onClick={nextMonth}
            className="p-2 rounded-full hover:bg-background"
          >
            &gt;
          </button>
        </div>
        
        {/* Days of week */}
        <div className="grid grid-cols-7 mb-2">
          {weekDays.map(day => (
            <div key={day} className="text-center text-text-secondary text-sm py-2">
              {day}
            </div>
          ))}
        </div>
        
        {/* Calendar grid */}
        <div className="grid grid-cols-7 gap-1">
          {calendarDays.map((day, index) => {
            if (!day) {
              return <div key={`empty-${index}`} className="h-10"></div>;
            }
            
            const isCurrentDay = isToday(day);
            const isSelectedDay = isSelected(day);
            
            return (
              <div 
                key={`day-${day.getDate()}`} 
                className={`h-10 flex items-center justify-center rounded-md cursor-pointer 
                  ${isSelectedDay ? 'bg-primary text-white' : 
                    isCurrentDay ? 'bg-primary bg-opacity-10 text-primary' : 
                    'hover:bg-background'}
                `}
                onClick={() => onSelectDate(day)}
              >
                {day.getDate()}
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Time slots */}
      <div className="bg-surface rounded-lg shadow-sm border border-divider p-4">
        <h3 className="text-lg font-medium mb-4">Available Time Slots</h3>
        
        {!selectedDate ? (
          <p className="text-text-secondary">Please select a date first</p>
        ) : (
          <div className="grid grid-cols-2 gap-2">
            {timeSlots.map(time => (
              <div 
                key={time}
                className={`p-3 border rounded-md text-center cursor-pointer
                  ${selectedTime === time ? 
                    'border-primary bg-primary bg-opacity-5 text-primary' : 
                    'border-divider hover:border-primary'
                  }
                `}
                onClick={() => onSelectTimeSlot(time)}
              >
                {time}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}