import React from 'react';
import ProgressSteps from './ProgressSteps';
import { useNavigate } from '@remix-run/react';

type KioskLayoutProps = {
  children: React.ReactNode;
  currentStep: number;
  title: string;
  showBackButton?: boolean;
  onBack?: () => void;
  showProgressSteps?: boolean;
};

export default function KioskLayout({ 
  children, 
  currentStep,
  title,
  showBackButton = true,
  onBack,
  showProgressSteps = true
}: KioskLayoutProps) {
  const navigate = useNavigate();
  
  const steps = [
    "Start",
    "Information",
    "Service",
    "Schedule",
    "Review",
    "Confirmation"
  ];

  return (
    <div className="min-h-screen bg-geometric">
      {/* Page content */}
      <div className="mx-auto max-w-5xl px-4 md:px-8 pt-0 pb-12">
        {/* Top header bar */}
        <header className="flex items-center justify-between py-4 md:py-6 border-b border-divider mb-6 md:mb-8">
          <div className="flex items-center">
            <h1 className="text-xl md:text-2xl font-bold text-text-primary">
              Pass Access Kiosk
            </h1>
          </div>
          
          <div className="flex items-center">
            <button 
              onClick={() => navigate('/')}
              className="text sm flex items-center rounded-md"
            >
              <svg className="left w-4 h-4 mr-1.5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
              </svg>
              Exit Kiosk
            </button>
          </div>
        </header>
        
        {/* Main content area */}
        <div className="bg-surface rounded-xl shadow-lg border border-divider p-6 md:p-8 relative overflow-hidden">
          {/* Decorative accent strip */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-primary-light to-secondary"></div>
          
          {/* Progress steps */}
          {showProgressSteps && (
            <ProgressSteps steps={steps} currentStep={currentStep} />
          )}
          
          {/* Page heading with back button */}
          <div className="mb-8 flex items-center">
            {showBackButton && (
              <button 
                onClick={onBack}
                className="outline sm mr-4 flex items-center font-medium"
                aria-label="Go back"
              >
                <svg className="left w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back
              </button>
            )}
            <h2 className="text-2xl font-bold text-text-primary tracking-tight">{title}</h2>
          </div>
          
          {/* Main content */}
          <div className="relative">
            {children}
          </div>
        </div>
        
        {/* Footer */}
        <footer className="mt-8 px-4 py-6 text-center text-text-secondary text-sm flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <span>&copy; 2025 Pass Access Kiosk. All rights reserved.</span>
          </div>
          
          <div className="flex items-center space-x-6">
            <a href="#" className="button text sm">
              Privacy Policy
            </a>
            <a href="#" className="button text sm">
              DoD Section 508
            </a>
            <a href="#" className="button text sm">
              Contact
            </a>
          </div>
        </footer>
      </div>
    </div>
  );
}