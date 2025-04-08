
import { useState, useEffect } from 'react';
import { useCalculatorInput } from './useCalculatorInput';
import { useCalculatorEvaluation } from './useCalculatorEvaluation';

interface UseCalculatorStateProps {
  initialExpression?: string;
  initialResult?: string;
}

export const useCalculatorState = ({ 
  initialExpression = '', 
  initialResult = '0' 
}: UseCalculatorStateProps = {}) => {
  const [displayValue, setDisplayValue] = useState(initialResult);
  const [expression, setExpression] = useState(initialExpression);
  const [isCalculating, setIsCalculating] = useState(false);
  const [lastResult, setLastResult] = useState(initialResult);
  const [isNewInput, setIsNewInput] = useState(true);

  // Update values when props change (for telnet integration)
  useEffect(() => {
    if (initialResult && initialResult !== '0') {
      setDisplayValue(initialResult);
      setLastResult(initialResult);
    }
    if (initialExpression) {
      setExpression(initialExpression);
    }
  }, [initialExpression, initialResult]);
  
  // Input handling logic
  const { handleInputOperation } = useCalculatorInput({
    displayValue,
    expression,
    lastResult,
    isNewInput,
    isCalculating,
    setDisplayValue,
    setExpression,
    setIsNewInput
  });
  
  // Evaluation logic
  const { handleEvaluation } = useCalculatorEvaluation({
    expression,
    isCalculating,
    setDisplayValue,
    setIsCalculating,
    setIsNewInput,
    setLastResult
  });

  // Button click handler
  const handleButtonClick = (value: string) => {
    // Animation for button press
    const element = document.activeElement as HTMLElement;
    if (element) element.blur();
    
    switch (value) {
      case '=':
        handleEvaluation();
        break;
      default:
        handleInputOperation(value);
        break;
    }
  };

  return {
    displayValue,
    expression,
    isCalculating,
    handleButtonClick
  };
};
