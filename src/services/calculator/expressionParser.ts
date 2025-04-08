
/**
 * Functions for parsing mathematical expressions
 */

// Map of scientific function names to their JavaScript equivalents
const scientificFunctions = {
  'sin': Math.sin,
  'cos': Math.cos,
  'tan': Math.tan,
  'log': Math.log10,
  'ln': Math.log,
  'sqrt': Math.sqrt,
  'π': Math.PI,
  'e': Math.E
};

/**
 * Tokenize the expression into numbers and operators
 */
export function tokenize(expression: string): string[] {
  const tokens: string[] = [];
  let currentNumber = '';
  let currentFunction = '';
  let i = 0;
  
  while (i < expression.length) {
    const char = expression[i];
    
    if (/[0-9.]/.test(char)) {
      // If the character is a digit or decimal point, add to current number
      if (currentFunction) {
        tokens.push(currentFunction);
        currentFunction = '';
      }
      currentNumber += char;
    } else if (/[a-zπe]/i.test(char)) {
      // Function name or special constant
      if (currentNumber) {
        tokens.push(currentNumber);
        currentNumber = '';
      }
      currentFunction += char;
    } else {
      // If we have a number stored, add it to tokens and reset
      if (currentNumber) {
        tokens.push(currentNumber);
        currentNumber = '';
      }
      
      // If we have a function name stored, add it to tokens and reset
      if (currentFunction) {
        tokens.push(currentFunction);
        currentFunction = '';
      }
      
      if (char === ' ') {
        // Skip spaces
      } else if (char === '-' && (i === 0 || /[+\-*/^(]/.test(expression[i - 1]) || expression[i-1] === ' ')) {
        // Handle negative numbers
        currentNumber = '-';
      } else {
        // Add operator or parenthesis as a token
        tokens.push(char);
      }
    }
    
    i++;
  }
  
  // Add the last number or function if there is one
  if (currentNumber) {
    tokens.push(currentNumber);
  }
  
  if (currentFunction) {
    tokens.push(currentFunction);
  }
  
  return tokens;
}

/**
 * Sanitize the expression before evaluation
 */
export function sanitizeExpression(expression: string): string {
  // Replace multiple spaces with a single space
  let sanitized = expression.replace(/\s+/g, ' ').trim();
  
  // Replace ÷ with / and × with *
  sanitized = sanitized.replace(/÷/g, '/').replace(/×/g, '*');
  
  // Replace pi with π and special function syntax
  sanitized = sanitized.replace(/\bpi\b/gi, 'π');
  
  // Handle percentage operator
  sanitized = sanitized.replace(/(\d+)%/g, '($1/100)');
  
  // Add missing multiplication operators between a number and opening parenthesis
  sanitized = sanitized.replace(/(\d)\s*\(/g, '$1 * (');
  
  // Add missing multiplication operators between closing and opening parentheses
  sanitized = sanitized.replace(/\)\s*\(/g, ') * (');
  
  // Add missing multiplication between number and function
  sanitized = sanitized.replace(/(\d)\s*(sin|cos|tan|log|ln|sqrt)/gi, '$1 * $2');
  
  // Add missing multiplication between closing parenthesis and function
  sanitized = sanitized.replace(/\)\s*(sin|cos|tan|log|ln|sqrt)/gi, ') * $1');
  
  // Add missing multiplication with π and e
  sanitized = sanitized.replace(/(\d)\s*π/g, '$1 * π');
  sanitized = sanitized.replace(/π\s*(\d)/g, 'π * $1');
  sanitized = sanitized.replace(/\)\s*π/g, ') * π');
  sanitized = sanitized.replace(/π\s*\(/g, 'π * (');
  
  sanitized = sanitized.replace(/(\d)\s*e/g, '$1 * e');
  sanitized = sanitized.replace(/e\s*(\d)/g, 'e * $1');
  sanitized = sanitized.replace(/\)\s*e/g, ') * e');
  sanitized = sanitized.replace(/e\s*\(/g, 'e * (');
  
  return sanitized;
}

// Export scientific functions for the evaluator
export { scientificFunctions };
