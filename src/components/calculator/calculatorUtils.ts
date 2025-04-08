
/**
 * Utility functions for calculator operations
 * This file is kept for backward compatibility
 * and re-exports functions from the specialized modules
 */

export { 
  handleClear 
} from './utils/clearOperations';

export { 
  handleBackspace,
  updateExpression 
} from './utils/backspaceOperations';

export { 
  handleInput 
} from './utils/inputOperations';
