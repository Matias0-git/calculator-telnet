
import React, { useState } from 'react';
import Calculator from '@/components/calculator/Calculator';
import TelnetManager from '@/components/telnet/TelnetManager';
import PageHeader from '@/components/layout/PageHeader';
import FooterInfo from '@/components/layout/FooterInfo';

const Index = () => {
  const [currentExpression, setCurrentExpression] = useState('');
  const [currentResult, setCurrentResult] = useState('0');

  const handleCalculationUpdate = (expression: string, result: string) => {
    setCurrentExpression(expression);
    setCurrentResult(result);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 p-6">
      <div className="max-w-md w-full mx-auto">
        <PageHeader 
          badge="Client-Server Architecture"
          title="Scientific Calculator"
          description="A powerful scientific calculator with server-side processing for optimal precision and elegance."
        />
        
        <div className="mb-8 animate-float">
          <Calculator initialExpression={currentExpression} initialResult={currentResult} />
        </div>
        
        <TelnetManager onCalculationUpdate={handleCalculationUpdate} />
        
        <FooterInfo 
          text={
            <>
              <p>This calculator supports basic operations (+, -, *, /), exponents (^), trigonometric functions (sin, cos, tan), logarithms (log, ln), square root (sqrt), and constants (π, e).</p>
              <p className="mt-2">All calculations are processed server-side.</p>
              <p className="mt-2">Group Members: Pinto, Glinka, Mena Da Dalt</p>
            </>
          }
        />
      </div>
    </div>
  );
};

export default Index;
