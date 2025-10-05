
import React from 'react';
import { PlaneIcon } from './Icons';

export const Header: React.FC = () => {
  return (
    <header className="bg-white dark:bg-slate-800 shadow-md">
      <div className="container mx-auto px-4 py-4 flex items-center justify-center">
        <PlaneIcon className="h-8 w-8 text-blue-500 mr-3" />
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white tracking-tight">
          AI Trip Planner
        </h1>
      </div>
    </header>
  );
};
