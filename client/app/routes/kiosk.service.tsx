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
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    sponsor: ''
  });

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleContinue = () => {
    if (selectedService && formData.firstName && formData.lastName) {
      // In a real app, you could store this in context or send to server
      console.log('Form Data:', formData);
      console.log('Selected Service:', selectedService);
      navigate('/kiosk/schedule');
    } else {
      alert('Please complete the form and select a service.');
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
      <h1 className="text-4xl font-bold mb-6">Sign In</h1>

      {/* Visitor Info Form */}
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-lg w-full mb-10">
        <input
          type="text"
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
          placeholder="First Name"
          className="w-full px-4 py-2 mb-4 border border-gray-300 rounded"
        />
        <input
          type="text"
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
          placeholder="Last Name"
          className="w-full px-4 py-2 mb-4 border border-gray-300 rounded"
        />
        <input
          type="text"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          placeholder="Phone Number"
          className="w-full px-4 py-2 mb-4 border border-gray-300 rounded"
        />
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email Address"
          className="w-full px-4 py-2 mb-4 border border-gray-300 rounded"
        />
        <input
          type="text"
          name="sponsor"
          value={formData.sponsor}
          onChange={handleChange}
          placeholder="Sponsor Name"
          className="w-full px-4 py-2 mb-4 border border-gray-300 rounded"
        />
        <button
          onClick={handleContinue}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-all"
        >
          Sign In
        </button>
      </div>

      {/* Service Selection */}
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-4xl w-full">
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
                ? 'bg-blue-600 hover:bg-blue-700' 
                : 'bg-gray-300 cursor-not-allowed'
            }`}
          >
            NEXT
          </button>
        </div>
      </div>
    </KioskLayout>
  );
}
