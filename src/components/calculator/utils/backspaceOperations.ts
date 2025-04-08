/**
 * Utility functions for backspace operations
 */

// Keep track of current expression state
let currentExpression = '';

/**
 * Update the stored expression value
 */
export const updateExpression = (newExpression: string) => {
  currentExpression = newExpression;
};

/**
 * Handle backspace operation
 */
export const handleBackspace = (
  isCalculating: boolean,
  isNewInput: boolean,
  displayValue: string,
  setDisplayValue: (value: string) => void,
  setIsNewInput: (value: boolean) => void,
  setExpression: (value: string) => void
) => {
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
      const lastSpace = currentExpression.lastIndexOf(' ');
      const newExpression = lastSpace >= 0 ? currentExpression.slice(0, lastSpace) : '';
      setExpression(newExpression);
    }
  }
};
