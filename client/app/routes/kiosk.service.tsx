import React, { useState } from 'react';
import { useNavigate } from '@remix-run/react';
import type { MetaFunction } from '@remix-run/node';
import KioskLayout from '~/components/KioskLayout';

export const meta: MetaFunction = () => {
  return [
    { title: "Pass Access Kiosk - Your Information" },
    { name: "description", content: "Enter your information at the Pass Access Kiosk" },
  ];
};

export default function InformationForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    sponsor: ''
  });
  const [formErrors, setFormErrors] = useState({
    firstName: false,
    lastName: false,
    phone: false,
    email: false
  });

  const validateField = (name: string, value: string) => {
    if (name === 'firstName' || name === 'lastName' || name === 'email' || name === 'phone') {
      return value.trim().length > 0;
    } else if (name === 'email') {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailPattern.test(value);
    } else if (name === 'phone') {
      const phonePattern = /^\d{10}$|^\d{3}[-.]?\d{3}[-.]?\d{4}$/;
      return phonePattern.test(value.replace(/\s/g, ''));
    }
    return true;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Validate on change
    const isValid = validateField(name, value);
    setFormErrors({ ...formErrors, [name]: !isValid });
  };

  const validateForm = () => {
    const newErrors = {
      firstName: !formData.firstName.trim(),
      lastName: !formData.lastName.trim(),
      phone: !formData.phone.trim() || !validateField('phone', formData.phone),
      email: !formData.email.trim() || !validateField('email', formData.email)
    };
    
    setFormErrors(newErrors);
    return !Object.values(newErrors).some(Boolean);
  };

  const handleContinue = () => {
    if (validateForm()) {
      // In a real app, you could store this in context, session storage, or send to server
      localStorage.setItem('visitorInfo', JSON.stringify(formData));
      navigate('/kiosk/service-select');
    }
  };

  const handleBack = () => {
    navigate('/kiosk');
  };

  return (
    <KioskLayout 
      currentStep={1} 
      title="Enter Your Information"
      onBack={handleBack}
    >
      <div className="mb-8">
        <div className="bg-white p-8 rounded-lg shadow-md border border-divider">
          <div className="mb-6">
            <h2 className="text-2xl font-bold mb-4 text-text-primary">Personal Information</h2>
            <p className="text-text-secondary mb-4">
              Please enter your details below to continue with your pass request.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-1">
              <label className="block text-text-primary font-medium mb-2" htmlFor="firstName">
                First Name <span className="text-red-500">*</span>
              </label>
              <input
                id="firstName"
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-md shadow-sm focus:ring-2 focus:ring-primary focus:border-primary transition-all ${
                  formErrors.firstName ? 'border-red-500 bg-red-50' : 'border-divider'
                }`}
                required
              />
              {formErrors.firstName && (
                <p className="mt-1 text-sm text-red-500">First name is required</p>
              )}
            </div>
            
            <div className="md:col-span-1">
              <label className="block text-text-primary font-medium mb-2" htmlFor="lastName">
                Last Name <span className="text-red-500">*</span>
              </label>
              <input
                id="lastName"
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-md shadow-sm focus:ring-2 focus:ring-primary focus:border-primary transition-all ${
                  formErrors.lastName ? 'border-red-500 bg-red-50' : 'border-divider'
                }`}
                required
              />
              {formErrors.lastName && (
                <p className="mt-1 text-sm text-red-500">Last name is required</p>
              )}
            </div>
            
            <div className="md:col-span-1">
              <label className="block text-text-primary font-medium mb-2" htmlFor="phone">
                Phone Number <span className="text-red-500">*</span>
              </label>
              <input
                id="phone"
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="123-456-7890"
                className={`w-full px-4 py-3 border rounded-md shadow-sm focus:ring-2 focus:ring-primary focus:border-primary transition-all ${
                  formErrors.phone ? 'border-red-500 bg-red-50' : 'border-divider'
                }`}
                required
              />
              {formErrors.phone && (
                <p className="mt-1 text-sm text-red-500">Phone number is required</p>
              )}
            </div>
            
            <div className="md:col-span-1">
              <label className="block text-text-primary font-medium mb-2" htmlFor="email">
                Email Address <span className="text-red-500">*</span>
              </label>
              <input
                id="email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="example@mail.com"
                className={`w-full px-4 py-3 border rounded-md shadow-sm focus:ring-2 focus:ring-primary focus:border-primary transition-all ${
                  formErrors.email ? 'border-red-500 bg-red-50' : 'border-divider'
                }`}
                required
              />
              {formErrors.email && (
                <p className="mt-1 text-sm text-red-500">Email address is required</p>
              )}
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-text-primary font-medium mb-2" htmlFor="sponsor">
                Sponsor Name (if applicable)
              </label>
              <input
                id="sponsor"
                type="text"
                name="sponsor"
                value={formData.sponsor}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-divider rounded-md shadow-sm focus:ring-2 focus:ring-primary focus:border-primary transition-all"
              />
            </div>
          </div>

          <div className="mt-8 bg-blue-50 p-4 rounded-md border-l-4 border-primary">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-primary" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-blue-800">
                  All information will be used solely for the purpose of processing your pass request. See our privacy policy for more details.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Continue Button */}
      <div className="flex justify-end mt-6">
        <button
          onClick={handleContinue}
          className={`secondary xl px-8 py-4 rounded-lg text-white font-medium ${
            (formErrors.firstName || formErrors.lastName || formErrors.phone || formErrors.email)
              ? 'opacity-50 cursor-not-allowed'
              : ''
            }`}
          disabled={formErrors.firstName || formErrors.lastName || formErrors.phone || formErrors.email}
        >
          Continue to Service Selection
          <svg className="right w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </button>
      </div>
    </KioskLayout>
  );
}
