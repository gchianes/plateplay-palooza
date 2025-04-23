
import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import ScoreBoard from '@/components/ScoreBoard';
import USMap from '@/components/USMap';
import LicensePlateList from '@/components/LicensePlateList';
import { states, calculateScore, getProgress, sortStatesBySpotted } from '@/utils/stateData';
import { toast } from '@/components/ui/use-toast';

const Index = () => {
  const [statesList, setStatesList] = useState(states);
  const [mapReady, setMapReady] = useState(false);
  
  const spottedStates = statesList.filter(state => state.spotted);
  const score = calculateScore(spottedStates);
  const progress = getProgress(spottedStates);
  const sortedStates = sortStatesBySpotted(statesList);

  // Ensure the map has time to properly initialize with a longer delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setMapReady(true);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const handleToggleState = (stateId: string) => {
    const updatedStates = statesList.map(state => {
      if (state.id === stateId) {
        const newSpottedValue = !state.spotted;
        
        // Show toast notification
        if (newSpottedValue) {
          toast({
            title: `License plate spotted!`,
            description: `You've spotted ${state.name}`,
            duration: 3000,
          });
        } else {
          toast({
            title: `Removed from spotted list`,
            description: `${state.name} removed from your collection`,
            duration: 3000,
          });
        }
        
        return { ...state, spotted: newSpottedValue };
      }
      return state;
    });
    
    setStatesList(updatedStates);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <ScoreBoard 
          spottedStates={spottedStates} 
          totalStates={states.length} 
          progress={progress} 
          score={score} 
        />
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-8">
          <div className="lg:col-span-8 space-y-6">
            {mapReady && (
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="p-6">
                  <h2 className="text-2xl font-bold text-gray-800 mb-4">United States Map</h2>
                  <div className="relative aspect-[4/3] w-full">
                    <div className="absolute inset-0">
                      <USMap 
                        states={statesList} 
                        onToggleState={handleToggleState} 
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          <div className="lg:col-span-4">
            <LicensePlateList 
              states={sortedStates} 
              onToggleState={handleToggleState} 
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
