import React, { useEffect, useState, useRef } from 'react';

/**
 * MultiStepProgress - A professional, accessible, and animated progress indicator
 * 
 * @param steps - Array of string labels for each step
 * @param currentStep - Zero-based index of the current active step
 * @param className - Optional additional classes for the container
 * @param variant - Design variant ('default' or 'compact')
 * @param colorTheme - Color theme ('primary', 'secondary', or 'accent')
 * @param onTransitionEnd - Optional callback fired when transition animation completes
 */
type ProgressStepsProps = {
  steps: string[];
  currentStep: number;
  className?: string;
  variant?: 'default' | 'compact';
  colorTheme?: 'primary' | 'secondary' | 'accent';
  onTransitionEnd?: () => void;
};

// Utility function for merging class names
function cn(...classes: (string | undefined | boolean)[]): string {
  return classes.filter(Boolean).join(' ');
}

export default function ProgressSteps({ 
  steps, 
  currentStep, 
  className = '',
  variant = 'default',
  colorTheme = 'primary',
  onTransitionEnd,
}: ProgressStepsProps) {
  // Fix hydration mismatches by starting with server-consistent state
  const [isMounted, setIsMounted] = useState(false);
  const [animateProgress, setAnimateProgress] = useState(false);
  const [prevStep, setPrevStep] = useState(currentStep);
  const [transition, setTransition] = useState<'none' | 'forward' | 'backward'>('none');
  const [animatedProgressPercentage, setAnimatedProgressPercentage] = useState(0);
  const [animatingStepFill, setAnimatingStepFill] = useState(-1);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const progressAnimationRef = useRef<number | null>(null);
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);
  
  // Calculate target progress percentage
  const targetProgressPercentage = steps.length <= 1 ? 100 : (currentStep / (steps.length - 1)) * 100;
  
  // Theme configuration
  const themeColors = {
    primary: {
      main: 'var(--color-primary)',
      light: 'var(--color-primary-light)',
      dark: 'var(--color-primary-dark)',
      contrast: 'white',
      bgGradient: 'linear-gradient(90deg, var(--color-primary) 0%, var(--color-primary-light) 100%)',
    },
    secondary: {
      main: 'var(--color-secondary)',
      light: 'var(--color-secondary-light)',
      dark: 'var(--color-secondary)',
      contrast: 'white',
      bgGradient: 'linear-gradient(90deg, var(--color-secondary) 0%, var(--color-secondary-light) 100%)',
    },
    accent: {
      main: 'var(--color-accent)',
      light: 'rgba(255, 64, 129, 0.8)',
      dark: 'rgba(255, 64, 129, 1)',
      contrast: 'white',
      bgGradient: 'linear-gradient(90deg, var(--color-accent) 0%, rgba(255, 100, 150, 1) 100%)',
    }
  };

  const theme = themeColors[colorTheme];

  // Smooth progress bar animation using requestAnimationFrame
  const animateProgressBar = (
    start: number, 
    end: number, 
    duration: number, 
    startTime: number,
    timestamp: number
  ) => {
    if (!startTime) {
      startTime = timestamp;
    }
    
    const elapsed = timestamp - startTime;
    const progress = Math.min(elapsed / duration, 1);
    
    // Custom easing function for smooth flow with slight bounce
    const easeOutBack = (x: number): number => {
      const c1 = 1.70158;
      const c3 = c1 + 1;
      return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2);
    };
    
    // More fluid easing function for progress bar
    const easeInOutCubic = (x: number): number => {
      return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
    };
    
    // Apply easing for smoother flow (use easeInOutCubic for more fluid bar animation)
    const easedProgress = start < end ? easeInOutCubic(progress) : easeOutBack(progress);
    
    // Calculate current value with improved easing
    const currentValue = start + (end - start) * (progress < 0.98 ? easedProgress : 1);
    setAnimatedProgressPercentage(currentValue);
    
    // Determine the step that's currently being filled
    if (steps.length > 1) {
      const stepProgress = (currentValue / 100) * (steps.length - 1);
      const currentFillingStep = Math.floor(stepProgress);
      
      if (currentFillingStep >= 0 && currentFillingStep < steps.length - 1) {
        setAnimatingStepFill(currentFillingStep);
      }
    }
    
    // Continue animation if not complete
    if (progress < 1) {
      progressAnimationRef.current = requestAnimationFrame((time) => 
        animateProgressBar(start, end, duration, startTime, time)
      );
    } else {
      // Animation complete
      setAnimatingStepFill(-1);
      if (onTransitionEnd) {
        onTransitionEnd();
      }
    }
  };
  
  // Get position for floating animation elements
  const getStepPosition = (index: number): { top: number, left: number } | null => {
    if (!isMounted || !stepRefs.current[index]) return null;
    
    const element = stepRefs.current[index];
    if (!element) return null;
    
    const rect = element.getBoundingClientRect();
    const parentRect = progressBarRef.current?.getBoundingClientRect() || { top: 0, left: 0 };
    
    return {
      top: rect.top - parentRect.top,
      left: rect.left - parentRect.left + rect.width / 2
    };
  };

  // Start progress bar animation when step changes
  useEffect(() => {
    // Cancel any existing animation
    if (progressAnimationRef.current) {
      cancelAnimationFrame(progressAnimationRef.current);
    }
    
    if (isMounted && prevStep !== currentStep) {
      // Determine direction and set transition
      const newTransition = currentStep > prevStep ? 'forward' : 'backward';
      setTransition(newTransition);
      
      // Get current progress value as starting point
      const startValue = animatedProgressPercentage;
      const endValue = targetProgressPercentage;
      
      // Set longer duration for more fluid motion
      const animationDuration = 1200;
      
      // Start new animation with appropriate duration
      progressAnimationRef.current = requestAnimationFrame((timestamp) => 
        animateProgressBar(startValue, endValue, animationDuration, 0, timestamp)
      );
      
      // Update step state after animation starts
      const timer = setTimeout(() => {
        setPrevStep(currentStep);
        setAnimateProgress(true);
        
        // Reset transition type after animation completes
        const resetTimer = setTimeout(() => {
          setTransition('none');
        }, animationDuration + 500);
        
        return () => clearTimeout(resetTimer);
      }, 50);
      
      return () => {
        clearTimeout(timer);
        if (progressAnimationRef.current) {
          cancelAnimationFrame(progressAnimationRef.current);
        }
      };
    }
  }, [currentStep, isMounted]);

  // Ensure consistent rendering between server and client
  useEffect(() => {
    setIsMounted(true);
    setAnimatedProgressPercentage(targetProgressPercentage);
    
    return () => {
      // Cleanup animation on unmount
      if (progressAnimationRef.current) {
        cancelAnimationFrame(progressAnimationRef.current);
      }
    };
  }, []);

  // Calculate spacing for step elements
  const stepWidth = 100 / (steps.length - 1);
  
  // Render floating animation elements
  const renderFloatingElements = () => {
    if (!isMounted || transition !== 'forward' || prevStep >= currentStep) return null;
    
    const prevStepPos = getStepPosition(prevStep);
    const currentStepPos = getStepPosition(currentStep);
    
    if (!prevStepPos || !currentStepPos) return null;
    
    return (
      <div 
        className="absolute inset-0 pointer-events-none overflow-visible z-10"
        aria-hidden="true"
      >
        {/* Floating particles for step transition */}
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={`particle-${i}`}
            className="absolute w-1.5 h-1.5 rounded-full bg-white"
            style={{
              left: `${prevStepPos.left}px`,
              top: `${prevStepPos.top}px`,
              opacity: 0.7,
              boxShadow: `0 0 3px ${theme.main}`,
              animation: `floating-particle-${i + 1} 1.2s forwards ease-out`,
            }}
          />
        ))}
        
        {/* Pulse rings that float upward */}
        <div 
          className="absolute w-10 h-10 rounded-full"
          style={{
            left: `${prevStepPos.left - 20}px`,
            top: `${prevStepPos.top - 20}px`,
            border: `2px solid ${theme.main}`,
            animation: 'float-ring 1s forwards ease-out',
            opacity: 0.15
          }}
        />
        
        {/* Subtle glow that floats along path */}
        <div 
          className="absolute w-6 h-6 rounded-full"
          style={{
            left: `${prevStepPos.left - 12}px`,
            top: `${prevStepPos.top - 12}px`,
            background: `radial-gradient(circle, ${theme.light} 0%, transparent 70%)`,
            animation: 'float-glow 1.5s forwards ease-out',
            opacity: 0.4
          }}
        />
      </div>
    );
  };
  
  return (
    <div 
      className={cn(
        "w-full select-none mb-8 relative", 
        variant === 'compact' ? 'max-w-md mx-auto' : 'max-w-4xl mx-auto',
        className
      )}
      ref={progressBarRef}
      suppressHydrationWarning
    >
      {/* Mobile progress indicator (visible on small screens) */}
      <div className="md:hidden">
        <div className="flex items-center justify-between mb-2">
          <span className="text-base font-semibold" style={{ color: theme.main }}>
            Step {currentStep + 1} of {steps.length}
          </span>
          <span className="text-sm text-text-secondary">
            {Math.round(animatedProgressPercentage)}% Complete
          </span>
        </div>
        
        {/* Mobile progress bar with flowing animation */}
        <div className="h-3 w-full bg-divider rounded-full overflow-hidden shadow-inner">
          <div 
            className="h-full rounded-full transition-none relative"
            style={{ 
              width: `${animatedProgressPercentage}%`,
              background: theme.bgGradient,
              boxShadow: `0 0 8px ${theme.main}80`,
              transitionProperty: 'none'
            }}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(animatedProgressPercentage)}
            role="progressbar"
            aria-label={`Step ${currentStep + 1} of ${steps.length}: ${steps[currentStep]}`}
          >
            {/* Animated progress glow effect - only on client-side */}
            {isMounted && transition !== 'none' && (
              <div 
                className="absolute inset-0 opacity-70"
                style={{
                  background: `linear-gradient(90deg, transparent 0%, ${theme.light}60 50%, transparent 100%)`,
                  animation: transition === 'forward' ? 'progress-glow 1.8s ease-out' : 'none',
                  width: '200%',
                  left: '-100%'
                }}
                aria-hidden="true"
              />
            )}
          </div>
        </div>
        
        {/* Current step label with enhanced fade transition */}
        <div className="mt-3 text-center h-6 relative overflow-hidden">
          {steps.map((step, index) => (
            <span 
              key={index}
              className={cn(
                "absolute left-0 right-0 transition-all duration-700",
                index === currentStep ? 'opacity-100 transform-none' : 'opacity-0 translate-y-4',
                isMounted && index < currentStep && transition === 'forward' ? 'translate-y-[-100%]' : '',
                isMounted && index > currentStep && transition === 'backward' ? 'translate-y-[100%]' : ''
              )}
              style={{ color: theme.main, fontWeight: 500 }}
            >
              {step}
            </span>
          ))}
        </div>
      </div>
      
      {/* Desktop progress steps (hidden on mobile) */}
      <div className="hidden md:block">
        <div className="flex justify-between items-center relative">
          {/* Background connection line */}
          <div 
          style={{top:"23px"}}
            className="absolute left-0 right-0 h-1.5 bg-divider -translate-y-1/2 z-0 rounded-full shadow-inner"
            aria-hidden="true"
          />
          
          {/* Progress fill with smooth flowing animation */}
          <div 
            className="absolute left-0 h-1.5 -translate-y-1/2 z-0 rounded-full overflow-hidden transition-all duration-500 ease-in-out"
            style={{ 
              top: "23px",
              width: `${animatedProgressPercentage}%`,
              background: theme.bgGradient,
              boxShadow: `0 0 8px ${theme.main}80`,
            }}
            aria-hidden="true"
          >
            {/* Animated gradient flow effect - only client-side */}
            {isMounted && transition === 'forward' && (
              <div 
                className="absolute inset-0 opacity-70"
                style={{
                  top:"23px",
                  background: `linear-gradient(90deg, transparent 0%, ${theme.light}60 50%, transparent 100%)`,
                  animation: 'progress-flow 2s ease-out',
                  width: '200%',
                  left: '-100%'
                }}
                aria-hidden="true"
              />
            )}
            
            {/* Animated leading dot that flows with the progress */}
            {isMounted && currentStep !== steps.length - 1 && (
              <div 
                className="absolute right-0 top-1/2 w-3 h-3 bg-white border-2 rounded-full -translate-y-1/2 translate-x-1/2 shadow-md"
                style={{
                  borderColor: theme.main,
                  animation: animateProgress ? 'progress-pulse 2s infinite' : 'none',
                  boxShadow: `0 0 6px ${theme.main}80`
                }}
                aria-hidden="true"
              />
            )}
          </div>
          
          {/* Animated floating elements that move between steps */}
          {renderFloatingElements()}
          
          {/* Steps with enhanced animations */}
          {steps.map((step, index) => {
            // Calculate each step's completion status
            const stepProgress = (animatedProgressPercentage / 100) * (steps.length - 1);
            const isCompleted = index < Math.floor(stepProgress);
            const isCurrentlyAnimating = index === Math.floor(stepProgress) && index < currentStep;
            const isCurrent = currentStep === index;
            const isPending = index > currentStep;
            
            // Calculate completion percentage for the current step (for partial fill animations)
            const stepCompletionPercent = isCurrentlyAnimating 
              ? ((stepProgress - Math.floor(stepProgress)) * 100) 
              : (isCompleted ? 100 : 0);
            
            // Determine if this step is actively being filled
            const isBeingFilled = index === animatingStepFill;
            
            return (
              <div 
                key={index} 
                className={cn(
                  "flex flex-col items-center justify-center relative z-10 px-2",
                  transition === 'forward' && index === currentStep ? 'progress-step-activate' : '',
                  transition === 'forward' && index === prevStep ? 'progress-step-complete' : '',
                  transition === 'backward' && index === currentStep ? 'progress-step-reactivate' : '',
                  transition === 'backward' && index === prevStep ? 'progress-step-revert' : ''
                )}
                style={{ width: variant === 'compact' ? 'auto' : `${stepWidth}%` }}
                data-step={index}
                tabIndex={isCurrent ? 0 : -1}
                role="tab"
                aria-selected={isCurrent}
                aria-label={`Step ${index + 1}: ${step}${isCompleted ? ' (completed)' : isCurrent ? ' (current)' : ' (pending)'}`}
                ref={el => stepRefs.current[index] = el}
              >
                {/* Step circle indicator with enhanced states */}
                <div 
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center mb-3 transition-all duration-300 ease-in-out transform relative z-10",
                    isCompleted ? 'shadow-md scale-100' : '',
                    isCurrent ? 'active-step bg-white border-[3px] shadow-lg scale-110' : 'bg-white border-2 border-divider text-text-secondary scale-100',
                    isPending ? 'hover:border-gray-300 focus:border-gray-300' : '',
                    isBeingFilled ? 'progress-step-filling' : '',
                    "focus:outline-none focus:ring-2 focus:ring-offset-2",
                    transition === 'none' && isCurrent ? 'pulse-animation' : '',
                    transition === 'forward' && isCurrent ? 'pulse-in-animation' : '',
                    transition === 'backward' && isCurrent ? 'pulse-back-animation' : ''
                  )}
                  style={{
                    backgroundColor: isCompleted ? theme.main : 'white',
                    color: isCompleted ? theme.contrast : isCurrent ? theme.main : 'var(--color-text-secondary)',
                    borderColor: isCompleted ? theme.main : isCurrent ? theme.main : 'var(--color-divider)',
                    boxShadow: isCompleted ? `0 0 0 2px ${theme.main}30` : isCurrent ? `0 0 0 4px ${theme.main}30` : 'none',
                    // We'll add a custom property for the theme color to use in CSS
                    '--theme-color': theme.main,
                    // Add transition effects for the filling circles
                    ...(isCurrentlyAnimating && {
                      backgroundColor: `rgba(${parseInt(theme.main.slice(4,7))}, ${parseInt(theme.main.slice(8,11))}, ${parseInt(theme.main.slice(12,15))}, ${stepCompletionPercent/100})`,
                      color: stepCompletionPercent > 60 ? theme.contrast : theme.main,
                    })
                  }}
                  aria-hidden="true"
                >
                  {/* Step indicators with enhanced animations */}
                  {isCompleted ? (
                    <svg 
                      className={cn(
                        "w-5 h-5",
                        transition === 'backward' && index === prevStep ? 'progress-checkmark-exit' : 'progress-checkmark'
                      )} 
                      fill="none" 
                      stroke={isCompleted ? 'white' : 'currentColor'} 
                      viewBox="0 0 24 24"

                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <span 
                      className={cn(
                        "font-semibold text-base",
                        isCurrent ? 'progress-number-pulse' : ''
                      )}
                    >
                      {index + 1}
                    </span>
                  )}
                  
                  {/* Subtle wave effect when step is filling */}
                  {isBeingFilled && (
                    <div 
                      className="absolute inset-0 rounded-full"
                      style={{
                        background: `radial-gradient(circle, ${theme.main}20 30%, transparent 70%)`,
                        animation: 'step-wave 1.2s ease-in-out infinite',
                      }}
                    />
                  )}
                </div>
                
                {/* Step label with enhanced transitions */}
                <div 
                  className={cn(
                    "text-center transition-all duration-300 ease-in-out max-w-[120px] mt-0",
                    isCompleted ? 'font-medium' : '',
                    isCurrent ? 'font-semibold transform scale-105' : 'font-normal',
                    isBeingFilled ? 'progress-label-filling' : ''
                  )}
                  style={{
                    color: isCompleted || isCurrent ? theme.main : 'var(--color-text-secondary)',
                    // Fade in labels during transitions
                    ...(isCurrentlyAnimating && {
                      color: `rgba(${parseInt(theme.main.slice(4,7))}, ${parseInt(theme.main.slice(8,11))}, ${parseInt(theme.main.slice(12,15))}, ${stepCompletionPercent/100 * 0.7 + 0.3})`,
                    })
                  }}
                >
                  <span className={cn(
                    "block truncate transition-all duration-300",
                    isCurrent ? 'text-sm' : 'text-xs',
                  )}>
                    {step}
                  </span>
                </div>
                
                {/* Enhanced animations for current step - client-side only */}
                {isMounted && isCurrent && (
                  <>
                    {/* Instead of using absolute positioned rings, use a ::before pseudo-element in the CSS */}
                  </>
                )}

                {/* Status indicators with fade-in/out animations */}
                {variant !== 'compact' && isPending && (
                  <div 
                    className={cn(
                      "absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs text-text-tertiary",
                      transition === 'none' ? 'opacity-60' : '',
                      transition === 'forward' && index === currentStep + 1 ? 'progress-status-fade-in' : 'opacity-60',
                      transition === 'backward' && index === prevStep ? 'progress-status-fade-out' : 'opacity-60'
                    )}
                    style={{ fontStyle: 'italic' }}
                    aria-hidden="true"
                  >
                    Pending
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Add styles for animations */}
      <style dangerouslySetInnerHTML={{ __html: `
        /* Progress bar animations */
        @keyframes progress-flow {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        
        @keyframes progress-glow {
          0% { opacity: 0; transform: translateX(-100%); }
          50% { opacity: 0.8; }
          100% { opacity: 0; transform: translateX(100%); }
        }
        
        /* Force the active step to position: relative for proper z-index stacking */
        div[data-step][aria-selected="true"] {
          position: relative;
        }
        
        /* Pulse animation using pseudo-elements for better layering */
        .active-step {
          position: relative;
        }
        
        .active-step::before,
        .active-step::after {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          border-radius: 50%;
          z-index: -1;
        }
        
        .active-step::before {
          width: 42px;
          height: 42px;
          border: 2px solid var(--theme-color, var(--color-primary));
          opacity: 0.2;
        }
        
        .active-step::after {
          width: 36px;
          height: 36px;
          border: 2px solid var(--theme-color, var(--color-primary));
          opacity: 0.3;
        }
        
        .pulse-animation::before {
          animation: active-step-ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;
        }
        
        .pulse-animation::after {
          animation: active-step-pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        
        .pulse-in-animation::before {
          animation: progress-ring-in 0.6s ease-out forwards;
        }
        
        .pulse-in-animation::after {
          animation: progress-ring-pulse-in 0.7s ease-out forwards;
        }
        
        .pulse-back-animation::before {
          animation: progress-ring-back 0.6s ease-out forwards;
        }
        
        .pulse-back-animation::after {
          animation: progress-ring-pulse-back 0.7s ease-out forwards;
        }
        
        @keyframes active-step-ping {
          75%, 100% {
            transform: translate(-50%, -50%) scale(1.2);
            opacity: 0;
          }
        }
        
        @keyframes active-step-pulse {
          0%, 100% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 0.3;
          }
          50% {
            transform: translate(-50%, -50%) scale(1.05);
            opacity: 0.15;
          }
        }
        
        /* Step filling effects */
        @keyframes step-wave {
          0% { transform: scale(0.9); opacity: 0.3; }
          50% { transform: scale(1.1); opacity: 0.5; }
          100% { transform: scale(0.9); opacity: 0.3; }
        }
        
        .progress-step-filling {
          animation: step-pulse 0.8s ease-in-out infinite;
        }
        
        .progress-label-filling {
          animation: label-pulse 0.8s ease-in-out infinite;
        }
        
        @keyframes step-pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.08); }
          100% { transform: scale(1); }
        }
        
        @keyframes label-pulse {
          0% { opacity: 0.7; }
          50% { opacity: 1; }
          100% { opacity: 0.7; }
        }
        
        /* Floating animations */
        @keyframes float-ring {
          0% { transform: translate(0, 0) scale(0.9); opacity: 0.2; }
          40% { transform: translate(0, -15px) scale(1.1); opacity: 0.3; }
          100% { transform: translate(0, -30px) scale(0.8); opacity: 0; }
        }
        
        @keyframes float-glow {
          0% { transform: translate(0, 0) scale(0.9); opacity: 0.4; }
          70% { transform: translate(0, -25px) scale(1.3); opacity: 0.2; }
          100% { transform: translate(0, -40px) scale(0.8); opacity: 0; }
        }
        
        @keyframes floating-particle-1 {
          0% { transform: translate(0, 0) scale(0.8); opacity: 0.7; }
          100% { transform: translate(-15px, -40px) scale(0.3); opacity: 0; }
        }
        
        @keyframes floating-particle-2 {
          0% { transform: translate(0, 0) scale(0.7); opacity: 0.6; }
          100% { transform: translate(-5px, -35px) scale(0.4); opacity: 0; }
        }
        
        @keyframes floating-particle-3 {
          0% { transform: translate(0, 0) scale(0.9); opacity: 0.8; }
          100% { transform: translate(8px, -45px) scale(0.3); opacity: 0; }
        }
        
        @keyframes floating-particle-4 {
          0% { transform: translate(0, 0) scale(0.6); opacity: 0.7; }
          100% { transform: translate(12px, -38px) scale(0.5); opacity: 0; }
        }
        
        @keyframes floating-particle-5 {
          0% { transform: translate(0, 0) scale(0.8); opacity: 0.6; }
          100% { transform: translate(3px, -42px) scale(0.2); opacity: 0; }
        }
        
        /* Dot animations */
        @keyframes progress-pulse {
          0%, 100% { transform: translate(50%, -50%) scale(1); opacity: 1; box-shadow: 0 0 6px rgba(25, 118, 210, 0.5); }
          50% { transform: translate(50%, -50%) scale(1.2); opacity: 0.8; box-shadow: 0 0 10px rgba(25, 118, 210, 0.7); }
        }
        
        /* Step animations */
        @keyframes progress-step-activate {
          0% { transform: scale(0.9); opacity: 0.7; }
          50% { transform: scale(1.05); }
          100% { transform: scale(1); opacity: 1; }
        }
        
        @keyframes progress-step-complete {
          0% { transform: scale(1); }
          30% { transform: scale(1.1); }
          100% { transform: scale(1); }
        }
        
        @keyframes progress-step-reactivate {
          0% { transform: translateY(10px); opacity: 0.7; }
          100% { transform: translateY(0); opacity: 1; }
        }
        
        @keyframes progress-step-revert {
          0% { transform: translateY(-10px); opacity: 0.7; }
          100% { transform: translateY(0); opacity: 1; }
        }
        
        /* Checkmark animations */
        @keyframes progress-checkmark {
          0% { stroke-dasharray: 20; stroke-dashoffset: 20; opacity: 0; }
          70% { stroke-dasharray: 20; stroke-dashoffset: 0; opacity: 1; }
          100% { stroke-dasharray: 20; stroke-dashoffset: 0; opacity: 1; }
        }
        
        @keyframes progress-checkmark-exit {
          0% { stroke-dasharray: 20; stroke-dashoffset: 0; opacity: 1; }
          100% { stroke-dasharray: 20; stroke-dashoffset: 20; opacity: 0; }
        }
        
        /* Number animations */
        @keyframes progress-number-pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.15); }
          100% { transform: scale(1); }
        }
        
        /* Ring animations - perfectly aligned */
        @keyframes progress-ring-in {
          0% { transform: scale(0.5) translate(0, 0); opacity: 0; }
          50% { transform: scale(1.2) translate(0, 0); opacity: 0.4; }
          100% { transform: scale(1) translate(0, 0); opacity: 0.2; }
        }
        
        @keyframes progress-ring-back {
          0% { transform: scale(0.8) translate(0, 0); opacity: 0; }
          50% { transform: scale(1.1) translate(0, 0); opacity: 0.3; }
          100% { transform: scale(1) translate(0, 0); opacity: 0.2; }
        }
        
        @keyframes progress-ring-pulse-in {
          0% { transform: scale(0.6) translate(0, 0); opacity: 0; }
          70% { transform: scale(1.1) translate(0, 0); opacity: 0.4; }
          100% { transform: scale(1) translate(0, 0); opacity: 0.3; }
        }
        
        @keyframes progress-ring-pulse-back {
          0% { transform: scale(0.9) translate(0, 0); opacity: 0.1; }
          60% { transform: scale(1.05) translate(0, 0); opacity: 0.35; }
          100% { transform: scale(1) translate(0, 0); opacity: 0.3; }
        }
        
        /* Status indicators animations */
        @keyframes progress-status-fade-in {
          0% { opacity: 0; transform: translate(-50%, -10px); }
          100% { opacity: 0.6; transform: translate(-50%, 0); }
        }
        
        @keyframes progress-status-fade-out {
          0% { opacity: 0.6; transform: translate(-50%, 0); }
          100% { opacity: 0; transform: translate(-50%, 10px); }
        }
        
        /* Animation classes */
        .progress-checkmark {
          stroke-dasharray: 20;
          stroke-dashoffset: 0;
          animation: progress-checkmark 0.6s ease-in-out forwards;
        }
        
        .progress-checkmark-exit {
          animation: progress-checkmark-exit 0.4s ease-in-out forwards;
        }
        
        .progress-number-pulse {
          animation: progress-number-pulse 2s infinite;
        }
        
        .progress-step-activate {
          animation: progress-step-activate 0.5s ease-out forwards;
        }
        
        .progress-step-complete {
          animation: progress-step-complete 0.5s ease-out forwards;
        }
        
        .progress-step-reactivate {
          animation: progress-step-reactivate 0.5s ease-out forwards;
        }
        
        .progress-step-revert {
          animation: progress-step-revert 0.5s ease-out forwards;
        }
        
        .progress-ring-in {
          animation: progress-ring-in 0.6s ease-out forwards;
        }
        
        .progress-ring-back {
          animation: progress-ring-back 0.6s ease-out forwards;
        }
        
        .progress-ring-pulse-in {
          animation: progress-ring-pulse-in 0.7s ease-out forwards;
        }
        
        .progress-ring-pulse-back {
          animation: progress-ring-pulse-back 0.7s ease-out forwards;
        }
        
        .progress-status-fade-in {
          animation: progress-status-fade-in 0.4s ease-out forwards;
        }
        
        .progress-status-fade-out {
          animation: progress-status-fade-out 0.4s ease-out forwards;
        }
      `}} />
    </div>
  );
}