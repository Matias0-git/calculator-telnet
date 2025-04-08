// Telnet Server Implementation
import net from 'net';
import { calculatorService } from '../services/calculatorService.js';
import { telnetHistory, clientResults } from './telnetState.js';

/**
 * Creates and configures the telnet server
 * @param {number} port - Port to listen on
 * @returns {net.Server} - The created server instance
 */
export function createTelnetServer(port) {
  // Create the server
  const server = net.createServer((socket) => {
    const clientId = `${socket.remoteAddress}:${socket.remotePort}`;
    console.log('Client connected from:', socket.remoteAddress);
    
    // Initialize last result for this client
    clientResults.set(clientId, '0');
    
    // Send welcome message
    socket.write('Welcome to the Scientific Calculator Server\r\n');
    socket.write('Enter a mathematical expression or "exit" to quit\r\n');
    socket.write('Use "ans" to reference your previous result\r\n');
    socket.write('Special commands: "clear" - clear history, "help" - show commands\r\n');
    socket.write('> ');
    
    // Current line for display and editing
    let currentLine = '';
    
    // Handle data from client
    socket.on('data', async (data) => {
      // Convert buffer to string
      const chunk = data.toString();
      
      // Check for special control characters
      for (let i = 0; i < chunk.length; i++) {
        const char = chunk[i];
        const code = chunk.charCodeAt(i);
        
        // Backspace (ASCII 8) or Delete (ASCII 127)
        if (code === 8 || code === 127) {
          if (currentLine.length > 0) {
            // Remove last character
            currentLine = currentLine.slice(0, -1);
            // Send backspace sequence to move cursor back, space to erase character, and backspace again
            socket.write('\b \b');
          }
          continue;
        }
        
        // Enter key (carriage return or line feed)
        if (char === '\r' || char === '\n') {
          if (!currentLine.length) {
            socket.write('\r\n> ');
            continue;
          }
          
          if (currentLine.trim() !== '') {
            // Process the complete line
            const input = currentLine.trim();
            console.log(`Received complete input from ${socket.remoteAddress}:`, input);
            
            // Store command in history
            const commandEntry = `> ${input}`;
            telnetHistory.push(commandEntry);
            
            // Handle special commands
            if (input.toLowerCase() === 'exit') {
              const exitMessage = 'Goodbye!';
              telnetHistory.push(exitMessage);
              socket.write('\r\n' + exitMessage + '\r\n');
              clientResults.delete(clientId);
              socket.end();
              return;
            } else if (input.toLowerCase() === 'clear') {
              // Clear client history
              telnetHistory = telnetHistory.filter(entry => !entry.includes(clientId));
              socket.write('\r\nHistory cleared\r\n');
              socket.write('> ');
              currentLine = '';
              continue;
            } else if (input.toLowerCase() === 'help') {
              const helpMessage = '\r\nAvailable commands:\r\n' +
                'ans - Use your previous result in a calculation\r\n' +
                'clear - Clear calculation history\r\n' +
                'exit - Close connection\r\n' +
                'help - Show this help message\r\n';
              socket.write(helpMessage);
              socket.write('> ');
              currentLine = '';
              continue;
            }
            
            try {
              // Replace 'ans' with the last result for this client
              const lastResult = clientResults.get(clientId) || '0';
              let processedInput = input.replace(/\bans\b/gi, lastResult);
              
              // Process the calculation using our service
              const response = await calculatorService.calculate(processedInput);
              
              let resultMessage = '';
              if (response.error) {
                resultMessage = `Error: ${response.error}`;
              } else {
                resultMessage = `${input} = ${response.result}`;
                // Store the result for this client
                clientResults.set(clientId, response.result);
              }
              
              // Store result in history
              telnetHistory.push(resultMessage);
              
              // Send result to client
              socket.write('\r\n' + resultMessage + '\r\n');
              socket.write('> ');
            } catch (error) {
              const errorMessage = `Error: ${error instanceof Error ? error.message : 'Unknown error'}`;
              telnetHistory.push(errorMessage);
              socket.write('\r\n' + errorMessage + '\r\n');
              socket.write('> ');
            }
          } else {
            // Empty line, just show prompt again
            socket.write('\r\n> ');
          }
          
          // Reset current line
          currentLine = '';
          continue;
        }
        
        // Regular character (don't echo control characters)
        if (code >= 32 && code < 127) {
          currentLine += char;
          // Don't echo characters - the telnet client will handle echoing
          // Removing this line fixes the duplication issue
          // socket.write(char); 
        }
      }
      
      // Keep history at a reasonable size
      if (telnetHistory.length > 100) {
        telnetHistory = telnetHistory.slice(-100);
      }
    });
    
    // Handle client disconnection
    socket.on('end', () => {
      console.log('Client disconnected:', socket.remoteAddress);
      // Clean up client data
      clientResults.delete(clientId);
    });
    
    // Handle errors
    socket.on('error', (err) => {
      console.error('Socket error:', err);
      clientResults.delete(clientId);
    });
  });
  
  // Start listening on all interfaces (0.0.0.0) for better accessibility
  server.listen(port, '0.0.0.0');
  
  return server;
}
