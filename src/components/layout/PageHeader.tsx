
import React from 'react';

interface PageHeaderProps {
  title: string;
  description: string;
  badge?: string;
}

const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  description,
  badge
}) => {
  return (
    <div className="text-center mb-8">
      {badge && (
        <span className="inline-block text-xs font-medium px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 mb-2 animate-fade-in">
          {badge}
        </span>
      )}
      <h1 className="text-3xl font-semibold text-gray-900 mb-2 tracking-tight">
        {title}
      </h1>
      <p className="text-gray-500 max-w-sm mx-auto">
        {description}
      </p>
    </div>
  );
};

export default PageHeader;
