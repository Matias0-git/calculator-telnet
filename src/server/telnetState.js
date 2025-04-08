// Shared state for telnet server
// Keeping track of history and client results

// Track telnet history across connections for the frontend
export let telnetHistory = [];

// Track last result for each client
export const clientResults = new Map();
