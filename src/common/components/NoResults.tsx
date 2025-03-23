import React from 'react';
import { SearchX } from 'lucide-react';

interface NoResultsProps {
  title: string;
  description: string;
}

const NoResults: React.FC<NoResultsProps> = ({ title, description }) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="rounded-full bg-gray-100 p-6 mb-4">
        <SearchX size={48} className="text-gray-400" />
      </div>
      <h3 className="text-xl font-semibold text-gray-800 mb-2">{title}</h3>
      <p className="text-gray-500 max-w-md mb-6">{description}</p>
    </div>
  );
};

export default NoResults;