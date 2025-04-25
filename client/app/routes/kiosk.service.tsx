import React, { useState } from 'react';
import { useNavigate } from '@remix-run/react';
import type { MetaFunction } from '@remix-run/node';
import { v4 as uuidv4 } from 'uuid';
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
      if (!value) return true;
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailPattern.test(value);
    } else if (name === 'phone') {
      if (!value) return true;
      const phonePattern = /^\d{10}$|^\d{3}[-.]?\d{3}[-.]?\d{4}$/;
      return phonePattern.test(value.replace(/\s/g, ''));
    }
    return true;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
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
      const userId = uuidv4();
      localStorage.setItem('userId', userId);

      const visitorInfo = {
        ...formData,
        userId
      };

      localStorage.setItem('visitorInfo', JSON.stringify(visitorInfo));
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
      <div className="bg-white p-8 rounded-lg shadow-md border border-divider">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {['firstName', 'lastName', 'phone', 'email', 'sponsor'].map((field, i) => (
            <div key={field} className={`md:col-span-${field === 'sponsor' ? 2 : 1}`}>
              <label htmlFor={field} className="block font-medium text-text-primary mb-2">
                {field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, ' $1')}
                {(field === 'firstName' || field === 'lastName') && <span className="text-red-500"> *</span>}
              </label>
              <input
                type="text"
                name={field}
                id={field}
                value={formData[field as keyof typeof formData]}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-md shadow-sm focus:ring-2 focus:ring-primary transition ${
                  formErrors[field as keyof typeof formErrors] ? 'border-red-500 bg-red-50' : 'border-divider'
                }`}
                required
              />
              {formErrors[field as keyof typeof formErrors] && (
                <p className="text-sm text-red-500 mt-1">Invalid {field}</p>
              )}
            </div>
          ))}
        </div>

        <div className="flex justify-end mt-8">
          <button
            onClick={handleContinue}
            disabled={Object.values(formErrors).some(Boolean)}
            className="secondary xl px-8 py-4 rounded-lg text-white font-medium"
          >
            Continue to Service Selection
            <svg className="right w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>
        </div>
      </div>
    </KioskLayout>
  );
}
