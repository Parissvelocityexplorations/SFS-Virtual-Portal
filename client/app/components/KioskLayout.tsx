import React, { useState, useEffect, useRef } from 'react';
import ProgressSteps from './ProgressSteps';
import { useNavigate, useLocation } from '@remix-run/react';

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
  const location = useLocation();
  const contentRef = useRef<HTMLDivElement>(null);
  
  // State for page transition animations
  const [isPageTransitioning, setIsPageTransitioning] = useState(false);
  const [pageTransitionDirection, setPageTransitionDirection] = useState<'forward' | 'backward'>('forward');
  const [prevPath, setPrevPath] = useState(location.pathname);
  const [prevStep, setPrevStep] = useState(currentStep);
  const [animatingStep, setAnimatingStep] = useState(currentStep);
  const [isFirstRender, setIsFirstRender] = useState(true);
  const [isProgressAnimating, setIsProgressAnimating] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [isCompactView, setIsCompactView] = useState(false);
  
  // Steps for the progress indicator
  const steps = [
    "Start",
    "Information",
    "Service",
    "Schedule",
    "Review",
    "Confirmation"
  ];

  // Check for client-side window after component mounts
  useEffect(() => {
    setIsMounted(true);
    
    // Set compact view based on window width
    if (typeof window !== 'undefined') {
      setIsCompactView(window.innerWidth < 768);
      
      const handleResize = () => {
        setIsCompactView(window.innerWidth < 768);
      };
      
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);

  // Handle step changes for smooth transitions
  useEffect(() => {
    if (isFirstRender) {
      setIsFirstRender(false);
      return;
    }
    
    // Only animate if the step has actually changed
    if (currentStep !== prevStep) {
      // Determine direction
      const direction = currentStep > prevStep ? 'forward' : 'backward';
      setPageTransitionDirection(direction);
      
      // Start page transition out
      setIsPageTransitioning(true);
      setIsProgressAnimating(true);
      
      // Begin fade-out animation for current content
      const fadeOutTimer = setTimeout(() => {
        // Update step for progress bar animation
        setAnimatingStep(currentStep);
        
        // Begin fade-in animation for new content
        const fadeInTimer = setTimeout(() => {
          setIsPageTransitioning(false);
          
          // After content is visible, update step state
          setPrevStep(currentStep);
          
          // Complete progress animation after content is visible
          const progressCompleteTimer = setTimeout(() => {
            setIsProgressAnimating(false);
          }, 300);
          
          return () => clearTimeout(progressCompleteTimer);
        }, 400);
        
        return () => clearTimeout(fadeInTimer);
      }, 300);
      
      return () => clearTimeout(fadeOutTimer);
    }
  }, [currentStep, prevStep, isFirstRender]);

  // Handle path changes for location-based transitions
  useEffect(() => {
    if (isFirstRender) return;
    
    // Only handle transitions not triggered by step changes
    if (currentStep === prevStep) {
      const newDirection = location.pathname.length > prevPath.length ? 'forward' : 'backward';
      setPageTransitionDirection(newDirection);
      setIsPageTransitioning(true);
      
      // Reset transition state after animation completes
      const resetTimer = setTimeout(() => {
        setIsPageTransitioning(false);
      }, 600);
      
      // Update stored path
      setPrevPath(location.pathname);
      
      return () => clearTimeout(resetTimer);
    }
  }, [location.pathname, prevPath, isFirstRender, currentStep, prevStep]);
  
  // Handle back navigation with transition
  const handleBackWithTransition = () => {
    if (onBack) {
      setPageTransitionDirection('backward');
      setIsPageTransitioning(true);
      
      // Slight delay for animation to start before navigation
      setTimeout(() => {
        onBack();
      }, 50);
    }
  };

  return (
    <div className="min-h-screen space-pattern relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        {/* Space-themed decorative elements */}
        <div className="absolute top-[10%] right-[15%] w-64 h-64 bg-primary/5 rounded-full blur-3xl opacity-60 animate-pulse" />
        <div className="absolute bottom-[20%] left-[10%] w-96 h-96 bg-secondary/5 rounded-full blur-3xl opacity-50 animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-[40%] left-[25%] w-48 h-48 bg-accent/5 rounded-full blur-3xl opacity-40 animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      {/* Page content */}
      <div className="mx-auto max-w-5xl px-4 md:px-8 pt-0 pb-12 relative z-10">
        {/* Top header bar */}
        <header className="flex items-center justify-between py-4 md:py-5 border-b border-divider/40 mb-6 md:mb-8 backdrop-blur-sm bg-white/60 sticky top-0 z-20 rounded-b-lg shadow-sm">
          <div className="flex items-center pl-3">
            <div className="flex items-center">
              <img 
                src="/Space_Launch_Delta_45_emblem 2.png" 
                alt="Space Launch Delta 45" 
                className="h-12 w-auto mr-4 self-center" 
              />
              <h1 className="text-xl md:text-2xl font-bold text-text-primary tracking-tight bg-gradient-to-r from-primary to-primary-dark bg-clip-text text-transparent self-center mt-1.5">
                Space Force Appointment Portal
              </h1>
            </div>
          </div>
          
          <div className="flex items-center">
            <button 
              onClick={() => navigate('/')}
              className="btn-text btn-icon btn-icon-left rounded-md hover:bg-primary/10 transition-all"
              aria-label="Return to Home"
            >
              <svg className="btn-icon-left w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
              </svg>
              Return to Home
            </button>
          </div>
        </header>
        
        {/* Main content area */}
        <div className="backdrop-blur-sm bg-white/90 rounded-xl shadow-lg p-6 md:p-8 relative overflow-hidden">
          <div className="absolute -top-16 -right-16 w-32 h-32 bg-primary/5 rounded-full blur-xl opacity-70" />
          <div className="absolute -bottom-16 -left-16 w-32 h-32 bg-secondary/5 rounded-full blur-xl opacity-70" />
          
          {/* Progress steps with flowing transitions */}
          {showProgressSteps && (
            <div className={`progress-container fade-in ${isProgressAnimating ? 'animating' : ''}`}>
              <ProgressSteps 
                steps={steps} 
                currentStep={animatingStep}
                className={isProgressAnimating ? 'animating' : ''}
                colorTheme="primary"
                variant={isCompactView ? 'compact' : 'default'}
              />
            </div>
          )}
          
          {/* Page heading with back button */}
          <div className="mb-8 flex items-center fade-in-delay-1">
            {showBackButton && (
              <button 
                onClick={handleBackWithTransition}
                className="btn-outline btn-sm btn-icon btn-icon-left mr-4 flex items-center font-medium"
                aria-label="Go back"
              >
                <svg className="btn-icon-left w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back
              </button>
            )}
            <h2 className="text-2xl md:text-3xl font-bold text-text-primary tracking-tight">
              {title}
            </h2>
          </div>
          
          {/* Main content with enhanced page transition */}
          <div 
            ref={contentRef}
            className={`relative transition-all duration-500 ease-in-out z-10 fade-in-delay-2 ${
              isPageTransitioning 
                ? pageTransitionDirection === 'forward' 
                  ? 'opacity-0 translate-x-8 scale-[0.98]' 
                  : 'opacity-0 -translate-x-8 scale-[0.98]'
                : 'opacity-100 translate-x-0 scale-100'
            }`}
          >
            {children}
          </div>
        </div>
        
        {/* Enhanced Footer */}
        <footer className="mt-8 py-6 text-center text-text-secondary text-sm flex flex-col md:flex-row justify-between items-center bg-white/30 backdrop-blur-sm rounded-lg px-6 border border-divider/30 shadow-sm">
          <div className="mb-4 md:mb-0 flex items-center">
            <div className="mr-2 w-5 h-5 text-primary opacity-80">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 6V12L16 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span>&copy; 2025 Space Force Appointment Portal. All rights reserved.</span>
          </div>
          
          <div className="flex items-center space-x-6">
            <a href="#" className="btn-text text-sm hover:underline focus:ring-primary/40 focus:ring-2 focus:outline-none rounded">
              Privacy Policy
            </a>
            <a href="#" className="btn-text text-sm hover:underline focus:ring-primary/40 focus:ring-2 focus:outline-none rounded">
              DoD Section 508
            </a>
            <a href="#" className="btn-text text-sm hover:underline focus:ring-primary/40 focus:ring-2 focus:outline-none rounded">
              Contact
            </a>
          </div>
        </footer>
      </div>
      
      {/* Enhanced Page transition style */}
      <style dangerouslySetInnerHTML={{ __html: `
        .progress-container {
          transition: all 0.4s ease-out;
        }
        
        .progress-container.animating {
          opacity: 0.9;
        }
        
        /* Enhanced animation timing functions for smoother motion */
        @keyframes flow-progress {
          0% { transform: translateY(0); opacity: 1; }
          40% { transform: translateY(-10px); opacity: 0; }
          60% { transform: translateY(10px); opacity: 0; }
          100% { transform: translateY(0); opacity: 1; }
        }
        
        @keyframes slide-in-right {
          0% { transform: translateX(30px) scale(0.97); opacity: 0; }
          60% { transform: translateX(-5px) scale(1.01); opacity: 1; }
          100% { transform: translateX(0) scale(1); opacity: 1; }
        }
        
        @keyframes slide-in-left {
          0% { transform: translateX(-30px) scale(0.97); opacity: 0; }
          60% { transform: translateX(5px) scale(1.01); opacity: 1; }
          100% { transform: translateX(0) scale(1); opacity: 1; }
        }
        
        @keyframes slide-out-right {
          0% { transform: translateX(0) scale(1); opacity: 1; }
          30% { transform: translateX(5px) scale(0.99); opacity: 0.9; }
          100% { transform: translateX(30px) scale(0.97); opacity: 0; }
        }
        
        @keyframes slide-out-left {
          0% { transform: translateX(0) scale(1); opacity: 1; }
          30% { transform: translateX(-5px) scale(0.99); opacity: 0.9; }
          100% { transform: translateX(-30px) scale(0.97); opacity: 0; }
        }
        
        /* Floating animations for background elements */
        @keyframes float-slow {
          0%, 100% { transform: translateY(0) translateX(0); }
          25% { transform: translateY(-10px) translateX(5px); }
          50% { transform: translateY(0) translateX(10px); }
          75% { transform: translateY(10px) translateX(5px); }
        }
        
        /* Gradient shimmer animation */
        @keyframes gradient-shimmer {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}} />
    </div>
  );
}