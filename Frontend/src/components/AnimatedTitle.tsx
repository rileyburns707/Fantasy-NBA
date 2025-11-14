'use client';

import React, { useState } from 'react';

interface AnimatedLetterProps {
    letter: string;
    index: number;
}

const titleText = "Welcome to Fantasy NBA";

// Individual letter component (manages its own hover state)
const AnimatedLetter = ({ letter, index }: AnimatedLetterProps) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Set the load state on mount (runs only once)
  React.useEffect(() => {
    setIsLoaded(true);
  }, []);
  
  // Triggers animation restart
  const handleMouseEnter = () => {
    setIsHovered(true);
    setIsAnimating(false); 
    // Small delay to restart the animation
    setTimeout(() => {
      setIsAnimating(true);
    }, 10);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setIsAnimating(false);
  };

  // Resets state after animation completes
  const handleAnimationEnd = (e: React.AnimationEvent<HTMLSpanElement>) => {
    if (e.animationName.includes('letterJump')) {
      setIsAnimating(false);
    }
  };
  
  // Conditionally apply entrance and jump classes
  const entranceClass = isLoaded ? 'animate-text-load-in' : '';
  const animationClass = isAnimating ? 'animate-letter-jump-hover-config' : '';
  const hoverColorClass = isHovered ? 'text-[#0693e3]' : '';

  return (
    <span 
      className={`transition-colors duration-150
                  inline-block 
                  ${entranceClass}
                  ${animationClass}
                  ${hoverColorClass}`} 
      style={{ 
        animationDelay: isAnimating ? '0s' : `${0.01 * index}s`,
      }}
      
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onAnimationEnd={handleAnimationEnd}
    >
      {letter === ' ' ? '\u00A0' : letter} 
    </span>
  );
};

export default function AnimatedTitle() {
    // Map the title text to the new functional component
    const animatedTitle = titleText.split('').map((letter, index) => (
        <AnimatedLetter key={index} letter={letter} index={index} />
    ));
    
    // We only return the array of spans; the <h1> wrapper goes in the parent component
    return <>{animatedTitle}</>;
}