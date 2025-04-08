
import { toast } from 'sonner';
import { calculatorService } from '@/services/calculatorService';

interface UseCalculatorEvaluationProps {
  expression: string;
  isCalculating: boolean;
  setDisplayValue: (value: string) => void;
  setIsCalculating: (value: boolean) => void;
  setIsNewInput: (value: boolean) => void;
  setLastResult: (value: string) => void;
}

export const useCalculatorEvaluation = ({
  expression,
  isCalculating,
  setDisplayValue,
  setIsCalculating,
  setIsNewInput,
  setLastResult
}: UseCalculatorEvaluationProps) => {
  
  // Handle equal operation
  const handleEvaluation = async () => {
    if (isCalculating || !expression) return;
    
    try {
      setIsCalculating(true);
      
      // Process the calculation on the server
      const result = await calculatorService.calculate(expression);
      
      if (result.error) {
        toast.error(result.error);
        setDisplayValue('Error');
      } else {
        setDisplayValue(result.result);
        setLastResult(result.result);
      }
      
      setIsNewInput(true);
    } catch (error) {
      console.error('Calculation error:', error);
      toast.error('An error occurred during calculation');
      setDisplayValue('Error');
      setIsNewInput(true);
    } finally {
      setIsCalculating(false);
    }
  };

  return {
    handleEvaluation
  };
};
