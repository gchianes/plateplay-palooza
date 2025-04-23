
import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import ScoreBoard from '@/components/ScoreBoard';
import USMap from '@/components/USMap';
import LicensePlateList from '@/components/LicensePlateList';
import { states, calculateScore, getProgress, sortStatesBySpotted } from '@/utils/stateData';
import { toast } from '@/components/ui/use-toast';

const Index = () => {
  const [statesList, setStatesList] = useState(states);
  
  const spottedStates = statesList.filter(state => state.spotted);
  const score = calculateScore(spottedStates);
  const progress = getProgress(spottedStates);
  const sortedStates = sortStatesBySpotted(statesList);

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
                <div className="map-container-wrapper">
                  <div className="usa-map-grid">
                    {sortedStates.map(state => (
                      <div 
                        key={state.id} 
                        className={`usa-state-block ${state.spotted ? 'spotted' : ''}`}
                        onClick={() => handleToggleState(state.id)}
                      >
                        <div className="state-content">
                          <span className="state-abbr">{state.abbreviation}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
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
