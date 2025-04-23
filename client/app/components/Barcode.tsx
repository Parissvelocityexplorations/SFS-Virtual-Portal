import React from 'react';

type BarcodeProps = {
  bookingId: string;
};

// This is a mock barcode component - in a real app, you'd use a proper barcode library
export default function Barcode({ bookingId }: BarcodeProps) {
  return (
    <div className="flex flex-col items-center">
      <div className="bg-white p-6 rounded-lg shadow-sm border border-divider">
        {/* Mock barcode */}
        <div className="mb-4">
          <div className="flex flex-col items-center justify-center">
            <div className="h-40 w-80 bg-black rounded-lg mb-2 relative overflow-hidden">
              {/* Create fake barcode lines */}
              {Array.from({ length: 30 }).map((_, i) => (
                <div 
                  key={i}
                  className="absolute bg-white" 
                  style={{
                    left: `${(i * 3) + 2}%`,
                    top: '10%',
                    bottom: '10%',
                    width: `${Math.random() * 1.5}%`
                  }}
                />
              ))}
            </div>
            <div className="font-mono text-sm">{bookingId}</div>
          </div>
        </div>
        
        <div className="border-t border-divider pt-4 text-center">
          <p className="text-text-secondary mb-1">Booking ID: {bookingId}</p>
          <p className="text-text-secondary text-sm">Present this code at the kiosk</p>
        </div>
      </div>
      
      <div className="mt-6 text-center">
        <p className="mb-2 text-text-primary font-medium">Instructions:</p>
        <p className="text-text-secondary mb-2">Take a screenshot of this barcode or print it</p>
        <p className="text-text-secondary">Scan this at the kiosk on your arrival date</p>
      </div>
    </div>
  );
}