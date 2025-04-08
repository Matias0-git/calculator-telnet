
import React from 'react';
import { cn } from '@/lib/utils';

interface CalculatorButtonProps {
  value: string;
  onClick: (value: string) => void;
  type?: 'number' | 'function' | 'operator';
  className?: string;
  disabled?: boolean;
  span?: 'col' | 'row' | 'both' | 'none';
}

const CalculatorButton: React.FC<CalculatorButtonProps> = ({
  value,
  onClick,
  type = 'number',
  className,
  disabled = false,
  span = 'none'
}) => {
  const handleClick = () => {
    if (!disabled) {
      onClick(value);
    }
  };

  return (
    <button
      className={cn(
        type === 'number' ? 'number-button' : 
        type === 'function' ? 'function-button' : 
        'operator-button',
        span === 'col' ? 'col-span-2' : '',
        span === 'row' ? 'row-span-2' : '',
        span === 'both' ? 'col-span-2 row-span-2' : '',
        disabled ? 'opacity-50 cursor-not-allowed' : '',
        'animate-scale-in',
        className
      )}
      onClick={handleClick}
      disabled={disabled}
      aria-label={`Calculator ${value} button`}
    >
      {value}
    </button>
  );
};

export default CalculatorButton;
