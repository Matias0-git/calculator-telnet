
// Error handling for servers

/**
 * Sets up error handling and graceful shutdown for servers
 * @param {import('net').Server} telnetServer - The telnet server
 * @param {import('http').Server} httpServer - The HTTP server
 */
export function setupErrorHandling(telnetServer, httpServer) {
  // Handle server errors
  telnetServer.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.error(`Error: Port ${telnetServer.address().port} is already in use. Try a different port.`);
    } else {
      console.error('Server error:', err);
    }
    process.exit(1);
  });

  // Handle HTTP server errors
  httpServer.on('error', (err) => {
    console.error('HTTP server error:', err);
    // Don't exit process, as telnet server might still be running
  });

  // Handle process termination
  process.on('SIGINT', () => {
    console.log('\nShutting down the servers...');
    telnetServer.close(() => {
      httpServer.close(() => {
        console.log('Servers have been stopped');
        process.exit(0);
      });
    });
  });
}
