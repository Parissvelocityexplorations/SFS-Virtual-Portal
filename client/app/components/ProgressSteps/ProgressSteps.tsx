import React, { useEffect, useState } from 'react';
import "./ProgressSteps.scss";

type ProgressStepsProps = {
  steps: string[];
  currentStep: number;
};

export default function ProgressSteps({ steps, currentStep }: ProgressStepsProps) {
  const [animateProgress, setAnimateProgress] = useState(false);
  const [prevStep, setPrevStep] = useState(currentStep);

  // Detect direction of step change
  const direction = currentStep > prevStep ? 'forward' : currentStep < prevStep ? 'backward' : 'none';

  // Trigger animation when steps change
  useEffect(() => {
    if (currentStep !== prevStep) {
      setAnimateProgress(false);
      const timer = setTimeout(() => {
        setAnimateProgress(true);
        setPrevStep(currentStep);
      }, 50);
      return () => clearTimeout(timer);
    } else {
      setAnimateProgress(true);
    }
  }, [currentStep, prevStep]);

  // Calculate progress percentage
  const progressPercentage = (currentStep / (steps.length - 1)) * 100;

  return (
    <div className="w-full mb-12 select-none">
      {/* Mobile progress indicator (visible on small screens) */}
      <div className="md:hidden mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-base font-semibold text-primary">Step {currentStep + 1} of {steps.length}</span>
          <span className="text-sm text-text-secondary">{Math.round(progressPercentage)}% Complete</span>
        </div>
        <div className="h-3 w-full bg-divider rounded-full overflow-hidden shadow-inner">
          <div 
            className={`h-full rounded-full transition-all ease-out ${animateProgress ? 'duration-1000' : 'duration-0'}`}
            style={{ 
              width: `${progressPercentage}%`,
              background: 'linear-gradient(90deg, var(--color-primary) 0%, var(--color-primary-light) 100%)',
              boxShadow: '0 0 10px rgba(25, 118, 210, 0.5)'
            }}
          ></div>
        </div>
        <div className="mt-3 text-center">
          <span className={`text-primary font-medium transition-all duration-300 ${animateProgress ? 'opacity-100' : 'opacity-0'}`}>
            {steps[currentStep]}
          </span>
        </div>
      </div>
      
      {/* Desktop progress steps (hidden on mobile) */}
      <div className="hidden md:block">
        <div className="flex justify-between relative">
          {/* Connection line background */}
          <div className="absolute top-1/2 left-0 right-0 h-2 bg-divider -translate-y-1/2 z-0 rounded-full shadow-inner"></div>
          
          {/* Progress line fill - dynamically sized based on progress */}
          <div 
            className={`absolute top-1/2 left-0 h-2 -translate-y-1/2 z-0 rounded-full transition-all ${animateProgress ? 'duration-1000 ease-out' : 'duration-0'}`}
            style={{ 
              width: `${progressPercentage}%`,
              background: 'linear-gradient(90deg, var(--color-primary) 0%, var(--color-primary-light) 100%)',
              boxShadow: '0 0 10px rgba(25, 118, 210, 0.3)'
            }}
          >
            {/* Animated dot at the end of progress bar */}
            <div 
              className="absolute right-0 top-1/2 w-4 h-4 bg-white border-2 border-primary rounded-full -translate-y-1/2 translate-x-1/2 shadow-md"
              style={{
                animation: animateProgress ? 'pulse 2s infinite' : 'none',
              }}
            ></div>
          </div>
          
          {/* Steps */}
          {steps.map((step, index) => {
            const isCompleted = index < currentStep;
            const isCurrent = index === currentStep;
            const isPending = index > currentStep;
            
            // Determine animations based on step status and direction
            let stepAnimation = '';
            if (isCurrent) {
              stepAnimation = direction === 'forward' ? 'animate-scale-in' : direction === 'backward' ? 'animate-bounce-in' : '';
            }
            
            return (
              <div key={index} className="flex flex-col items-center relative z-10">
                {/* Step indicator */}
                <div className={`
                  w-12 h-12 rounded-full flex items-center justify-center mb-3
                  transition-all duration-500 ease-in-out transform
                  ${isCompleted 
                    ? 'bg-primary text-white shadow-md scale-100' 
                    : isCurrent 
                      ? `bg-white border-4 border-primary text-primary shadow-lg scale-110 ${stepAnimation}`
                      : 'bg-white border-2 border-divider text-text-secondary scale-100'}
                `}>
                  {/* Step content (checkmark or number) */}
                  {isCompleted ? (
                    <svg className="w-6 h-6 animate-check-mark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <span className={`font-semibold text-lg ${isCurrent ? 'animate-number-pulse' : ''}`}>
                      {index + 1}
                    </span>
                  )}
                </div>
                
                {/* Step label */}
                <div className={`
                  text-center transition-all duration-500 ease-in-out
                  ${isCompleted ? 'text-primary font-medium' : 
                    isCurrent ? 'text-primary font-semibold' : 
                    'text-text-secondary font-normal'}
                  ${isCurrent ? 'transform scale-110' : ''}
                `}>
                  <span className={`
                    transition-all duration-300
                    ${isCurrent ? 'text-base' : 'text-sm'}
                  `}>
                    {step}
                  </span>
                </div>
                
                {/* Animated elements */}
                {isCurrent && (
                  <>
                    {/* Outer pulsing ring */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-12 rounded-full border-4 border-primary opacity-20 animate-ping"></div>
                    
                    {/* Inner pulsing ring */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-12 rounded-full border-4 border-primary opacity-30 animate-pulse"></div>
                  </>
                )}

                {/* Connection line animation */}
                {isCompleted && index < steps.length - 1 && (
                  <div 
                    className="absolute top-1/2 h-2 bg-primary-light -translate-y-1/2 z-1 rounded-full" 
                    style={{
                      left: '50%',
                      width: '100%',
                      animation: 'connectSteps 1s ease-out forwards',
                      transformOrigin: 'left center'
                    }}
                  ></div>
                )}

                {/* Status indicators for pending steps */}
                {isPending && (
                  <div 
                    className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs text-text-tertiary opacity-60"
                    style={{
                      fontStyle: 'italic'
                    }}
                  >
                    Pending
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Add a global style for animations */}
      <style jsx global>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        
        @keyframes ping {
          75%, 100% {
            transform: scale(1.5);
            opacity: 0;
          }
        }
        
        @keyframes check-mark {
          0% { stroke-dashoffset: 20; opacity: 0; }
          70% { stroke-dashoffset: 0; opacity: 1; }
          100% { stroke-dashoffset: 0; opacity: 1; }
        }
        
        @keyframes connectSteps {
          0% { transform: scaleX(0) translateY(-50%); }
          100% { transform: scaleX(1) translateY(-50%); }
        }
        
        @keyframes scale-in {
          0% { transform: scale(0.7); opacity: 0; }
          70% { transform: scale(1.15); }
          100% { transform: scale(1.1); opacity: 1; }
        }
        
        @keyframes bounce-in {
          0% { transform: scale(0.9); opacity: 0.5; }
          50% { transform: scale(1.2); }
          70% { transform: scale(0.95); }
          100% { transform: scale(1.1); opacity: 1; }
        }
        
        @keyframes number-pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.15); }
          100% { transform: scale(1); }
        }
        
        .animate-check-mark {
          stroke-dasharray: 20;
          stroke-dashoffset: 20;
          animation: check-mark 0.6s ease-in-out forwards;
        }
        
        .animate-scale-in {
          animation: scale-in 0.5s ease-out forwards;
        }
        
        .animate-bounce-in {
          animation: bounce-in 0.5s ease-out forwards;
        }
        
        .animate-number-pulse {
          animation: number-pulse 2s infinite;
        }
      `}</style>
    </div>
  );
}