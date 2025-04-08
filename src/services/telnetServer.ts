
import { evaluateExpression } from './calculator/expressionEvaluator';
import { sanitizeExpression } from './calculator/expressionParser';
import { formatResult } from './calculator/resultFormatter';

// Default port for our telnet server
const PORT = 3000;

/**
 * Start a Telnet server for calculator operations
 * 
 * Note: This will only start a real server when running in Node.js environment.
 * In browser environments, it returns a simulated server for the UI.
 */
export const startTelnetServer = () => {
  // Check if running in Node.js environment
  const isNodeEnv = typeof process !== 'undefined' && 
                   typeof process.versions !== 'undefined' && 
                   typeof process.versions.node !== 'undefined';
  
  if (isNodeEnv) {
    try {
      // This will only work in Node.js environment
      const net = require('net');
      
      // Create the server
      const server = net.createServer((socket) => {
        console.log('Client connected');
        
        // Send welcome message
        socket.write('Welcome to the Scientific Calculator Server\r\n');
        socket.write('Enter a mathematical expression or "exit" to quit\r\n');
        socket.write('> ');
        
        // Handle data from client
        socket.on('data', (data) => {
          const input = data.toString().trim();
          console.log('Received input:', input);
          
          // Handle exit command
          if (input.toLowerCase() === 'exit') {
            socket.write('Goodbye!\r\n');
            socket.end();
            return;
          }
          
          try {
            // Process the calculation
            const sanitizedExpression = sanitizeExpression(input);
            const result = evaluateExpression(sanitizedExpression);
            const formattedResult = formatResult(result);
            
            socket.write(`${input} = ${formattedResult}\r\n`);
            socket.write('> ');
          } catch (error) {
            socket.write(`Error: ${error instanceof Error ? error.message : 'Unknown error'}\r\n`);
            socket.write('> ');
          }
        });
        
        // Handle client disconnection
        socket.on('end', () => {
          console.log('Client disconnected');
        });
        
        // Handle errors
        socket.on('error', (err) => {
          console.error('Socket error:', err);
        });
      });
      
      // Start listening on all interfaces (0.0.0.0) for better accessibility
      server.listen(PORT, '0.0.0.0', () => {
        console.log(`Calculator Telnet server running on port ${PORT}`);
        console.log(`Connect using: telnet localhost ${PORT}`);
      });
      
      // Handle server errors
      server.on('error', (err) => {
        console.error('Server error:', err);
      });
      
      return {
        server,
        port: PORT,
        isReal: true
      };
    } catch (error) {
      console.error('Failed to start real Telnet server:', error);
      // Fall back to simulated server
    }
  }
  
  // Return simulated server for browser environments
  console.log(`[Simulated] Calculator Telnet server would run on port ${PORT} if this were a Node.js environment`);
  console.log(`[Simulated] In a real server environment, you would connect using: telnet localhost ${PORT}`);
  
  // Create a simulated server object for UI state management
  const simulatedServer = {
    // Simulate a calculation as if it were received over telnet
    calculate: (expression: string): string => {
      try {
        if (!expression || expression.trim() === '') {
          return 'Error: Empty expression';
        }
        
        // Process the calculation using our existing calculator logic
        const sanitizedExpression = sanitizeExpression(expression);
        const result = evaluateExpression(sanitizedExpression);
        const formattedResult = formatResult(result);
        
        return `${expression} = ${formattedResult}`;
      } catch (error) {
        return `Error: ${error instanceof Error ? error.message : 'Unknown error'}`;
      }
    }
  };
  
  return {
    server: simulatedServer,
    port: PORT,
    isReal: false
  };
};
