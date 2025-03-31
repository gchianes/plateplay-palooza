
import React, { useState } from 'react';
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
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 pb-12">
        <div className="flex flex-col md:flex-row md:space-x-6">
          <div className="w-full md:w-7/12 mb-6 md:mb-0">
            <ScoreBoard 
              spottedStates={spottedStates} 
              totalStates={states.length} 
              progress={progress} 
              score={score} 
            />
            <USMap 
              states={statesList} 
              onToggleState={handleToggleState} 
            />
          </div>
          
          <div className="w-full md:w-5/12">
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
