
import React, { useRef, useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface TelnetTerminalProps {
  telnetHistory: string[];
  telnetInput: string;
  setTelnetInput: (input: string) => void;
  handleTelnetSubmit: (e: React.FormEvent) => void;
  handleBackspace: () => void;
}

const TelnetTerminal: React.FC<TelnetTerminalProps> = ({
  telnetHistory,
  telnetInput,
  setTelnetInput,
  handleTelnetSubmit,
  handleBackspace
}) => {
  const telnetHistoryRef = useRef<HTMLDivElement>(null);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [lastResult, setLastResult] = useState<string | null>(null);
  
  // Extract last result from history when it updates
  useEffect(() => {
    const resultLines = telnetHistory.filter(line => line.includes('=') && !line.includes('Error'));
    if (resultLines.length > 0) {
      const lastResultLine = resultLines[resultLines.length - 1];
      const resultPart = lastResultLine.split('=')[1];
      if (resultPart) {
        setLastResult(resultPart.trim());
      }
    }
    
    // Update command history from telnet history
    const newCommands = telnetHistory
      .filter(line => line.startsWith('> '))
      .map(line => line.substring(2))
      .filter(cmd => cmd.trim() !== '');
    
    if (newCommands.length !== commandHistory.length) {
      setCommandHistory(newCommands);
      // Reset history index when new commands are added
      setHistoryIndex(-1);
    }
  }, [telnetHistory]);
  
  // Scroll to bottom of telnet history when it updates
  useEffect(() => {
    if (telnetHistoryRef.current) {
      telnetHistoryRef.current.scrollTop = telnetHistoryRef.current.scrollHeight;
    }
  }, [telnetHistory]);

  // Clean the telnet history display
  const cleanTelnetHistory = (history: string[]) => {
    // Remove duplicate consecutive lines
    let cleanedHistory: string[] = [];
    
    for (let i = 0; i < history.length; i++) {
      // Skip if this entry is a duplicate of the previous one
      if (i > 0 && history[i] === history[i-1]) {
        continue;
      }
      
      // Add only if it's not a control character
      if (history[i].trim() !== '') {
        cleanedHistory.push(history[i]);
      }
    }
    
    return cleanedHistory;
  };

  // Handle special key presses for command history
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length > 0 && historyIndex < commandHistory.length - 1) {
        const newIndex = historyIndex + 1;
        setHistoryIndex(newIndex);
        setTelnetInput(commandHistory[commandHistory.length - 1 - newIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setTelnetInput(commandHistory[commandHistory.length - 1 - newIndex]);
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setTelnetInput('');
      }
    }
  };

  // Insert 'ans' at cursor position or append to input
  const insertAns = () => {
    if (!lastResult) return;
    
    const newInput = telnetInput.length > 0 ? 
      `${telnetInput} ans` : 
      'ans';
    
    setTelnetInput(newInput);
  };

  return (
    <div className="border border-gray-300 rounded-md bg-black text-green-500 p-3 mb-6 font-mono text-sm">
      <div 
        ref={telnetHistoryRef}
        className="h-40 overflow-y-auto mb-2"
      >
        {cleanTelnetHistory(telnetHistory).map((line, index) => (
          <div key={index} className="whitespace-pre-wrap break-all">
            {line}
          </div>
        ))}
      </div>
      <form onSubmit={handleTelnetSubmit} className="flex flex-col">
        <div className="flex items-center mb-2">
          <span className="mr-1">{'>'}</span>
          <Input
            type="text"
            value={telnetInput}
            onChange={(e) => setTelnetInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent border-none text-green-500 focus:ring-0 p-0 h-6"
            placeholder="Enter expression..."
            autoFocus
          />
          <Button 
            type="button" 
            variant="ghost" 
            size="sm" 
            className="text-green-500 hover:text-green-400 p-0 h-6"
            onClick={handleBackspace}
          >
            ⌫
          </Button>
        </div>
        <div className="flex gap-2 text-xs">
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="bg-transparent border-green-700 text-green-500 hover:bg-green-900 hover:text-green-400 py-0 h-6"
            onClick={insertAns}
            disabled={!lastResult}
          >
            Use Previous Result
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="bg-transparent border-green-700 text-green-500 hover:bg-green-900 hover:text-green-400 py-0 h-6"
            onClick={() => setTelnetInput('help')}
          >
            Help
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="bg-transparent border-green-700 text-green-500 hover:bg-green-900 hover:text-green-400 py-0 h-6"
            onClick={() => setTelnetInput('clear')}
          >
            Clear
          </Button>
        </div>
      </form>
    </div>
  );
};

export default TelnetTerminal;
