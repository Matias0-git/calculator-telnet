
import { sanitizeExpression } from './calculator/expressionParser.js';
import { evaluateExpression } from './calculator/expressionEvaluator.js';
import { formatResult } from './calculator/resultFormatter.js';

/**
 * Server-side calculator service that handles mathematical operations
 */
export const calculatorService = {
  /**
   * Perform calculation on the server side
   * @param {string} expression - Mathematical expression to evaluate
   */
  calculate: async (expression) => {
    try {
      // Server-side validation
      if (!expression || expression.trim() === '') {
        return { result: '0' };
      }
      
      // Check if the input is a single operator
      if (/^\s*[+\-*/^%]\s*$/.test(expression)) {
        return { 
          result: 'Error', 
          error: 'Single operators are not valid expressions. Enter a complete expression.' 
        };
      }
      
      // Sanitize the expression
      const sanitizedExpression = sanitizeExpression(expression);
      
      // Check for invalid characters
      if (/[^0-9+\-*/().^ sincotaglπe%]/.test(sanitizedExpression)) {
        return { 
          result: 'Error', 
          error: 'Expression contains invalid characters' 
        };
      }

      // Calculate the result
      const result = evaluateExpression(sanitizedExpression);
      
      // Format the result
      const formattedResult = formatResult(result);
      
      return { result: formattedResult };
    } catch (error) {
      console.error('Calculation error:', error);
      return { 
        result: 'Error', 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }
};
