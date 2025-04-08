
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { calculatorService } from '@/services/calculatorService';
import { handleBackspace, handleClear, handleInput, updateExpression } from './calculatorUtils';

interface UseCalculatorProps {
  initialExpression?: string;
  initialResult?: string;
}

export const useCalculator = ({ 
  initialExpression = '', 
  initialResult = '0' 
}: UseCalculatorProps = {}) => {
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

  // Update the expression in the calculatorUtils when it changes
  useEffect(() => {
    updateExpression(expression);
  }, [expression]);

  // Handle button clicks
  const handleButtonClick = (value: string) => {
    // Animation for button press
    const element = document.activeElement as HTMLElement;
    if (element) element.blur();
    
    switch (value) {
      case 'C':
        handleClear(setDisplayValue, setExpression, setIsNewInput);
        break;
      case '=':
        handleEquals();
        break;
      case '←':
        handleBackspace(
          isCalculating,
          isNewInput,
          displayValue,
          setDisplayValue,
          setIsNewInput,
          setExpression
        );
        break;
      default:
        handleInput(
          value,
          isCalculating,
          isNewInput,
          displayValue,
          lastResult,
          setDisplayValue,
          setExpression,
          setIsNewInput
        );
        break;
    }
  };

  // Handle equal operation
  const handleEquals = async () => {
    if (isCalculating || !expression) return;
    
    try {
      setIsCalculating(true);
      
      // Process the calculation on the server
      const result = await calculatorService.calculate(expression);
      
      if (result.error) {
        toast.error(result.error);
        setDisplayValue('Error');
      } else {
        setDisplayValue(result.result);
        setLastResult(result.result);
      }
      
      setIsNewInput(true);
    } catch (error) {
      console.error('Calculation error:', error);
      toast.error('An error occurred during calculation');
      setDisplayValue('Error');
      setIsNewInput(true);
    } finally {
      setIsCalculating(false);
    }
  };

  return {
    displayValue,
    expression,
    isCalculating,
    handleButtonClick
  };
};
