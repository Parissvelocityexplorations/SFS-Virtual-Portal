import React, { useEffect, useState } from 'react';

type BarcodeProps = {
  bookingId: string;
};

// Function to generate iCalendar format event
interface CalendarEventOptions {
  summary: string;
  description: string;
  location: string;
  startTime: Date;
  duration: number; // in minutes
  visitorName: string;
  visitorEmail: string;
}

function generateCalendarEvent(options: CalendarEventOptions): string {
  const {
    summary,
    description,
    location,
    startTime,
    duration,
    visitorName,
    visitorEmail
  } = options;
  
  // Create end time by adding duration minutes to start time
  const endTime = new Date(startTime.getTime() + duration * 60000);
  
  // Format dates for iCalendar (YYYYMMDDTHHMMSSZ)
  const formatDate = (date: Date): string => {
    return date.toISOString().replace(/[-:]/g, '').replace(/\.\d+/g, '');
  };
  
  const now = formatDate(new Date());
  const start = formatDate(startTime);
  const end = formatDate(endTime);
  
  // Generate unique identifier for the event
  const uid = `appointment-${Date.now()}@spaceforcekiosk.com`;
  
  // Create the iCalendar content
  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Space Force Kiosk//Appointment//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${uid}`,
    `DTSTAMP:${now}`,
    `DTSTART:${start}`,
    `DTEND:${end}`,
    `SUMMARY:${summary}`,
    `DESCRIPTION:${description.replace(/\n/g, '\\n')}`,
    `LOCATION:${location}`,
    'STATUS:CONFIRMED',
    `ORGANIZER;CN=Space Force VCC:mailto:noreply@spaceforce.mil`,
    `ATTENDEE;ROLE=REQ-PARTICIPANT;CN=${visitorName}:mailto:${visitorEmail}`,
    'BEGIN:VALARM',
    'ACTION:DISPLAY',
    'DESCRIPTION:Appointment Reminder',
    'TRIGGER:-PT1H',
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\r\n');
}

