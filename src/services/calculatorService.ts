
import { CalculationResult } from './calculator/types';
import { sanitizeExpression } from './calculator/expressionParser';
import { evaluateExpression } from './calculator/expressionEvaluator';
import { formatResult } from './calculator/resultFormatter';

/**
 * Server-side calculator service that handles mathematical operations
 */
export const calculatorService = {
  /**
   * Perform calculation on the server side
   * @param expression - Mathematical expression to evaluate
   */
  calculate: async (expression: string): Promise<CalculationResult> => {
    // Simulate server delay
    await new Promise(resolve => setTimeout(resolve, 200));
    
    try {
      // Server-side validation
      if (!expression || expression.trim() === '') {
        return { result: '0' };
      }
      
      // Sanitize the expression
      const sanitizedExpression = sanitizeExpression(expression);
      
      // Check for invalid characters
      if (/[^0-9+\-*/().^ sincotaglπe]/.test(sanitizedExpression)) {
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
