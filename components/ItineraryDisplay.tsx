
import React from 'react';
import type { Itinerary, DailyPlan, Activity } from '../types';
import { SunIcon, MoonIcon, UtensilsIcon } from './Icons';

interface ItineraryDisplayProps {
  itinerary: Itinerary;
}

const ActivityCard: React.FC<{ activity: Activity, day: number }> = ({ activity, day }) => {
  const getIcon = () => {
    const time = activity.time.toLowerCase();
    if (time.includes('morning') || time.includes('afternoon')) return <SunIcon className="h-6 w-6 text-yellow-500" />;
    if (time.includes('evening') || time.includes('night')) return <MoonIcon className="h-6 w-6 text-indigo-400" />;
    if (time.includes('dinner') || time.includes('lunch') || time.includes('breakfast')) return <UtensilsIcon className="h-6 w-6 text-orange-500" />;
    return <SunIcon className="h-6 w-6 text-gray-500" />;
  };

  return (
    <div className="flex items-start space-x-4 p-4 rounded-lg bg-gray-50 dark:bg-slate-700/50 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors">
      <div className="flex-shrink-0 pt-1">{getIcon()}</div>
      <div>
        <h4 className="font-bold text-gray-800 dark:text-gray-100">{activity.time}</h4>
        <p className="text-gray-700 dark:text-gray-300">{activity.description}</p>
        {activity.details && <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{activity.details}</p>}
      </div>
    </div>
  );
};


const DayPlanCard: React.FC<{ dayPlan: DailyPlan }> = ({ dayPlan }) => {
  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg mb-6 transform hover:-translate-y-1 transition-transform">
      <div className="flex items-center mb-4">
         <div className="flex-shrink-0 bg-blue-500 text-white rounded-full h-10 w-10 flex items-center justify-center font-bold text-lg">
          {dayPlan.day}
        </div>
        <div className="ml-4">
            <p className="text-sm font-semibold text-blue-600 dark:text-blue-400">Day {dayPlan.day}</p>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">{dayPlan.title}</h3>
        </div>
      </div>
      <div className="space-y-4">
        {dayPlan.activities.map((activity, index) => (
          <ActivityCard key={index} activity={activity} day={dayPlan.day} />
        ))}
      </div>
    </div>
  );
};


export const ItineraryDisplay: React.FC<ItineraryDisplayProps> = ({ itinerary }) => {
  return (
    <div className="mt-10">
      <h2 className="text-3xl font-bold text-center mb-8 text-gray-900 dark:text-white">Your Personalized Itinerary</h2>
      <div className="space-y-8">
        {itinerary.map((dayPlan) => (
          <DayPlanCard key={dayPlan.day} dayPlan={dayPlan} />
        ))}
      </div>
    </div>
  );
};
