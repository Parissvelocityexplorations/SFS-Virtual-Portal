import React from 'react';

type ServiceCardProps = {
  title: string;
  icon: string;
  description: string;
  onClick: () => void;
  selected: boolean;
};

export default function ServiceCard({ title, icon, description, onClick, selected }: ServiceCardProps) {
  return (
    <div 
      className={`border-2 rounded-lg p-6 cursor-pointer transition-all ${
        selected 
          ? 'border-primary shadow-md bg-primary bg-opacity-5' 
          : 'border-divider hover:border-primary hover:shadow-sm'
      }`}
      onClick={onClick}
    >
      <div className="flex items-center mb-3">
        <div className="w-12 h-12 flex items-center justify-center bg-primary bg-opacity-10 rounded-full text-primary mr-4">
          {icon}
        </div>
        <h3 className="text-lg font-medium text-text-primary">{title}</h3>
      </div>
      <p className="text-text-secondary text-sm">{description}</p>
      
      {selected && (
        <div className="mt-4 flex justify-end">
          <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-white">
            ✓
          </div>
        </div>
      )}
    </div>
  );
}