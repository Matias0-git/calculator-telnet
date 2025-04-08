
import { updateExpression } from '../calculatorUtils';

interface UseCalculatorInputProps {
  displayValue: string;
  expression: string;
  lastResult: string;
  isNewInput: boolean;
  isCalculating: boolean;
  setDisplayValue: (value: string) => void;
  setExpression: (value: string) => void;
  setIsNewInput: (value: boolean) => void;
}

export const useCalculatorInput = ({
  displayValue,
  expression,
  lastResult,
  isNewInput,
  isCalculating,
  setDisplayValue,
  setExpression,
  setIsNewInput
}: UseCalculatorInputProps) => {
  
  // Update the expression in calculatorUtils when it changes
  updateExpression(expression);
  
  const handleClear = () => {
    setDisplayValue('0');
    setExpression('');
    setIsNewInput(true);
  };

  const handleBackspace = () => {
    if (isCalculating) return;
    
    if (isNewInput || displayValue === '0' || displayValue === 'Error') {
      setDisplayValue('0');
      setIsNewInput(true);
    } else {
      // Remove the last character
      const newValue = displayValue.length > 1 
        ? displayValue.slice(0, -1) 
        : '0';
      
      setDisplayValue(newValue);
      
      // Update expression if needed
      if (!/[+\-*/^()]/.test(displayValue)) {
        const currentExpression = expression || '';
        const lastSpace = currentExpression.lastIndexOf(' ');
        const newExpression = lastSpace >= 0 ? currentExpression.slice(0, lastSpace) : '';
        setExpression(newExpression);
      }
    }
  };

  // List of scientific functions
  const scientificFunctions = ['sin', 'cos', 'tan', 'log', 'ln', 'sqrt', 'π', 'e', '%'];

  const handleNumericInput = (value: string) => {
    if (isCalculating) return;
    
    // Handle scientific functions
    if (scientificFunctions.includes(value)) {
      if (value === '%') {
        // Handle percentage
        if (!isNewInput && /\d$/.test(displayValue)) {
          const currentExpression = expression || displayValue;
          setExpression(currentExpression + '%');
          setDisplayValue(displayValue + '%');
        }
        return;
      }
      
      if (isNewInput) {
        if (value === 'π' || value === 'e') {
          // Constants can be used directly
          setDisplayValue(value);
          setExpression(value);
        } else {
          // Functions need parentheses
          setDisplayValue(value + '(');
          setExpression(value + '(');
        }
        setIsNewInput(false);
      } else {
        if (value === 'π' || value === 'e') {
          // If we're in the middle of typing, add multiplication sign implicitly
          if (/\d$/.test(displayValue)) {
            const newDisplayValue = displayValue + '*' + value;
            const newExpression = expression + '*' + value;
            setDisplayValue(newDisplayValue);
            setExpression(newExpression);
          } else {
            const newDisplayValue = displayValue + value;
            const newExpression = expression + value;
            setDisplayValue(newDisplayValue);
            setExpression(newExpression);
          }
        } else {
          // Functions need parentheses
          setDisplayValue(value + '(');
          const currentExpression = expression || '';
          const newExpression = currentExpression + value + '(';
          setExpression(newExpression);
        }
      }
      return;
    }
    
    // If we have a result and are starting a new calculation
    if (isNewInput) {
      // Start a new expression if operator is pressed
      if (['+', '-', '*', '/', '^'].includes(value)) {
        // Use the last result as the start of a new expression
        setExpression(lastResult || '0');
        setDisplayValue(value);
      } else if (value === '.') {
        // Starting with a decimal point
        setDisplayValue('0.');
        setExpression('0.');
      } else if (value === '(' || value === ')') {
        // Handle parentheses
        setDisplayValue(value);
        setExpression(value);
      } else {
        // Starting with a number
        setDisplayValue(value);
        setExpression(value);
      }
      setIsNewInput(false);
    } else {
      // Continue building the current expression
      if (['+', '-', '*', '/', '^'].includes(value)) {
        // Handle operator input
        if (['+', '-', '*', '/', '^'].includes(displayValue.slice(-1))) {
          // Replace the previous operator
          const newDisplayValue = displayValue.slice(0, -1) + value;
          const currentExpression = expression || '';
          const newExpression = currentExpression.slice(0, -2) + ` ${value} `;
          
          setDisplayValue(newDisplayValue);
          setExpression(newExpression);
        } else {
          // Add the operator to the expression
          setDisplayValue(value);
          const currentExpression = expression || '';
          const newExpression = `${currentExpression} ${value} `;
          
          setExpression(newExpression);
        }
      } else if (value === '.') {
        // Handle decimal point
        if (!displayValue.includes('.')) {
          const newDisplayValue = displayValue + value;
          const currentExpression = expression || '';
          const newExpression = currentExpression + value;
          
          setDisplayValue(newDisplayValue);
          setExpression(newExpression);
        }
      } else if (value === '(' || value === ')') {
        // Handle parentheses
        setDisplayValue(value);
        const currentExpression = expression || '';
        const newExpression = currentExpression + value;
        
        setExpression(newExpression);
      } else {
        // Handle numeric input
        if (['+', '-', '*', '/', '^'].includes(displayValue)) {
          setDisplayValue(value);
          const currentExpression = expression || '';
          const newExpression = currentExpression + value;
          
          setExpression(newExpression);
        } else if (displayValue === '0') {
          setDisplayValue(value);
          setExpression(value);
        } else {
          const newDisplayValue = displayValue === '(' || displayValue === ')' 
            ? displayValue + value 
            : displayValue + value;
            
          const currentExpression = expression || '';
          const newExpression = currentExpression + value;
          
          setDisplayValue(newDisplayValue);
          setExpression(newExpression);
        }
      }
    }
  };

  const handleInputOperation = (value: string) => {
    switch (value) {
      case 'C':
        handleClear();
        break;
      case '←':
        handleBackspace();
        break;
      default:
        handleNumericInput(value);
        break;
    }
  };

  return {
    handleInputOperation
  };
};
