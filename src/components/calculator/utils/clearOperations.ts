
/**
 * Utility functions for clear operations
 */

/**
 * Handle clear operation
 */
export const handleClear = (
  setDisplayValue: (value: string) => void,
  setExpression: (value: string) => void,
  setIsNewInput: (value: boolean) => void
) => {
  setDisplayValue('0');
  setExpression('');
  setIsNewInput(true);
};
