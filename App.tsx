
import React, { useState, useEffect } from 'react';
import { TripPlannerForm } from './components/TripPlannerForm';
import { ItineraryDisplay } from './components/ItineraryDisplay';
import { LoadingSpinner } from './components/LoadingSpinner';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { ErrorMessage } from './components/ErrorMessage';
import { HeroSection } from './components/HeroSection';
import { generateItinerary } from './services/geminiService';
import type { Itinerary, Budget } from './types';
import { GlobeIcon } from './components/Icons';

const RestrictionMessage: React.FC = () => {
  return (
    <div className="text-center max-w-lg mx-auto p-8 bg-white dark:bg-slate-800 rounded-lg shadow-md">
      <GlobeIcon className="h-16 w-16 mx-auto text-red-500 mb-4" />
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
        Access Restricted
      </h2>
      <p className="text-gray-600 dark:text-gray-300">
        We're sorry, this application is currently only available to users in North America.
      </p>
    </div>
  );
};


const App: React.FC = () => {
  const [itinerary, setItinerary] = useState<Itinerary | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isRestricted, setIsRestricted] = useState<boolean>(false);
  const [isCheckingLocation, setIsCheckingLocation] = useState<boolean>(true);

  useEffect(() => {
    const checkLocation = async () => {
      try {
        const response = await fetch('https://ipapi.co/json/');
        if (!response.ok) {
          throw new Error('Failed to fetch location data.');
        }
        const data = await response.json();
        if (data.continent_code !== 'NA') {
          setIsRestricted(true);
        }
      } catch (err) {
        console.error("Location check failed:", err);
        // Restrict access if the fetch call fails.
        setIsRestricted(true);
      } finally {
        setIsCheckingLocation(false);
      }
    };

    checkLocation();
  }, []); // Empty dependency array ensures this runs only once on mount.


  const handleFormSubmit = async (
    destination: string,
    duration: number,
    interests: string,
    budget: Budget,
    timeOfYear: string
  ) => {
    setIsLoading(true);
    setError(null);
    setItinerary(null);
    try {
      const generatedItinerary = await generateItinerary(
        destination,
        duration,
        interests,
        budget,
        timeOfYear
      );
      setItinerary(generatedItinerary);
    } catch (err) {
      console.error(err);
      setError(
        'Failed to generate itinerary. The model may be overloaded or the request was filtered. Please try again with different inputs.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const renderContent = () => {
    if (isCheckingLocation) {
      return <LoadingSpinner message="Verifying your location..." />;
    }
    if (isRestricted) {
      return <RestrictionMessage />;
    }
    return (
       <div className="max-w-4xl mx-auto w-full">
          <HeroSection />
          <TripPlannerForm onSubmit={handleFormSubmit} isLoading={isLoading} />
          {isLoading && <LoadingSpinner />}
          {error && <ErrorMessage message={error} />}
          {itinerary && !isLoading && <ItineraryDisplay itinerary={itinerary} />}
        </div>
    );
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-slate-900 text-gray-800 dark:text-gray-200 font-sans">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8 flex items-center justify-center">
        {renderContent()}
      </main>
      <Footer />
    </div>
  );
};

export default App;
