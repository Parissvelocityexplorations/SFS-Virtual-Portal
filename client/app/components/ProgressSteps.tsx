import React from 'react';

type ProgressStepsProps = {
  steps: string[];
  currentStep: number;
};

export default function ProgressSteps({ steps, currentStep }: ProgressStepsProps) {
  return (
    <div className="w-full mb-12">
      <div className="flex justify-between relative">
        {/* Connection line */}
        <div className="absolute top-1/2 left-0 right-0 h-1 bg-divider -translate-y-1/2 z-0"></div>
        
        {/* Steps */}
        {steps.map((step, index) => {
          const isActive = index < currentStep;
          const isCurrent = index === currentStep;
          
          return (
            <div key={index} className="flex flex-col items-center relative z-10">
              {/* Circle */}
              <div 
                className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 border-2 ${
                  isActive ? 'bg-primary border-primary text-white' : 
                  isCurrent ? 'bg-white border-primary text-primary' : 
                  'bg-white border-divider text-text-secondary'
                }`}
              >
                {index + 1}
              </div>
              
              {/* Label */}
              <div className={`text-sm text-center ${
                isActive || isCurrent ? 'text-text-primary font-medium' : 'text-text-secondary'
              }`}>
                {step}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}