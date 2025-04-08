
import React, { useState } from 'react';
import CalculatorButton from './CalculatorButton';
import { cn } from '@/lib/utils';

interface CalculatorKeypadProps {
  onButtonClick: (value: string) => void;
  isCalculating: boolean;
}

const CalculatorKeypad: React.FC<CalculatorKeypadProps> = ({ 
  onButtonClick, 
  isCalculating 
}) => {
  const [showScientific, setShowScientific] = useState(false);

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-2">
        <button 
          onClick={() => setShowScientific(!showScientific)}
          className="text-xs font-medium px-2 py-1 rounded bg-calculator-function text-calculator-text hover:bg-opacity-80 transition-colors"
        >
          {showScientific ? 'Basic' : 'Scientific'}
        </button>
      </div>

      {showScientific && (
        <div className="grid grid-cols-4 gap-3 mb-3">
          <CalculatorButton value="sin" onClick={onButtonClick} type="function" />
          <CalculatorButton value="cos" onClick={onButtonClick} type="function" />
          <CalculatorButton value="tan" onClick={onButtonClick} type="function" />
          <CalculatorButton value="^" onClick={onButtonClick} type="operator" />
          
          <CalculatorButton value="log" onClick={onButtonClick} type="function" />
          <CalculatorButton value="ln" onClick={onButtonClick} type="function" />
          <CalculatorButton value="sqrt" onClick={onButtonClick} type="function" />
          <CalculatorButton value="π" onClick={onButtonClick} type="function" />
          
          <CalculatorButton value="(" onClick={onButtonClick} type="function" />
          <CalculatorButton value=")" onClick={onButtonClick} type="function" />
          <CalculatorButton value="e" onClick={onButtonClick} type="function" />
          <CalculatorButton value="%" onClick={onButtonClick} type="function" />
        </div>
      )}

      <div className="grid grid-cols-4 gap-3">
        {/* First row */}
        <CalculatorButton value="C" onClick={onButtonClick} type="function" />
        <CalculatorButton value="(" onClick={onButtonClick} type="function" />
        <CalculatorButton value=")" onClick={onButtonClick} type="function" />
        <CalculatorButton value="/" onClick={onButtonClick} type="operator" />
        
        {/* Second row */}
        <CalculatorButton value="7" onClick={onButtonClick} />
        <CalculatorButton value="8" onClick={onButtonClick} />
        <CalculatorButton value="9" onClick={onButtonClick} />
        <CalculatorButton value="*" onClick={onButtonClick} type="operator" />
        
        {/* Third row */}
        <CalculatorButton value="4" onClick={onButtonClick} />
        <CalculatorButton value="5" onClick={onButtonClick} />
        <CalculatorButton value="6" onClick={onButtonClick} />
        <CalculatorButton value="-" onClick={onButtonClick} type="operator" />
        
        {/* Fourth row */}
        <CalculatorButton value="1" onClick={onButtonClick} />
        <CalculatorButton value="2" onClick={onButtonClick} />
        <CalculatorButton value="3" onClick={onButtonClick} />
        <CalculatorButton value="+" onClick={onButtonClick} type="operator" />
        
        {/* Fifth row */}
        <CalculatorButton value="0" onClick={onButtonClick} span="col" />
        <CalculatorButton value="." onClick={onButtonClick} />
        <CalculatorButton 
          value="=" 
          onClick={onButtonClick} 
          type="operator" 
          className={cn(isCalculating ? 'animate-pulse' : '')} 
        />
      </div>
      
      {/* Additional row for backspace */}
      <div className="grid grid-cols-4 gap-3 mt-3">
        <CalculatorButton value="←" onClick={onButtonClick} type="function" span="col" />
      </div>
    </div>
  );
};

export default CalculatorKeypad;
