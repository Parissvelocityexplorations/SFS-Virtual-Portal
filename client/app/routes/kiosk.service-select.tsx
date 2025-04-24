import React, { useState, useEffect } from 'react';
import { useNavigate } from '@remix-run/react';
import type { MetaFunction } from '@remix-run/node';
import KioskLayout from '~/components/KioskLayout';
import ServiceCard from '~/components/ServiceCard';

export const meta: MetaFunction = () => {
  return [
    { title: "Pass Access Kiosk - Service Selection" },
    { name: "description", content: "Select a service at the Pass Access Kiosk" },
  ];
};

type Service = {
  id: string;
  title: string;
  icon: string;
  iconSvg?: React.ReactNode;
  description: string;
};

export default function ServiceSelection() {
  const navigate = useNavigate();
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [userData, setUserData] = useState({
    firstName: '',
    lastName: ''
  });
  
  // Load user data when component mounts
  useEffect(() => {
    const storedUserData = localStorage.getItem('visitorInfo');
    if (storedUserData) {
      try {
        const parsedData = JSON.parse(storedUserData);
        setUserData({
          firstName: parsedData.firstName || '',
          lastName: parsedData.lastName || ''
        });
      } catch (e) {
        console.error('Error parsing user data:', e);
      }
    } else {
      // If no user data, redirect back to information page
      navigate('/kiosk/service');
    }
  }, [navigate]);

  const services: Service[] = [
    {
      id: 'golf',
      title: 'Golf Pass',
      icon: '⛳',
      iconSvg: (
        <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 18V12M12 12L17 7M12 12L7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <circle cx="12" cy="21" r="1" stroke="currentColor" strokeWidth="2"/>
          <path d="M5 19.5C5 19.5 3 18.5 3 16.5C3 14.5 5 13.5 5 13.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M19 19.5C19 19.5 21 18.5 21 16.5C21 14.5 19 13.5 19 13.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M12 4V6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      description: 'Access pass for the golf course and related facilities.'
    },
    {
      id: 'visitor',
      title: 'Visitor Pass',
      icon: '🏙️',
      iconSvg: (
        <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M3 21H21M5 21V7L9 3M9 21V11M13 21V11M17 21V7M9 7H13M17 7H13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      description: 'General visitor access to base facilities and common areas.'
    },
    {
      id: 'vhic',
      title: 'Veteran Health ID Card',
      icon: '🏥',
      iconSvg: (
        <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M9 12H15M12 9V15M3.6 8.4C3 9.763 3 11.5 3 15C3 18.5 3 20.25 3.6 21.613C3.719 21.964 3.88 22.3 4.077 22.615C5.055 24 6.764 24 10.182 24H13.818C17.236 24 18.945 24 19.923 22.615C20.12 22.3 20.281 21.964 20.4 21.613C21 20.25 21 18.5 21 15C21 11.5 21 9.763 20.4 8.4C20.281 8.05 20.12 7.7 19.923 7.385C18.945 6 17.236 6 13.818 6H10.182C6.764 6 5.055 6 4.077 7.385C3.88 7.7 3.719 8.05 3.6 8.4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M17.5 2.5L14 6M6.5 2.5L10 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      description: 'Access for veterans with Veteran Health Identification Card.'
    },
    {
      id: 'dbids',
      title: 'DBIDS Card',
      icon: '🪪',
      iconSvg: (
        <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="2"/>
          <circle cx="9" cy="10" r="2" stroke="currentColor" strokeWidth="2"/>
          <path d="M14 9H17" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          <path d="M14 13H17" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          <path d="M6 15C6 14.4477 6.44772 14 7 14H11C11.5523 14 12 14.4477 12 15V16H6V15Z" stroke="currentColor" strokeWidth="2"/>
        </svg>
      ),
      description: 'Defense Biometric Identification System card processing.'
    }
  ];

  const handleServiceClick = (serviceId: string) => {
    setSelectedService(serviceId);
  };

  const handleContinue = () => {
    if (selectedService) {
      // Save the selected service
      localStorage.setItem('selectedService', selectedService);
      navigate('/kiosk/schedule');
    }
  };

  const handleBack = () => {
    navigate('/kiosk/service');
  };

  return (
    <KioskLayout 
      currentStep={2} 
      title="Select a Service"
      onBack={handleBack}
    >
      <div className="bg-white p-8 rounded-lg shadow-md border border-divider mb-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-3 text-text-primary">
            Hello, {userData.firstName}! What service do you need today?
          </h2>
          <p className="text-text-secondary text-lg">
            Please select one of the following pass options based on your needs:
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {services.map((service) => (
            <ServiceCard
              key={service.id}
              title={service.title}
              icon={service.icon}
              iconSvg={service.iconSvg}
              description={service.description}
              onClick={() => handleServiceClick(service.id)}
              selected={selectedService === service.id}
            />
          ))}
        </div>
        
        {!selectedService && (
          <div className="text-amber-600 flex items-center p-4 bg-amber-50 rounded-lg border border-amber-200 mb-6">
            <svg className="w-6 h-6 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <span className="font-medium">Please select a service to continue</span>
          </div>
        )}
        
        {selectedService && (
          <div className="bg-green-50 p-4 rounded-lg border border-green-200 mb-6 flex items-start">
            <svg className="w-6 h-6 mr-3 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <div>
              <p className="font-medium text-green-800">
                You've selected: {services.find(s => s.id === selectedService)?.title}
              </p>
              <p className="text-sm text-green-700 mt-1">
                Click the continue button below to proceed to scheduling.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Service Details sections - these would be conditionally shown based on the selected service */}
      {selectedService === 'golf' && (
        <div className="bg-white p-6 rounded-lg shadow-md border border-divider mb-8">
          <h3 className="font-semibold text-lg mb-2">Golf Pass Details</h3>
          <p className="text-text-secondary mb-4">
            The Golf Pass provides access to all base golfing facilities including:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-text-secondary mb-4">
            <li>18-hole championship golf course</li>
            <li>Driving range and practice facilities</li>
            <li>Pro shop and equipment rental</li>
            <li>Clubhouse and dining facilities</li>
          </ul>
          <p className="text-sm italic text-text-secondary">
            Note: Golf passes are valid for the day of issue only. Tee times must be booked separately.
          </p>
        </div>
      )}

      {/* Continue Button */}
      <div className="flex justify-end mt-8">
        <button
          onClick={handleContinue}
          className={`px-8 py-4 rounded-lg text-white text-lg font-medium transition-all duration-300 shadow-md
            ${!selectedService
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-secondary hover:bg-opacity-90 hover:shadow-lg transform hover:-translate-y-1'
            }`}
          disabled={!selectedService}
        >
          Continue to Scheduling
          <svg className="inline-block ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </button>
      </div>
    </KioskLayout>
  );
}