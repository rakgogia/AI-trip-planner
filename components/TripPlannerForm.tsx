
import React, { useState } from 'react';
import { Budget } from '../types';
import { LocationIcon, CalendarIcon, BulbIcon, MoneyIcon } from './Icons';

interface TripPlannerFormProps {
  onSubmit: (
    destination: string,
    duration: number,
    interests: string,
    budget: Budget
  ) => void;
  isLoading: boolean;
}

export const TripPlannerForm: React.FC<TripPlannerFormProps> = ({ onSubmit, isLoading }) => {
  const [destination, setDestination] = useState('');
  const [duration, setDuration] = useState(5);
  const [interests, setInterests] = useState('history, local cuisine, and scenic views');
  const [budget, setBudget] = useState<Budget>(Budget.MidRange);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (destination && duration > 0 && interests) {
      onSubmit(destination, duration, interests, budget);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-xl shadow-lg mb-8 transition-shadow hover:shadow-xl">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Destination */}
          <div>
            <label htmlFor="destination" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Destination</label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <LocationIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                id="destination"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                placeholder="e.g., Paris, France"
                required
                className="w-full pl-10 p-3 bg-gray-50 dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              />
            </div>
          </div>

          {/* Duration */}
          <div>
            <label htmlFor="duration" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Trip Length (days)</label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <CalendarIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="number"
                id="duration"
                value={duration}
                onChange={(e) => setDuration(parseInt(e.target.value, 10))}
                min="1"
                max="30"
                required
                className="w-full pl-10 p-3 bg-gray-50 dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              />
            </div>
          </div>
        </div>

        {/* Interests */}
        <div>
          <label htmlFor="interests" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Interests & Preferences</label>
           <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 top-[-24px] pt-12">
                <BulbIcon className="h-5 w-5 text-gray-400" />
              </div>
              <textarea
                id="interests"
                value={interests}
                onChange={(e) => setInterests(e.target.value)}
                placeholder="e.g., art museums, hiking, street food, jazz clubs"
                rows={3}
                required
                className="w-full pl-10 p-3 bg-gray-50 dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              />
            </div>
        </div>

        {/* Budget */}
        <div>
          <label htmlFor="budget" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Budget</label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <MoneyIcon className="h-5 w-5 text-gray-400" />
            </div>
            <select
              id="budget"
              value={budget}
              onChange={(e) => setBudget(e.target.value as Budget)}
              className="w-full pl-10 p-3 bg-gray-50 dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition appearance-none"
            >
              {Object.values(Budget).map((b) => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Submit Button */}
        <div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center items-center p-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-800 transition disabled:bg-blue-400 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Generating Your Adventure...' : 'Generate Trip Plan'}
          </button>
        </div>
      </form>
    </div>
  );
};
