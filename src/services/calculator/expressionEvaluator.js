
/**
 * Functions for evaluating mathematical expressions
 */
import { tokenize, scientificFunctions } from './expressionParser.js';

/**
 * Evaluate a mathematical expression following order of operations
 */
export function evaluateExpression(expression) {
  // Handle empty expressions or single operators
  if (!expression || /^\s*[+\-*/^%]\s*$/.test(expression)) {
    throw new Error('Invalid expression: Please enter a complete mathematical expression');
  }
  
  // Handle parentheses first
  const tokens = tokenize(expression);
  return parseExpression(tokens);
}

/**
 * Parse and evaluate an expression from tokens
 */
function parseExpression(tokens) {
  let index = 0;
  
  function parsePrimary() {
    if (index >= tokens.length) {
      throw new Error('Unexpected end of expression');
    }
    
    const token = tokens[index++];
    
    if (token === '(') {
      // Handle parenthesized expression
      const value = parseAdditive();
      
      // Make sure we have a closing parenthesis
      if (index < tokens.length && tokens[index] === ')') {
        index++; // Skip the closing parenthesis
      } else {
        throw new Error('Missing closing parenthesis');
      }
      
      return value;
    } else if (/^-?\d+(\.\d+)?$/.test(token)) {
      // Handle numbers
      return parseFloat(token);
    } else if (token === 'π') {
      // Handle pi constant
      return Math.PI;
    } else if (token === 'e') {
      // Handle Euler's number
      return Math.E;
    } else if (token === '%') {
      // Handle percentage
      const prevValue = tokens[index - 2];
      if (prevValue && /^-?\d+(\.\d+)?$/.test(prevValue)) {
        return parseFloat(prevValue) / 100;
      }
      throw new Error('Invalid percentage operation');
    } else if (token in scientificFunctions) {
      // Handle scientific functions
      // Need to look ahead for an opening parenthesis
      if (index < tokens.length && tokens[index] === '(') {
        index++; // Skip the opening parenthesis
        const arg = parseAdditive();
        
        // Make sure we have a closing parenthesis
        if (index < tokens.length && tokens[index] === ')') {
          index++; // Skip the closing parenthesis
        } else {
          throw new Error(`Missing closing parenthesis for ${token} function`);
        }
        
        // Apply the function
        const func = scientificFunctions[token];
        if (typeof func === 'function') {
          return func(arg);
        } else if (typeof func === 'number') {
          return func; // For constants like π and e
        }
      } else if (typeof scientificFunctions[token] === 'number') {
        // For constants like π and e that don't need parentheses
        return scientificFunctions[token];
      }
      throw new Error(`Invalid function call: ${token}`);
    } else {
      throw new Error(`Unexpected token: ${token}`);
    }
  }
  
  function parseFactor() {
    let left = parsePrimary();
    
    while (index < tokens.length) {
      const operator = tokens[index];
      if (operator === '^') {
        index++;
        const right = parsePrimary();
        left = Math.pow(left, right);
      } else if (operator === '%') {
        index++;
        left = left / 100;
      } else {
        break;
      }
    }
    
    return left;
  }
  
  function parseTerm() {
    let left = parseFactor();
    
    while (index < tokens.length) {
      const operator = tokens[index];
      if (operator === '*' || operator === '/') {
        index++;
        const right = parseFactor();
        if (operator === '*') {
          left *= right;
        } else if (operator === '/') {
          if (right === 0) {
            throw new Error('Division by zero');
          }
          left /= right;
        }
      } else {
        break;
      }
    }
    
    return left;
  }
  
  function parseAdditive() {
    let left = parseTerm();
    
    while (index < tokens.length) {
      const operator = tokens[index];
      if (operator === '+' || operator === '-') {
        index++;
        const right = parseTerm();
        if (operator === '+') {
          left += right;
        } else if (operator === '-') {
          left -= right;
        }
      } else if (operator === ')') {
        // Don't consume the closing parenthesis here
        break;
      } else {
        // Skip any unrecognized tokens
        index++;
      }
    }
    
    return left;
  }
  
  return parseAdditive();
}
