
import React from 'react';

interface FooterInfoProps {
  text: React.ReactNode;
  className?: string;
}

const FooterInfo: React.FC<FooterInfoProps> = ({ text, className }) => {
  return (
    <div className={`text-xs text-center text-gray-400 mt-8 max-w-xs mx-auto ${className}`}>
      {text}
    </div>
  );
};

export default FooterInfo;
