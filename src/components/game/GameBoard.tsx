
import React from 'react';
import { states } from '@/utils/stateData';
import USAMap from '../USAMap';
import LicensePlateList from '../LicensePlateList';

interface GameBoardProps {
  isMapVisible: boolean;
  globalSpottedStates: string[];
  onToggleState: (stateId: string) => void;
}

const GameBoard: React.FC<GameBoardProps> = ({
  isMapVisible,
  globalSpottedStates,
  onToggleState,
}) => {
  const sortedStates = states.map(state => ({
    ...state,
    spotted: globalSpottedStates.includes(state.id)
  })).sort((a, b) => {
    if (a.spotted && !b.spotted) return -1;
    if (!a.spotted && b.spotted) return 1;
    return a.name.localeCompare(b.name);
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-8">
      {isMapVisible && (
        <div className="lg:col-span-2 overflow-x-auto">
          <div className="bg-white rounded-2xl shadow-xl p-4">
            <h2 className="text-xl font-bold text-gray-800 mb-4">United States Map</h2>
            <div className="min-w-[300px]">
              <USAMap 
                spottedStates={globalSpottedStates}
                onStateClick={onToggleState}
              />
            </div>
          </div>
        </div>
      )}
      
      <div className="lg:col-span-1">
        <LicensePlateList 
          states={sortedStates} 
          onToggleState={onToggleState} 
        />
      </div>
    </div>
  );
};

export default GameBoard;

