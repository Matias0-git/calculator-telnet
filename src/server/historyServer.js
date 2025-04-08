
// HTTP Server for Telnet History
import http from 'http';
import { telnetHistory } from './telnetState.js';

/**
 * Creates an HTTP server for accessing telnet history
 * @param {number} port - Port to listen on
 * @returns {http.Server} - The created HTTP server
 */
export function createHistoryServer(port) {
  const httpServer = http.createServer((req, res) => {
    // Add CORS headers to allow the frontend to access this endpoint
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    if (req.method === 'OPTIONS') {
      res.writeHead(204);
      res.end();
      return;
    }
    
    if (req.url === '/api/telnet-history') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ history: telnetHistory }));
    } else {
      res.writeHead(404);
      res.end('Not found');
    }
  });
  
  // Start HTTP server
  httpServer.listen(port, '0.0.0.0');
  
  return httpServer;
}
