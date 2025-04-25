import React, { useEffect, useState, useRef } from 'react';

type BarcodeProps = {
  bookingId: string;
};

// Enhanced barcode component that generates a QR code for visitor check-in
export default function Barcode({ bookingId }: BarcodeProps) {
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);
  const [isQrLoaded, setIsQrLoaded] = useState(false);
  const [appointmentDetails, setAppointmentDetails] = useState({
    date: 'Saturday, April 26, 2025',
    time: '2:00 PM',
    service: 'Visitor Pass',
    location: 'Patrick Space Force Base, FL 32925'
  });
  const [visitorDetails, setVisitorDetails] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com'
  });
  
  // Animation references
  const qrCodeRef = useRef<HTMLDivElement>(null);
  const borderAnimation = useRef<number | null>(null);
  
  // Start scanning border animation
  const startBorderAnimation = () => {
    if (!qrCodeRef.current) return;
    
    let start = 0;
    const element = qrCodeRef.current;
    const duration = 3000; // 3 seconds for a full cycle
    
    const animate = (timestamp: number) => {
      if (!start) start = timestamp;
      const elapsed = timestamp - start;
      const progress = (elapsed % duration) / duration;
      
      // Calculate position for the scanning effect
      const scanPosition = Math.floor(progress * 100);
      
      // Apply the scanning line effect
      element.style.setProperty('--scan-position', `${scanPosition}%`);
      
      // Continue animation
      borderAnimation.current = requestAnimationFrame(animate);
    };
    
    // Start the animation
    borderAnimation.current = requestAnimationFrame(animate);
  };
  
  // Stop the animation when component unmounts
  useEffect(() => {
    return () => {
      if (borderAnimation.current) {
        cancelAnimationFrame(borderAnimation.current);
      }
    };
  }, []);

  useEffect(() => {
    // Get stored appointment details and user info from localStorage
    const storedAppointmentDetails = localStorage.getItem('appointmentDetails');
    const userInfo = localStorage.getItem('visitorInfo');
    const serviceType = localStorage.getItem('selectedService');
    
    // Use default values for the demo (ensuring specific appointment details)
    let appointmentDate = 'Saturday, April 26, 2025';
    let appointmentTime = '2:00 PM';
    let visitorName = 'John Doe';
    let visitorEmail = 'john.doe@example.com';
    let serviceName = 'Visitor Pass';
    let location = 'Patrick Space Force Base, FL 32925';
    
    // Parse the appointment details
    if (storedAppointmentDetails) {
      try {
        const details = JSON.parse(storedAppointmentDetails);
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
        
        setVisitorDetails({
          name: visitorName,
          email: visitorEmail
        });
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
    
    // Update appointment details state
    setAppointmentDetails({
      date: appointmentDate,
      time: appointmentTime,
      service: serviceName,
      location: location
    });
    
    // Generate QR code data with all appointment details
    const qrData = {
      id: bookingId,
      type: "visitor-checkin",
      timestamp: new Date().toISOString(),
      appointment: {
        date: appointmentDate,
        time: appointmentTime,
        service: serviceName,
        location: location
      },
      visitor: {
        name: visitorName,
        email: visitorEmail
      },
      vcc: {
        address: "Patrick Space Force Base, FL 32925",
        hours: "7:30 a.m. to 3 p.m. (Closed Sat & Sun)",
        website: "https://www.patrick.spaceforce.mil/Visitors-Control-Center/",
        mapUrl: "https://maps.app.goo.gl/Pxsf9AWEoANBALWL8"
      }
    };
    
    // Generate QR code URL
    const qrCodeData = encodeURIComponent(JSON.stringify(qrData));
    setQrCodeUrl(`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${qrCodeData}`);
    
    // Simulate loading time for demo purposes
    setTimeout(() => {
      setIsQrLoaded(true);
      // Start animation after QR is loaded
      startBorderAnimation();
    }, 800);
  }, [bookingId]);

  // Handle QR code download
  const handleDownload = () => {
    if (qrCodeUrl) {
      // Create a temporary link to trigger download
      const link = document.createElement('a');
      link.href = qrCodeUrl;
      link.download = `space-force-pass-${bookingId}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="flex flex-col items-center fade-in">
      {/* QR Code Card with enhanced visual styling */}
      <div 
        className="sf-panel p-6 max-w-md mx-auto backdrop-blur-sm bg-white/90 relative"
      >
        {/* Dynamic corners for military style */}
        <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-primary"></div>
        <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-primary"></div>
        <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-primary"></div>
        <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-primary"></div>
        
        {/* Space Force insignia watermark */}
        <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
          <svg className="w-64 h-64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12 2L2 12L12 22L22 12L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12 2V22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M2 12H22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        
        {/* Header */}
        <div className="text-center mb-4">
          <h3 className="text-xl font-bold bg-gradient-to-r from-primary to-primary-dark bg-clip-text text-transparent">Space Force Base Access Pass</h3>
          <div className="flex items-center justify-center mt-1">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-green-100 text-green-800 text-xs font-medium">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-1.5"></span>
              Verified
            </span>
          </div>
        </div>
        
        {/* QR Code Container with animated scanning effect */}
        <div 
          ref={qrCodeRef}
          className={`qr-code-container mx-auto relative ${isQrLoaded ? 'is-active' : ''}`}
        >
          <div onClick={handleDownload} className="cursor-pointer bg-white p-3 rounded-lg border-2 border-primary/30 shadow-md hover:shadow-lg transition-all duration-300 relative overflow-hidden group">
            {qrCodeUrl && isQrLoaded ? (
              <>
                <img 
                  src={qrCodeUrl} 
                  alt="Check-in QR Code" 
                  className="h-52 w-52 mx-auto transform group-hover:scale-105 transition-transform duration-300" 
                  onLoad={() => setIsQrLoaded(true)}
                />
                
                {/* Scanning line effect - styled via CSS */}
                <div className="scan-line"></div>
                
                {/* Download overlay */}
                <div className="absolute inset-0 bg-primary/80 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  <span className="font-medium">Download Pass</span>
                </div>
              </>
            ) : (
              // Loading animation
              <div className="h-52 w-52 mx-auto flex flex-col items-center justify-center">
                <div className="w-12 h-12 relative">
                  <div className="absolute inset-0 rounded-full border-4 border-primary/20"></div>
                  <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-primary animate-spin"></div>
                </div>
                <p className="mt-4 text-text-secondary">Generating Pass...</p>
              </div>
            )}
          </div>
          
          {/* ID Code */}
          <div className="text-center mt-4 font-mono text-sm tracking-wider bg-gray-100 py-2 px-4 rounded-lg border border-divider/60 shadow-sm">
            {bookingId}
          </div>
        </div>
        
        {/* Instructions */}
        <div className="mt-5 text-center">
          <div className="inline-flex items-center justify-center space-x-1 text-primary">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M13 16H12V12H11M12 8H12.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className="font-medium text-sm">Present this code at the kiosk</span>
          </div>
        </div>
      </div>
      
      {/* Details Section */}
      <div className="mt-8 w-full max-w-lg fade-in-delay-1">
        {/* Appointment Details */}
        <div className="mb-6 space-pattern rounded-xl overflow-hidden shadow-md border border-divider/60">
          <div className="bg-white/90 backdrop-blur-sm p-5">
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                <svg className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h4 className="text-lg font-bold text-text-primary">Appointment Details</h4>
            </div>
            
            <div className="space-y-2 ml-11">
              <div className="flex">
                <div className="w-24 text-text-secondary text-sm">Date:</div>
                <div className="font-medium text-text-primary">{appointmentDetails.date}</div>
              </div>
              <div className="flex">
                <div className="w-24 text-text-secondary text-sm">Time:</div>
                <div className="font-medium text-text-primary">{appointmentDetails.time}</div>
              </div>
              <div className="flex">
                <div className="w-24 text-text-secondary text-sm">Service:</div>
                <div className="font-medium text-text-primary">{appointmentDetails.service}</div>
              </div>
              <div className="flex">
                <div className="w-24 text-text-secondary text-sm">Location:</div>
                <div className="font-medium text-text-primary">{appointmentDetails.location}</div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Important Information */}
        <div className="mb-6 bg-blue-50 rounded-xl overflow-hidden shadow-md border border-blue-100 fade-in-delay-2">
          <div className="bg-blue-500 text-white px-5 py-2 flex items-center">
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M13 16H12V12H11M12 8H12.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className="font-semibold">Important Information</span>
          </div>
          <div className="p-5">
            <ul className="space-y-2">
              <li className="flex items-start">
                <svg className="w-5 h-5 text-blue-500 mr-2 mt-0.5 flex-shrink-0" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span>Bring a valid government-issued photo ID with you</span>
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 text-blue-500 mr-2 mt-0.5 flex-shrink-0" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span>Arrive 15 minutes before your scheduled appointment time</span>
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 text-blue-500 mr-2 mt-0.5 flex-shrink-0" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span>Save this QR code to your device by tapping on it</span>
              </li>
            </ul>
            
            <div className="mt-4 text-center">
              <button onClick={handleDownload} className="btn-primary inline-flex items-center px-4 py-2 rounded-lg">
                <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M4 16V17C4 18.6569 5.34315 20 7 20H17C18.6569 20 20 18.6569 20 17V16M16 12L12 16M12 16L8 12M12 16V4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Download QR Code
              </button>
            </div>
          </div>
        </div>
        
        {/* Confirmation Notice */}
        <div className="text-center p-4 bg-green-50 rounded-xl border border-green-100 fade-in-delay-3">
          <div className="flex items-center justify-center mb-1">
            <svg className="w-5 h-5 text-green-500 mr-1.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className="font-medium text-green-700">Confirmation Email Sent</span>
          </div>
          <p className="text-sm text-green-600">
            A confirmation email has been sent to <span className="font-medium">{visitorDetails.email}</span>
          </p>
        </div>
      </div>
      
      {/* Custom styling for QR code scanning effect */}
      <style jsx>{`
        .qr-code-container {
          position: relative;
          padding: 0.5rem;
        }
        
        .qr-code-container.is-active::before,
        .qr-code-container.is-active::after {
          content: '';
          position: absolute;
          width: 16px;
          height: 16px;
          border-color: var(--color-primary);
          opacity: 0.7;
        }
        
        .qr-code-container.is-active::before {
          top: 0;
          left: 0;
          border-top: 3px solid;
          border-left: 3px solid;
        }
        
        .qr-code-container.is-active::after {
          bottom: 0;
          right: 0;
          border-bottom: 3px solid;
          border-right: 3px solid;
        }
        
        /* Animated scanning line */
        .scan-line {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 3px;
          background: linear-gradient(90deg, 
            rgba(25, 118, 210, 0) 0%, 
            rgba(25, 118, 210, 0.8) 50%, 
            rgba(25, 118, 210, 0) 100%);
          opacity: 0.7;
          animation: scan-animation 3s ease-in-out infinite;
          z-index: 10;
        }
        
        @keyframes scan-animation {
          0% { top: 0; opacity: 0.7; }
          50% { top: 100%; opacity: 0.9; }
          50.1% { top: 100%; opacity: 0; }
          50.2% { top: 0; opacity: 0; }
          51% { top: 0; opacity: 0.7; }
          100% { top: 0; opacity: 0.7; }
        }
      `}</style>
    </div>
  );
}