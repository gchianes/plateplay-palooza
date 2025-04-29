
import React, { useState } from 'react';
import { Player } from '@/types/player';
import { states } from '@/utils/stateData';
import GameBoard from './game/GameBoard';
import { useGameOperations } from '@/hooks/game/useGameOperations';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface GameStateProps {
  players: Player[];
  setPlayers: (players: Player[]) => void;
  activePlayer: number;
  globalSpottedStates: string[];
  setGlobalSpottedStates: (states: string[]) => void;
  currentGameId: string | null;
  isMapVisible: boolean;
}

export function GameState({
  players,
  setPlayers,
  activePlayer,
  globalSpottedStates,
  setGlobalSpottedStates,
  currentGameId,
  isMapVisible
}: GameStateProps) {
  const [showSpottedStates, setShowSpottedStates] = useState(false);
  
  const { handleToggleState } = useGameOperations({
    players,
    setPlayers,
    activePlayer,
    globalSpottedStates,
    setGlobalSpottedStates,
    currentGameId
  });

  // We're still calculating these values in case they're needed elsewhere
  const currentPlayer = players.find(p => p.id === activePlayer) || players[0];
  const spottedStates = currentPlayer?.states || [];
  const score = currentPlayer?.score || 0;
  const progress = (spottedStates.length / states.length) * 100;

  // Get the names of spotted states sorted alphabetically
  const getSpottedStateNames = () => {
    return spottedStates
      .map(stateId => {
        const stateData = states.find(s => s.id === stateId);
        return stateData?.name || '';
      })
      .filter(name => name)
      .sort((a, b) => a.localeCompare(b));
  };

  const spottedStateNames = getSpottedStateNames();

  const toggleSpottedStates = () => {
    setShowSpottedStates(!showSpottedStates);
  };

  return (
    <div className="space-y-6">
      {spottedStates.length > 0 && (
        <Card className="p-4">
          <Button
            variant="ghost"
            size="sm"
            className="w-full flex justify-between items-center text-sm font-semibold"
            onClick={toggleSpottedStates}
          >
            <span>
              {currentPlayer.name}'s Spotted States/Provinces: {spottedStates.length}
            </span>
            {showSpottedStates ? 
              <ChevronUp className="h-4 w-4" /> : 
              <ChevronDown className="h-4 w-4" />
            }
          </Button>
          
          {showSpottedStates && (
            <ScrollArea className="h-[200px] w-full mt-2 p-2 border rounded-md">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                {spottedStateNames.map((name) => (
                  <div key={name} className="text-sm p-1">
                    {name}
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
        </Card>
      )}
      
      <GameBoard
        isMapVisible={isMapVisible}
        globalSpottedStates={globalSpottedStates}
        onToggleState={handleToggleState}
      />
    </div>
  );
}
