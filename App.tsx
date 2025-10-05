
import React, { useState } from 'react';
import { TripPlannerForm } from './components/TripPlannerForm';
import { ItineraryDisplay } from './components/ItineraryDisplay';
import { LoadingSpinner } from './components/LoadingSpinner';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { ErrorMessage } from './components/ErrorMessage';
import { HeroSection } from './components/HeroSection';
import { generateItinerary } from './services/geminiService';
import type { Itinerary, Budget } from './types';

const App: React.FC = () => {
  const [itinerary, setItinerary] = useState<Itinerary | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

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

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-slate-900 text-gray-800 dark:text-gray-200 font-sans">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <HeroSection />
          <TripPlannerForm onSubmit={handleFormSubmit} isLoading={isLoading} />
          {isLoading && <LoadingSpinner />}
          {error && <ErrorMessage message={error} />}
          {itinerary && !isLoading && <ItineraryDisplay itinerary={itinerary} />}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default App;
