
import React from 'react';
import { Player } from '@/types/player';
import { states } from '@/utils/stateData';
import ScoreBoard from './ScoreBoard';
import GameBoard from './game/GameBoard';
import GameControls from './game/GameControls';
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
  const { handleToggleState, handleNewGame } = useGameOperations({
    players,
    setPlayers,
    activePlayer,
    globalSpottedStates,
    setGlobalSpottedStates,
    currentGameId
  });

  const currentPlayer = players.find(p => p.id === activePlayer) || players[0];
  const spottedStates = currentPlayer?.states || [];
  const score = currentPlayer?.score || 0;
  const progress = (spottedStates.length / states.length) * 100;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <ScoreBoard 
          spottedStates={spottedStates} 
          totalStates={states.length} 
          progress={progress} 
          score={score}
          playerName={currentPlayer?.name || ""}
          currentPlayer={currentPlayer}
        />
        <GameControls onNewGame={handleNewGame} />
      </div>
      
      <GameBoard
        isMapVisible={isMapVisible}
        globalSpottedStates={globalSpottedStates}
        onToggleState={handleToggleState}
      />
    </div>
  );
}
