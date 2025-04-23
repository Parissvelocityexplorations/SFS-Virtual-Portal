import React from 'react';
import { useNavigate } from '@remix-run/react';
import type { MetaFunction } from '@remix-run/node';
import KioskLayout from '~/components/KioskLayout';

export const meta: MetaFunction = () => {
  return [
    { title: "Pass Access Kiosk - Start" },
    { name: "description", content: "Welcome to the Pass Access Kiosk" },
  ];
};

export default function KioskIndex() {
  const navigate = useNavigate();
  
  const handleDbidsChoice = (hasDbids: boolean) => {
    if (hasDbids) {
      navigate('/kiosk/service');
    }
  };
  
  return (
    <KioskLayout 
      currentStep={0} 
      title="Welcome to the Pass Access Kiosk"
      showBackButton={false}
    >
      <div className="py-8">
        <div className="text-center mb-12">
          <h3 className="text-2xl font-medium text-text-primary mb-2">
            Do you have a DBIDS?
          </h3>
          <p className="text-text-secondary">
            Defense Biometric Identification System (DBIDS) is required for base access
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-xl mx-auto">
          <button 
            onClick={() => handleDbidsChoice(true)}
            className="bg-primary text-white py-4 px-6 rounded-lg text-lg font-medium hover:bg-opacity-90 transition-colors"
          >
            Yes, I have a DBIDS
          </button>
          
          <button 
            onClick={() => handleDbidsChoice(false)}
            className="border-2 border-divider text-text-primary py-4 px-6 rounded-lg text-lg font-medium hover:border-primary transition-colors"
          >
            No, I need to enroll
          </button>
        </div>
        
        {/* DBIDS Enrollment Information - initially hidden */}
        <div id="dbidsInfo" className="mt-10 bg-divider bg-opacity-30 p-6 rounded-lg hidden">
          <h4 className="text-lg font-medium mb-3">DBIDS Pre-Enrollment Information</h4>
          <p className="mb-4">
            To access base facilities, you need to complete the DBIDS pre-enrollment process:
          </p>
          <ol className="list-decimal pl-5 space-y-2 mb-4">
            <li>Visit the official DBIDS Pre-Enrollment Site</li>
            <li>Complete the required forms with your personal information</li>
            <li>Submit the application and print your confirmation</li>
            <li>Bring your confirmation and valid ID to the Visitor Center</li>
          </ol>
          <a 
            href="https://dbids-enrollment.example.gov" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-block bg-secondary text-white py-2 px-4 rounded-md hover:bg-opacity-90 transition-colors"
          >
            Go to DBIDS Pre-Enrollment Site
          </a>
        </div>
      </div>
      
      {/* Add JavaScript to show/hide DBIDS info when "No" is clicked */}
      <script dangerouslySetInnerHTML={{
        __html: `
          document.addEventListener('DOMContentLoaded', () => {
            const noButton = document.querySelectorAll('button')[1];
            const dbidsInfo = document.getElementById('dbidsInfo');
            
            noButton.addEventListener('click', () => {
              dbidsInfo.classList.remove('hidden');
              window.scrollTo({
                top: dbidsInfo.offsetTop - 20,
                behavior: 'smooth'
              });
            });
          });
        `
      }} />
    </KioskLayout>
  );
}