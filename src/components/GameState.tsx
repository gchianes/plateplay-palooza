
import React from 'react';
import { Player } from '@/types/player';
import { states } from '@/utils/stateData';
import GameBoard from './game/GameBoard';
import { useGameOperations } from '@/hooks/game/useGameOperations';

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

  return (
    <div className="space-y-6">
      {/* ScoreBoard component has been removed */}
      
      <GameBoard
        isMapVisible={isMapVisible}
        globalSpottedStates={globalSpottedStates}
        onToggleState={handleToggleState}
      />
    </div>
  );
}
