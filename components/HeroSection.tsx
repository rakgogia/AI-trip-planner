
import React from 'react';

export const HeroSection: React.FC = () => {
  return (
    <div className="text-center mb-10">
      <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white mb-3">
        Craft Your Perfect Adventure
      </h2>
      <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
        Tell us your destination, interests, and budget, and our AI will generate a personalized travel itinerary just for you.
      </p>
    </div>
  );
};
