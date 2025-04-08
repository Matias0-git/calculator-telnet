
/**
 * Formatter for numeric calculation results
 */

/**
 * Format numeric result to prevent excessive decimal places
 */
export function formatResult(result: number): string {
  // Check if the result is an integer
  if (Number.isInteger(result)) {
    return result.toString();
  }
  
  // Convert to string with up to 8 decimal places
  let formattedResult = result.toFixed(8);
  
  // Remove trailing zeros
  formattedResult = formattedResult.replace(/\.?0+$/, '');
  
  return formattedResult;
}
