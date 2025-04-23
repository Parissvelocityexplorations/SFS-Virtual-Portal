import React, { useState } from 'react';
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
  description: string;
};

export default function ServiceSelection() {
  const navigate = useNavigate();
  const [selectedService, setSelectedService] = useState<string | null>(null);
  
  const services: Service[] = [
    {
      id: 'golf',
      title: 'Golf Pass',
      icon: '⛳',
      description: 'Access pass for the golf course and related facilities.'
    },
    {
      id: 'visitor',
      title: 'Visitor Pass',
      icon: '🏙️',
      description: 'General visitor access to base facilities and common areas.'
    },
    {
      id: 'vhic',
      title: 'Veteran Health ID Card',
      icon: '🏥',
      description: 'Access for veterans with Veteran Health Identification Card.'
    },
    {
      id: 'dbids',
      title: 'DBIDS Card',
      icon: '🪪',
      description: 'Defense Biometric Identification System card processing.'
    }
  ];

  const handleServiceClick = (serviceId: string) => {
    setSelectedService(serviceId);
  };

  const handleContinue = () => {
    if (selectedService) {
      // In a real app, we'd store the selected service in state or context
      navigate('/kiosk/schedule');
    }
  };

  const handleBack = () => {
    navigate('/kiosk');
  };

  return (
    <KioskLayout 
      currentStep={1} 
      title="Select a Service"
      onBack={handleBack}
    >
      <div className="py-4">
        <p className="text-text-secondary mb-6">
          Please select the service you need from the options below:
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {services.map((service) => (
            <ServiceCard
              key={service.id}
              title={service.title}
              icon={service.icon}
              description={service.description}
              onClick={() => handleServiceClick(service.id)}
              selected={selectedService === service.id}
            />
          ))}
        </div>
        
        <div className="flex justify-end">
          <button
            onClick={handleContinue}
            disabled={!selectedService}
            className={`px-6 py-3 rounded-md text-white ${
              selectedService 
                ? 'bg-secondary hover:bg-opacity-90' 
                : 'bg-divider cursor-not-allowed'
            }`}
          >
            NEXT
          </button>
        </div>
      </div>
    </KioskLayout>
  );
}