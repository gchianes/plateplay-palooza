
import React, { useState, useEffect, useRef } from 'react';
import Header from '@/components/Header';
import ScoreBoard from '@/components/ScoreBoard';
import USMap from '@/components/USMap';
import LicensePlateList from '@/components/LicensePlateList';
import { states, calculateScore, getProgress, sortStatesBySpotted } from '@/utils/stateData';
import { toast } from '@/components/ui/use-toast';
import { AspectRatio } from '@/components/ui/aspect-ratio';

const Index = () => {
  const [statesList, setStatesList] = useState(states);
  const [mapReady, setMapReady] = useState(false);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  
  const spottedStates = statesList.filter(state => state.spotted);
  const score = calculateScore(spottedStates);
  const progress = getProgress(spottedStates);
  const sortedStates = sortStatesBySpotted(statesList);

  // Ensure the map has time to properly initialize with proper sizing
  useEffect(() => {
    const timer = setTimeout(() => {
      setMapReady(true);
    }, 1000);
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
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-gray-100">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <ScoreBoard 
          spottedStates={spottedStates} 
          totalStates={states.length} 
          progress={progress} 
          score={score} 
        />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-10">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-5">United States Map</h2>
                
                {mapReady ? (
                  <div 
                    ref={mapContainerRef}
                    className="map-container-wrapper"
                    style={{ 
                      minHeight: '500px',
                      maxHeight: '70vh'
                    }}
                  >
                    <AspectRatio ratio={16 / 10} className="bg-white mb-2">
                      <div className="w-full h-full p-4">
                        <USMap 
                          states={statesList} 
                          onToggleState={handleToggleState} 
                        />
                      </div>
                    </AspectRatio>
                  </div>
                ) : (
                  <div className="flex items-center justify-center py-20">
                    <div className="animate-pulse text-gray-500">
                      Loading map...
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div className="lg:col-span-1">
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
