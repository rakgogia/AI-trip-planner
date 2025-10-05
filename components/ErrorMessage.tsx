
import React from 'react';
import { WarningIcon } from './Icons';

interface ErrorMessageProps {
  message: string;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ message }) => {
  return (
    <div className="bg-red-100 dark:bg-red-900/30 border-l-4 border-red-500 text-red-700 dark:text-red-300 p-4 rounded-md my-8 flex items-start" role="alert">
      <WarningIcon className="h-6 w-6 mr-3 flex-shrink-0" />
      <div>
        <p className="font-bold">Oops! Something went wrong.</p>
        <p>{message}</p>
      </div>
    </div>
  );
};
