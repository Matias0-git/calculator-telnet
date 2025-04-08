
import React from 'react';
import CalculatorDisplay from './CalculatorDisplay';
import CalculatorKeypad from './CalculatorKeypad';
import { useCalculatorState } from './hooks/useCalculatorState';

interface CalculatorProps {
  initialExpression?: string;
  initialResult?: string;
}

const Calculator: React.FC<CalculatorProps> = ({ 
  initialExpression = '', 
  initialResult = '0' 
}) => {
  const { 
    displayValue, 
    expression, 
    isCalculating, 
    handleButtonClick 
  } = useCalculatorState({
    initialExpression,
    initialResult
  });

  return (
    <div className="w-full max-w-sm mx-auto">
      <div className="bg-calculator-bg backdrop-blur-md rounded-3xl p-5 shadow-calculator animate-scale-in">
        <CalculatorDisplay 
          value={displayValue} 
          expression={expression} 
          className="mb-4" 
        />
        
        <CalculatorKeypad 
          onButtonClick={handleButtonClick}
          isCalculating={isCalculating}
        />
      </div>
    </div>
  );
};

export default Calculator;
