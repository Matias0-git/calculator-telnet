
# Scientific Calculator with Telnet Server

## Project Overview

This project combines a modern web interface with a classic telnet server to provide a powerful scientific calculator that's accessible through multiple interfaces.

## Watch the App in Action!

### Check out the demo video below to see the app's features.

[![Watch the video](https://img.youtube.com/vi/vKeohqQr8iE/0.jpg)](https://youtu.be/vKeohqQr8iE)

## Features

### Web Interface
- Modern, responsive calculator UI built with React and Tailwind CSS
- Scientific functions and operations
- Real-time calculation display
- History tracking

### Telnet Server
- Connect via telnet on port 3000 (`telnet localhost 3000`)
- Perform calculations remotely through a command-line interface
- Access calculation history
- Special commands:
  - `ans` - Use previous result in new calculations
  - `clear` - Clear calculation history
  - `exit` - Close the connection
  - `help` - Display available commands

### API Access
- HTTP server runs on port 3001
- Access telnet history via `http://localhost:3001/api/telnet-history`

## Architecture

The application is organized with a modular architecture:

- **Frontend**: React components with Tailwind CSS styling
- **Calculator Logic**: Standalone calculation service
- **Server Components**:
  - `server.js`: Main entry point
  - `src/server/index.js`: Server initialization
  - `src/server/telnetServer.js`: Telnet server implementation
  - `src/server/historyServer.js`: HTTP API for history
  - `src/server/telnetState.js`: Shared state management
  - `src/server/errorHandling.js`: Error handling utilities

## Getting Started

### Prerequisites
- Node.js & npm - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

### Installation and Running

```sh
# Clone the repository
git clone <YOUR_GIT_URL>

# Navigate to project directory
cd <YOUR_PROJECT_NAME>

# Install dependencies
npm i

# Start the application (includes both web interface and servers)
npm run dev
```

### Accessing the Calculator

- **Web Interface**: Open your browser to the URL shown in the console (typically http://localhost:5173)
- **Telnet Interface**: In a terminal, run `telnet localhost 3000`
- **API Access**: `http://localhost:3001/api/telnet-history`

## Development

This project uses:
- React
- TypeScript
- Tailwind CSS
- Shadcn/UI components
- Node.js for server functionality

## License

This project is licensed under the MIT License - see the LICENSE file for details.
