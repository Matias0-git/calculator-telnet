
import React, { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

interface CalculatorDisplayProps {
  value: string;
  expression: string;
  className?: string;
}

const CalculatorDisplay: React.FC<CalculatorDisplayProps> = ({
  value,
  expression,
  className
}) => {
  const displayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Adjust font size based on content length
    if (displayRef.current) {
      const length = value.length;
      let fontSize = 3; // Default size in rem
      
      if (length > 8) fontSize = 2.5;
      if (length > 10) fontSize = 2;
      if (length > 12) fontSize = 1.75;
      if (length > 14) fontSize = 1.5;
      
      displayRef.current.style.fontSize = `${fontSize}rem`;
    }
  }, [value]);

  return (
    <div className={cn('flex flex-col items-end p-4 h-32 bg-calculator-display rounded-2xl shadow-inner overflow-hidden', className)}>
      <div className="text-sm text-gray-500 h-6 overflow-hidden w-full text-right truncate mb-2">
        {expression || '\u00A0'}
      </div>
      <div 
        ref={displayRef}
        className="text-calculator-text font-medium w-full h-full flex items-center justify-end overflow-hidden transition-all duration-200"
      >
        {value}
      </div>
    </div>
  );
};

export default CalculatorDisplay;
