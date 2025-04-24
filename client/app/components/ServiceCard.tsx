import React from 'react';

type ServiceCardProps = {
  title: string;
  icon: string;
  iconSvg?: React.ReactNode;
  description: string;
  onClick: () => void;
  selected: boolean;
};

export default function ServiceCard({ 
  title, 
  icon, 
  iconSvg, 
  description, 
  onClick, 
  selected 
}: ServiceCardProps) {
  return (
    <div 
      className={`
        relative overflow-hidden border-2 rounded-xl p-6 cursor-pointer
        transition-all duration-300 transform
        ${selected 
          ? 'border-primary shadow-xl bg-primary/5 scale-[1.02]' 
          : 'border-divider hover:border-primary/40 hover:shadow-lg hover:-translate-y-1'
        }
      `}
      onClick={onClick}
      role="button"
      aria-pressed={selected}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          onClick();
        }
      }}
    >
      {/* Removed decorative corner banner for cleaner design */}
      
      <div className="flex flex-col md:flex-row md:items-center mb-4">
        <div className={`
          w-16 h-16 flex items-center justify-center rounded-full mb-4 md:mb-0 md:mr-4
          ${selected 
            ? 'bg-primary text-white shadow-md' 
            : 'bg-primary/10 text-primary'}
          transition-all duration-300
        `}>
          {iconSvg ? (
            <div className="w-8 h-8">
              {iconSvg}
            </div>
          ) : (
            <span className="text-2xl">{icon}</span>
          )}
        </div>
        
        <div>
          <h3 className={`
            text-lg md:text-xl font-semibold transition-all duration-300
            ${selected ? 'text-primary' : 'text-text-primary'}
          `}>
            {title}
          </h3>
          <p className="text-text-secondary text-sm mt-1">{description}</p>
        </div>
      </div>
      
      {/* Selection indicator */}
      <div className={`
        flex items-center mt-4 pt-3 border-t border-divider
        ${selected ? 'opacity-100' : 'opacity-0'}
        transition-opacity duration-300
      `}>
        <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center text-white">
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <span className="ml-2 text-sm font-medium text-primary">
          Service selected
        </span>
      </div>
      
      {/* Military-inspired detail for selected state */}
      {selected && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-primary-light to-primary-dark"></div>
      )}
    </div>
  );
}