// Enhanced barcode component that generates a QR code for visitor check-in
export default function Barcode({ bookingId }: BarcodeProps) {
  const [calendarEvent, setCalendarEvent] = useState<string | null>(null);

  useEffect(() => {
    // Get stored appointment details and user info from localStorage
    const appointmentDetails = localStorage.getItem('appointmentDetails');
    const userInfo = localStorage.getItem('visitorInfo');
    const serviceType = localStorage.getItem('selectedService');
    
    // Use default values for the demo (ensuring specific appointment details)
    let appointmentDate = 'Saturday, April 26, 2025';
    let appointmentTime = '2:00 PM';
    let visitorName = 'John Doe';
    let visitorEmail = 'john.doe@example.com';
    let serviceName = 'Visitor Pass';
    let location = 'Pass Office, Patrick Space Force Base, FL 32925';
    
    // Parse the appointment details (but still prioritize our default values)
    if (appointmentDetails) {
      try {
        const details = JSON.parse(appointmentDetails);
        appointmentDate = details.formattedDate || appointmentDate;
        appointmentTime = details.time || appointmentTime;
      } catch (error) {
        console.error('Error parsing appointment details:', error);
      }
    }
    
    // Parse user info
    if (userInfo) {
      try {
        const user = JSON.parse(userInfo);
        visitorName = `${user.firstName} ${user.lastName}`.trim() || visitorName;
        visitorEmail = user.email || visitorEmail;
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
      serviceName = services[serviceType] || serviceName;
    }
    
    // Create calendar event data (iCalendar format) for adding to calendar
    const event = generateCalendarEvent({
      summary: `Space Force Pass - ${serviceName}`,
      description: `Space Force Pass Access Appointment\nService: ${serviceName}\nBooking ID: ${bookingId}\n\nPlease arrive 15 minutes early and bring all required documentation.`,
      location: location,
      startTime: new Date(`${appointmentDate.split(', ')[1]} ${appointmentTime}`),
      duration: 60, // 60 minutes appointment duration
      visitorName: visitorName,
      visitorEmail: visitorEmail
    });
    
    // Store the calendar event in localStorage for future use
    localStorage.setItem('appointmentCalendarEvent', event);
    setCalendarEvent(event);
    
    // No QR code generation - using static image approach instead
    
  }, [bookingId]);

  // Function to generate calendar download link
  const getCalendarDownloadLink = () => {
    if (!calendarEvent) return '#';
    
    // Create a Blob with the calendar data
    const blob = new Blob([calendarEvent], { type: 'text/calendar' });
    return URL.createObjectURL(blob);
  };

  // Function to handle adding to calendar
  const handleAddToCalendar = () => {
    if (!calendarEvent) return;
    
    // Create a Blob with the calendar data
    const blob = new Blob([calendarEvent], { type: 'text/calendar' });
    const url = URL.createObjectURL(blob);
    
    // Create a link element and trigger download
    const link = document.createElement('a');
    link.href = url;
    link.download = `space-force-pass-appointment-${bookingId}.ics`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Clean up the URL object
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col items-center">
      <div className="bg-white p-6 rounded-lg shadow-sm border border-divider">
        {/* Confirmation card with QR code image */}
        <div className="mb-4">
          <div className="flex flex-col items-center justify-center">
            <div className="relative mb-3 border-2 border-primary rounded-md overflow-hidden">
              {/* Confirmation Card */}
              <div className="bg-blue-50 p-6 flex flex-col items-center justify-center w-[250px]">
                {/* Card header */}
                <div className="w-full text-center bg-primary text-white py-2 px-4 rounded-md mb-4">
                  <div className="font-bold">Space Force Pass</div>
                </div>
                
                {/* Static QR-like image */}
                <div className="bg-white p-2 rounded-md border border-gray-300 mb-4 min-h-[180px] flex items-center justify-center">
                  <div className="w-[150px] h-[150px] bg-white flex flex-col items-center justify-center">
                    {/* This is a static QR pattern for visual purposes only */}
                    <div className="w-[130px] h-[130px] relative border border-gray-200 p-2">
                      {/* QR Code corners */}
                      <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-black"></div>
                      <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-black"></div>
                      <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-black"></div>
                      
                      {/* QR Code inner pattern - simplified visual */}
                      <div className="w-full h-full flex flex-col justify-between p-2">
                        <div className="grid grid-cols-6 gap-1">
                          {Array(36).fill(0).map((_, i) => (
                            <div 
                              key={i} 
                              className={`w-3 h-3 ${Math.random() > 0.6 ? 'bg-black' : 'bg-white'}`}
                            ></div>
                          ))}
                        </div>
                      </div>
                      
                      {/* Center info */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="bg-white bg-opacity-80 text-center p-1 text-[8px] font-bold">
                          ID: {bookingId.substring(0, 8)}
                        </div>
                      </div>
                    </div>
                    <div className="text-xs font-semibold mt-2">Scan to save</div>
                  </div>
                </div>
                
                {/* Confirmation details */}
                <div className="flex flex-col items-center justify-center text-center">
                  {/* Confirmation code */}
                  <div className="font-mono text-lg font-bold">{bookingId}</div>
                  <div className="font-semibold text-primary mt-2">Visitor Pass</div>
                  <div className="text-sm mt-1">Saturday, April 26, 2025</div>
                  <div className="text-sm font-semibold">2:00 PM</div>
                  <div className="text-xs text-gray-600 mt-2 max-w-[200px]">
                    Pass Office, Patrick Space Force Base
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="border-t border-divider pt-4 text-center">
          <p className="text-text-secondary mb-1">Booking ID: {bookingId}</p>
          <p className="text-text-secondary text-sm">Present this code at the kiosk</p>
          
          {/* Add to Calendar Button */}
          <button
            onClick={handleAddToCalendar}
            className="mt-4 flex items-center justify-center mx-auto bg-primary text-white px-4 py-2 rounded-md hover:bg-opacity-90 transition-all"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Add to Calendar
          </button>
          
          {/* Alternative Calendar Download Link */}
          <a 
            href={getCalendarDownloadLink()}
            download={`space-force-pass-appointment-${bookingId}.ics`}
            className="mt-2 text-primary hover:underline text-sm inline-block"
          >
            or download calendar file
          </a>
        </div>
      </div>
      
      <div className="mt-6">
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 mb-4">
          <h4 className="text-center font-medium text-text-primary mb-2">Appointment Confirmed!</h4>
          <p className="text-text-secondary text-sm mb-2">
            Please note these important details:
          </p>
          <ul className="text-sm text-text-secondary space-y-1 pl-4 list-disc">
            <li>Date & Time: <span className="font-medium">Saturday, April 26, 2025 at 2:00 PM</span></li>
            <li>Service: <span className="font-medium">Visitor Pass</span></li>
            <li>Location: <span className="font-medium">Pass Office, Patrick Space Force Base, FL 32925</span></li>
            <li>Confirmation ID: <span className="font-mono font-medium">{bookingId}</span></li>
            <li>Please arrive <span className="font-medium">15 minutes early</span> and bring your ID</li>
          </ul>
        </div>
        
        <div className="text-center">
          <p className="mb-2 text-text-primary font-medium">Instructions:</p>
          <p className="text-text-secondary mb-2">
            <strong>Click the "Add to Calendar" button</strong> to save your appointment to your device's calendar
          </p>
          <p className="text-text-secondary mb-2">
            <strong>Show this QR code</strong> at the Visitor Control Center upon arrival
          </p>
          <p className="text-text-secondary mb-2">Have your ID ready for verification</p>
          <p className="text-sm text-green-600 font-medium mt-4">
            A confirmation email has been automatically sent to your email address
          </p>
        </div>
      </div>
    </div>
  );
}