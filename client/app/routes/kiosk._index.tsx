import React, { useState } from 'react';
import { useNavigate } from '@remix-run/react';
import type { MetaFunction } from '@remix-run/node';
import KioskLayout from '~/components/KioskLayout';

export const meta: MetaFunction = () => {
  return [
    { title: "Appointment Portal - Start" },
    { name: "description", content: "Welcome to the Space Force Appointment Portal" },
  ];
};

export default function KioskIndex() {
  const navigate = useNavigate();
  const [showDbidsInfo, setShowDbidsInfo] = useState(false);
  
  const handleDbidsChoice = (hasDbids: boolean) => {
    if (hasDbids) {
      // Clear any previous stored data
      localStorage.removeItem('visitorInfo');
      localStorage.removeItem('selectedService');
      
      // Navigate to the information page (first step)
      navigate('/kiosk/service');
    } else {
      setShowDbidsInfo(true);
      // Small delay for smooth scrolling after state update
      setTimeout(() => {
        const dbidsInfoElement = document.getElementById('dbidsInfo');
        if (dbidsInfoElement) {
          window.scrollTo({
            top: dbidsInfoElement.offsetTop - 20,
            behavior: 'smooth'
          });
        }
      }, 100);
    }
  };
  
  return (
    <KioskLayout 
      currentStep={0} 
      title="Welcome to the Appointment Portal"
      showBackButton={false}
    >
      <div className="py-8">
        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold text-text-primary mb-4">
            Do you have a DBIDS card?
          </h3>
          <p className="text-text-secondary text-lg max-w-2xl mx-auto">
            A Defense Biometric Identification System (DBIDS) card is required for base access.
            Please select an option below to continue.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl mx-auto mb-10">
          <button 
            onClick={() => handleDbidsChoice(true)}
            className="bg-primary text-white py-6 px-8 rounded-lg text-xl font-medium 
                      hover:bg-opacity-90 transition-all duration-300 transform hover:-translate-y-1 
                      shadow-md hover:shadow-lg flex flex-col items-center justify-center"
            aria-label="Yes, I have a DBIDS card"
          >
            <svg className="w-12 h-12 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span>Yes, I have a DBIDS card</span>
          </button>
          
          <button 
            onClick={() => handleDbidsChoice(false)}
            className="border-2 border-divider text-text-primary py-6 px-8 rounded-lg text-xl font-medium 
                       hover:border-primary transition-all duration-300 transform hover:-translate-y-1 
                       shadow-sm hover:shadow-md flex flex-col items-center justify-center"
            aria-label="No, I need to enroll"
          >
            <svg className="w-12 h-12 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>No, I need to enroll</span>
          </button>
        </div>
        
        {/* DBIDS Enrollment Information - conditionally shown */}
        <div 
          id="dbidsInfo" 
          className={`mt-10 bg-blue-50 p-8 rounded-lg border-l-4 border-primary transition-all duration-500 ease-in-out ${showDbidsInfo ? 'opacity-100 transform-none' : 'opacity-0 scale-95 hidden'}`}
        >
          <h4 className="text-2xl font-bold mb-4 text-text-primary">DBIDS Pre-Enrollment Instructions</h4>
          
          <div className="bg-white rounded-lg p-6 shadow-md mb-6">
            <p className="text-lg mb-4">
              To access base facilities, you need to complete the DBIDS pre-enrollment process through the official website:
            </p>
            
            <ol className="list-decimal pl-5 space-y-4 mb-6 text-text-primary">
              <li className="text-lg">Visit the <span className="font-medium">official DBIDS Global Pre-Enrollment Website</span></li>
              <li className="text-lg">Complete all required forms with your personal information</li>
              <li className="text-lg">Submit your application and <span className="font-medium">print your confirmation</span></li>
              <li className="text-lg">Bring your confirmation and a valid government ID to the Visitor Center</li>
            </ol>
            
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-yellow-700">
                    Pre-enrollment does not guarantee base access. All applications are subject to approval.
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="text-center">
            <a 
              href="https://dbids-global-enroll.dmdc.mil/preenrollui/#/landing-page" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center px-6 py-3 border border-transparent text-lg font-medium rounded-md shadow-sm text-white bg-secondary hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary transition-all"
              aria-label="Go to DBIDS Pre-Enrollment Site"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              Go to DBIDS Pre-Enrollment Site
            </a>
          </div>
        </div>
      </div>
    </KioskLayout>
  );
}