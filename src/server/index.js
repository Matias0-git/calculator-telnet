
// Main entry point for the server
import { createTelnetServer } from './telnetServer.js';
import { createHistoryServer } from './historyServer.js';
import { setupErrorHandling } from './errorHandling.js';

// Default ports
const TELNET_PORT = 3000;
const HTTP_PORT = 3001;

console.log('Starting Scientific Calculator Telnet Server...');

// Create and start the telnet server
const telnetServer = createTelnetServer(TELNET_PORT);

// Create and start the HTTP server for frontend history access
const httpServer = createHistoryServer(HTTP_PORT);

// Setup error handling and graceful shutdown
setupErrorHandling(telnetServer, httpServer);

console.log(`Calculator Telnet server running on port ${TELNET_PORT}`);
console.log(`Connect using: telnet localhost ${TELNET_PORT}`);
console.log('Press Ctrl+C to stop the server');

console.log(`HTTP server for telnet history running on port ${HTTP_PORT}`);
console.log(`Frontend can fetch history from: http://localhost:${HTTP_PORT}/api/telnet-history`);
