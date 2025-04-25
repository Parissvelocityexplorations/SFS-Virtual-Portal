import React, { useState, useEffect } from 'react';

type ServiceCardProps = {
  title: string;
  icon: string;
  iconSvg?: React.ReactNode;
  description: string;
  onClick: () => void;
  selected: boolean;
  estimatedTime?: string;
  badge?: string;
};

export default function ServiceCard({ 
  title, 
  icon, 
  iconSvg, 
  description, 
  onClick, 
  selected,
  estimatedTime,
  badge
}: ServiceCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [rippleEffect, setRippleEffect] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  
  // Reset ripple effect after animation completes
  useEffect(() => {
    if (rippleEffect) {
      const timer = setTimeout(() => {
        setRippleEffect(false);
      }, 700);
      return () => clearTimeout(timer);
    }
  }, [rippleEffect]);

  // Handle click with ripple effect
  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Get position for ripple effect
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
    
    // Trigger ripple animation
    setRippleEffect(true);
    
    // Call the provided onClick handler
    onClick();
  };

  return (
    <div 
      className={`
        relative overflow-hidden rounded-xl p-6 cursor-pointer group
        transition-all duration-300 transform backdrop-blur-sm
        ${selected 
          ? 'shadow-xl scale-[1.02] z-10' 
          : 'hover:shadow-lg hover:-translate-y-1'
        }
        ${selected 
          ? 'bg-gradient-to-br from-primary/10 to-primary/5 border-2 border-primary' 
          : 'bg-white/80 border border-divider hover:border-primary/40'}
      `}
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      role="button"
      aria-pressed={selected}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          onClick();
        }
      }}
    >
      {/* Ripple effect overlay */}
      {rippleEffect && (
        <div 
          className="absolute inset-0 pointer-events-none z-10"
          aria-hidden="true"
        >
          <span 
            className="absolute rounded-full bg-primary/20 animate-ripple"
            style={{
              top: mousePos.y,
              left: mousePos.x,
              width: '10px',
              height: '10px',
              transform: 'translate(-50%, -50%) scale(0)',
            }}
          />
        </div>
      )}
      
      {/* Badge if provided */}
      {badge && (
        <div className="absolute top-3 right-3">
          <span className="sf-badge sf-badge-secondary text-xs py-0.5 px-2">
            {badge}
          </span>
        </div>
      )}
      
      <div className="flex flex-col md:flex-row md:items-center mb-4 relative">
        <div className={`
          w-16 h-16 flex items-center justify-center rounded-full mb-4 md:mb-0 md:mr-5
          transition-all duration-300 relative
          ${selected 
            ? 'bg-gradient-to-br from-primary to-primary-dark text-white shadow-lg' 
            : 'bg-primary/10 text-primary'}
        `}>
          {/* Animated ring for hover effect */}
          <div className={`
            absolute inset-0 rounded-full 
            ${(isHovered && !selected) ? 'animate-ping opacity-30 bg-primary/30' : 'opacity-0'}
            transition-opacity duration-300
          `}></div>
          
          {/* Icon content */}
          {iconSvg ? (
            <div className={`w-8 h-8 transition-transform duration-300 ${isHovered ? 'scale-110' : ''}`}>
              {iconSvg}
            </div>
          ) : (
            <span className={`text-2xl transition-transform duration-300 ${isHovered ? 'scale-110' : ''}`}>
              {icon}
            </span>
          )}
          
          {/* Subtle glow effect */}
          {selected && (
            <div className="absolute inset-0 rounded-full bg-primary opacity-30 filter blur-md -z-10"></div>
          )}
        </div>
        
        <div>
          <h3 className={`
            text-lg md:text-xl font-semibold transition-all duration-300
            ${selected ? 'text-primary' : 'text-text-primary'}
          `}>
            {title}
          </h3>
          <p className="text-text-secondary text-sm mt-1 line-clamp-2">{description}</p>
          
          {/* Estimated time indicator */}
          {estimatedTime && (
            <div className="flex items-center mt-2 text-text-secondary text-xs">
              <svg className="w-4 h-4 mr-1 opacity-70" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 6V12L16 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Est. time: {estimatedTime}
            </div>
          )}
        </div>
      </div>
      
      {/* Selection indicator with enhanced animation */}
      <div className={`
        flex items-center mt-4 pt-3 border-t border-divider/60
        ${selected ? 'opacity-100' : 'opacity-0'}
        transition-all duration-300
      `}>
        <div className={`
          w-5 h-5 rounded-full bg-gradient-to-r from-primary to-primary-dark
          flex items-center justify-center text-white
          ${selected ? 'animate-pulse-subtle' : ''}
        `}>
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <span className="ml-2 text-sm font-medium text-primary">
          {selected ? 'Service selected' : ''}
        </span>
      </div>
      
      {/* Enhanced military-inspired detail for selected state
      {selected && (
        // <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-gradient-to-r from-primary via-primary-light to-primary-dark shimmer"></div>
      )} */}
      
      {/* Interactive hover state bottom decoration */}
      {!selected && (
        <div className={`
          absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary/40 to-primary-light/40
          transform origin-left transition-transform duration-300 ease-out
          ${isHovered ? 'scale-x-100' : 'scale-x-0'}
        `}></div>
      )}

      {/* Add animated corner marker for visual interest
      <div className={`
        absolute -top-6 -right-6 w-12 h-12 
        ${selected ? 'opacity-100' : 'opacity-0'}
        transition-opacity duration-300 transform rotate-45
        pointer-events-none
      `}>
        <div className="absolute bottom-0 left-0 w-0 h-0 
          border-l-[12px] border-l-transparent
          border-b-[12px] border-b-primary
          border-r-[12px] border-r-transparent">
        </div>
      </div> */}

      {/* Add keyframe animations for the ripple effect */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes ripple {
          to {
            transform: translate(-50%, -50%) scale(30);
            opacity: 0;
          }
        }
        
        .animate-ripple {
          animation: ripple 0.7s ease-out forwards;
        }
      `}} />
    </div>
  );
}