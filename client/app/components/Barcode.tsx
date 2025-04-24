import React, { useEffect, useState } from 'react';

type BarcodeProps = {
  bookingId: string;
};

// Enhanced barcode component that generates a QR code for visitor check-in
export default function Barcode({ bookingId }: BarcodeProps) {
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);

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
    let location = 'Patrick Space Force Base, FL 32925';
    
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
    
    // In a real implementation, we would use a proper QR code library
    // For now, we'll use a placeholder image URL based on the booking ID
    // This would be replaced with a real QR code generation in production
    const qrCodeData = encodeURIComponent(JSON.stringify(qrData));
    
    // Generate a dynamic QR code URL using a service like QR Code Generator
    // For this example, we'll simulate it with a placeholder
    setQrCodeUrl(`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${qrCodeData}`);
  }, [bookingId]);

  return (
    <div className="flex flex-col items-center">
      <div className="bg-white p-6 rounded-lg shadow-sm border border-divider">
        {/* Real QR code with download functionality */}
        <div className="mb-4">
          <div className="flex flex-col items-center justify-center">
            {qrCodeUrl ? (
              <div className="relative group">
                <a 
                  href={qrCodeUrl} 
                  download={`space-force-pass-${bookingId}.png`}
                  title="Click to download QR code"
                >
                  <img 
                    src={qrCodeUrl} 
                    alt="Check-in QR Code" 
                    className="h-48 w-48 mb-3 cursor-pointer hover:shadow-lg transition-all" 
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white opacity-0 group-hover:opacity-100 transition-opacity rounded-md">
                    <div className="text-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mx-auto mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                      <span className="text-sm">Save to Device</span>
                    </div>
                  </div>
                </a>
              </div>
            ) : (
              // Fallback while loading
              <div className="h-48 w-48 bg-gray-200 rounded-lg mb-3 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              </div>
            )}
            <div className="font-mono text-sm font-bold">{bookingId}</div>
          </div>
        </div>
        
        <div className="border-t border-divider pt-4 text-center">
          <p className="text-text-secondary mb-1">Booking ID: {bookingId}</p>
          <p className="text-text-secondary text-sm">Present this code at the kiosk</p>
        </div>
      </div>
      
      <div className="mt-6">
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 mb-4">
          <h4 className="text-center font-medium text-text-primary mb-2">QR Code Information</h4>
          <p className="text-text-secondary text-sm mb-2">
            This QR code contains your appointment details and will display the following when scanned:
          </p>
          <ul className="text-sm text-text-secondary space-y-1 pl-4 list-disc">
            <li>Appointment: <span className="font-medium">Saturday, April 26, 2025 at 2:00 PM</span></li>
            <li>Service: <span className="font-medium">Visitor Pass</span></li>
            <li>Location: <span className="font-medium">Patrick Space Force Base, FL 32925</span></li>
            <li>Confirmation ID: <span className="font-mono font-medium">{bookingId}</span></li>
          </ul>
        </div>
        
        <div className="text-center">
          <p className="mb-2 text-text-primary font-medium">Instructions:</p>
          <p className="text-text-secondary mb-2">
            <strong>Click/tap on the QR code above to save it</strong> to your device
          </p>
          <p className="text-text-secondary mb-2">Alternatively, you can take a screenshot or print this page</p>
          <p className="text-text-secondary mb-2">Present this QR code at the kiosk on your arrival date</p>
          <p className="text-sm text-green-600 font-medium mt-4">
            A confirmation email has been automatically sent to your email address
          </p>
        </div>
      </div>
    </div>
  );
}