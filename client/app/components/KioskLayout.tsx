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
    "Service",
    "Schedule",
    "Review",
    "Confirmation"
  ];

  return (
    <div className="min-h-screen bg-geometric p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8 flex items-center justify-between">
          <h1 className="text-xl md:text-2xl font-bold text-primary">
            Pass Access Kiosk
          </h1>
          <button 
            className="text-text-secondary text-sm hover:text-primary"
            onClick={() => navigate('/')}
          >
            Exit
          </button>
        </header>
        
        <div className="bg-surface rounded-lg shadow-md p-6 md:p-8">
          {showProgressSteps && (
            <ProgressSteps steps={steps} currentStep={currentStep} />
          )}
          
          <div className="mb-6 flex items-center">
            {showBackButton && (
              <button 
                onClick={onBack}
                className="mr-4 text-text-secondary hover:text-primary"
              >
                &larr; Back
              </button>
            )}
            <h2 className="text-xl font-semibold text-text-primary">{title}</h2>
          </div>
          
          {children}
        </div>
        
        <footer className="mt-8 text-center text-text-secondary text-sm">
          <p>&copy; 2025 Pass Access Kiosk. All rights reserved.</p>
          <p className="mt-1">
            <a href="#" className="text-link hover:underline">
              DoD Section 508
            </a>
          </p>
        </footer>
      </div>
    </div>
  );
}