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
          
          {/* Progress steps with flowing transitions */}
          {showProgressSteps && (
            <div className="progress-container">
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
          <div className="mb-8 flex items-center">
            {showBackButton && (
              <button 
                onClick={handleBackWithTransition}
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
          
          {/* Main content with page transition */}
          <div 
            ref={contentRef}
            className={`relative transition-all duration-500 ease-in-out ${
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
      
      {/* Page transition style */}
      <style dangerouslySetInnerHTML={{ __html: `
        .progress-container {
          transition: all 0.4s ease-out;
        }
        
        .progress-container.animating {
          opacity: 0.9;
        }
        
        @keyframes flow-progress {
          0% { transform: translateY(0); opacity: 1; }
          40% { transform: translateY(-10px); opacity: 0; }
          60% { transform: translateY(10px); opacity: 0; }
          100% { transform: translateY(0); opacity: 1; }
        }
        
        @keyframes slide-in-right {
          0% { transform: translateX(30px) scale(0.97); opacity: 0; }
          100% { transform: translateX(0) scale(1); opacity: 1; }
        }
        
        @keyframes slide-in-left {
          0% { transform: translateX(-30px) scale(0.97); opacity: 0; }
          100% { transform: translateX(0) scale(1); opacity: 1; }
        }
        
        @keyframes slide-out-right {
          0% { transform: translateX(0) scale(1); opacity: 1; }
          100% { transform: translateX(30px) scale(0.97); opacity: 0; }
        }
        
        @keyframes slide-out-left {
          0% { transform: translateX(0) scale(1); opacity: 1; }
          100% { transform: translateX(-30px) scale(0.97); opacity: 0; }
        }
      `}} />
    </div>
  );
}