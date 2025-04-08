
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import TelnetTerminal from './TelnetTerminal';
import { startTelnetServer } from '@/services/telnetServer';

interface TelnetManagerProps {
  onCalculationUpdate: (expression: string, result: string) => void;
}

const TelnetManager: React.FC<TelnetManagerProps> = ({ onCalculationUpdate }) => {
  const [telnetRunning, setTelnetRunning] = useState(false);
  const [telnetPort, setTelnetPort] = useState<number | null>(null);
  const [telnetServer, setTelnetServer] = useState<any>(null);
  const [telnetInput, setTelnetInput] = useState('');
  const [telnetHistory, setTelnetHistory] = useState<string[]>([
    'Welcome to the Scientific Calculator Telnet Simulator',
    'Enter mathematical expressions to calculate or type "exit" to quit',
    'Use "ans" to reference your previous result',
    'Special commands: "clear" - clear history, "help" - show commands'
  ]);

  // Fetch telnet history from the server periodically
  useEffect(() => {
    if (!telnetRunning) return;
    
    const fetchHistory = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/telnet-history');
        if (!response.ok) {
          throw new Error('Failed to fetch telnet history');
        }
        
        const data = await response.json();
        if (data.history && data.history.length > 0) {
          // Filter out duplicate entries before setting history
          const uniqueHistory = [
            'Welcome to the Scientific Calculator Telnet Server',
            'Enter mathematical expressions to calculate or type "exit" to quit',
            'Use "ans" to reference your previous result',
            'Special commands: "clear" - clear history, "help" - show commands',
            ...data.history
          ];
          
          // Remove potential duplicates from welcome messages
          setTelnetHistory(uniqueHistory);
          
          // Update calculator display with last calculation
          const lastCalculation = data.history
            .filter((item: string) => item.includes('=') && !item.includes('Error:'))
            .pop();
          
          if (lastCalculation) {
            const parts = lastCalculation.split('=');
            if (parts.length === 2) {
              const expression = parts[0].trim();
              const result = parts[1].trim();
              onCalculationUpdate(expression, result);
            }
          }
        }
      } catch (error) {
        console.error('Error fetching telnet history:', error);
      }
    };
    
    // Fetch immediately
    fetchHistory();
    
    // Then fetch every second
    const interval = setInterval(fetchHistory, 1000);
    
    return () => clearInterval(interval);
  }, [telnetRunning, onCalculationUpdate]);

  const handleStartTelnet = () => {
    try {
      const { port, server, isReal } = startTelnetServer();
      setTelnetRunning(true);
      setTelnetPort(port);
      setTelnetServer(server);
      
      if (isReal) {
        toast.success(`Real Telnet server started on port ${port}. Connect using: telnet localhost ${port}`);
      } else {
        toast.success(`Telnet simulator started. You can use the simulated terminal below.`);
      }
    } catch (error) {
      console.error('Failed to start Telnet simulator:', error);
      toast.error('Failed to start Telnet simulator. Check console for details.');
    }
  };

  const handleTelnetSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!telnetInput.trim()) return;
    
    // Add user input to history
    setTelnetHistory(prev => [...prev, `> ${telnetInput}`]);
    
    // Handle special commands
    if (telnetInput.toLowerCase() === 'exit') {
      setTelnetHistory(prev => [...prev, 'Goodbye!']);
      setTelnetRunning(false);
      setTelnetServer(null);
      setTelnetPort(null);
      toast.info('Telnet simulator stopped');
      setTelnetInput('');
      return;
    } else if (telnetInput.toLowerCase() === 'clear') {
      setTelnetHistory([
        'Welcome to the Scientific Calculator Telnet Simulator',
        'Enter mathematical expressions to calculate or type "exit" to quit',
        'Use "ans" to reference your previous result',
        'Special commands: "clear" - clear history, "help" - show commands',
        '> clear',
        'History cleared'
      ]);
      setTelnetInput('');
      return;
    } else if (telnetInput.toLowerCase() === 'help') {
      setTelnetHistory(prev => [...prev, 
        'Available commands:',
        'ans - Use your previous result in a calculation',
        'clear - Clear calculation history',
        'exit - Close connection',
        'help - Show this help message'
      ]);
      setTelnetInput('');
      return;
    }
    
    // Process calculation
    if (telnetServer) {
      // Find the last result if 'ans' is in the input
      let processedInput = telnetInput;
      if (processedInput.includes('ans')) {
        const lastCalculation = telnetHistory
          .filter(item => item.includes('=') && !item.includes('Error:'))
          .pop();
          
        if (lastCalculation) {
          const lastResult = lastCalculation.split('=')[1]?.trim() || '0';
          processedInput = processedInput.replace(/\bans\b/g, lastResult);
        }
      }
      
      const result = telnetServer.calculate(processedInput);
      setTelnetHistory(prev => [...prev, result]);
      
      // Update calculator display if it's a valid calculation
      if (!result.includes('Error')) {
        const parts = result.split('=');
        if (parts.length === 2) {
          onCalculationUpdate(parts[0].trim(), parts[1].trim());
        }
      }
    }
    
    setTelnetInput('');
  };

  const handleBackspace = () => {
    if (telnetInput.length > 0) {
      setTelnetInput(prev => prev.slice(0, -1));
    }
  };

  return (
    <div>
      <div className="flex justify-center mb-4">
        <Button 
          onClick={handleStartTelnet} 
          disabled={telnetRunning}
          className="bg-blue-600 hover:bg-blue-700"
        >
          {telnetRunning ? `Telnet Server Running` : 'Start Telnet Server'}
        </Button>
      </div>
      
      {telnetRunning && (
        <TelnetTerminal
          telnetHistory={telnetHistory}
          telnetInput={telnetInput}
          setTelnetInput={setTelnetInput}
          handleTelnetSubmit={handleTelnetSubmit}
          handleBackspace={handleBackspace}
        />
      )}
    </div>
  );
};

export default TelnetManager;
