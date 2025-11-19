'use client';

import React, { useState } from 'react';

interface AnimatedLetterProps {
    letter: string;
    index: number;
    onLetterHover: (image: string | null) => void;
}

interface AnimatedTitleProps {
  onBackgroundChange: (image: string | null) => void;
}

const letterImages: { [key: string]: string } = {
  0: '/letter-images/w.png',  
  1: '/letter-images/e1.png', 
  2: '/letter-images/l.png',  
  3: '/letter-images/c.png',  
  4: '/letter-images/o1.png', 
  5: '/letter-images/m.png',  
  6: '/letter-images/e2.png', 
  8: '/letter-images/t1.png', 
  9: '/letter-images/o2.png', 
  11: '/letter-images/f.png',
  12: '/letter-images/a1.png', 
  13: '/letter-images/n1.png',
  14: '/letter-images/t2.png', 
  15: '/letter-images/a2.png', 
  16: '/letter-images/s.png',
  17: '/letter-images/y.png',
  19: '/letter-images/n2.png', 
  20: '/letter-images/b.png',
  21: '/letter-images/a3.png',
} 

const titleText = "Welcome to Fantasy NBA";

const AnimatedLetter = ({ letter, index, onLetterHover }: AnimatedLetterProps) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  React.useEffect(() => {
    setIsLoaded(true);
  }, []);
  
  const handleMouseEnter = () => {
    setIsHovered(true);
    setIsAnimating(false); 
    setTimeout(() => {
      setIsAnimating(true);
    }, 10);

    const image = letterImages[index];
    if (image) {
      onLetterHover(image);
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setIsAnimating(false);
    onLetterHover(null);
  };

  const handleAnimationEnd = (e: React.AnimationEvent<HTMLSpanElement>) => {
    if (e.animationName.includes('letterJump')) {
      setIsAnimating(false);
    }
  };
  
  const animationClass = isAnimating ? 'animate-text-jump' : '';
  const hoverColorClass = isHovered ? 'text-[#0693e3]' : '';

  return (
    <span 
      className={`transition-colors duration-150
                  inline-block 
                  cursor-default
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

export default function AnimatedTitle({ onBackgroundChange }: AnimatedTitleProps) {
  // const [backgroundImage, setBackgroundImage] = useState<string | null>(null);

  const animatedTitle = titleText.split('').map((letter, index) => (
      <AnimatedLetter key={index} letter={letter} index={index} onLetterHover={onBackgroundChange}/>
  ));
  
  return <>{animatedTitle}</>;
}