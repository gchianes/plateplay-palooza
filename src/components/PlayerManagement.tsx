
import React from 'react';
import { Player } from '@/types/player';
import PlayerScores from './PlayerScores';
import { usePlayerOperations } from '@/hooks/player/usePlayerOperations';

interface PlayerManagementProps {
  players: Player[];
  setPlayers: (players: Player[]) => void;
  activePlayer: number;
  setActivePlayer: (id: number) => void;
  currentGameId: string | null;
  globalSpottedStates: string[];
  setGlobalSpottedStates: (states: string[]) => void;
}

export function PlayerManagement({
  players,
  setPlayers,
  activePlayer,
  setActivePlayer,
  currentGameId,
  globalSpottedStates,
  setGlobalSpottedStates
}: PlayerManagementProps) {
  const {
    handleNameChange,
    handleAddPlayer,
    handleRemovePlayer
  } = usePlayerOperations({
    currentGameId,
    players,
    setPlayers,
    activePlayer,
    setActivePlayer,
    globalSpottedStates,
    setGlobalSpottedStates
  });

  return (
    <PlayerScores 
      players={Array.isArray(players) ? players : []}
      activePlayer={activePlayer}
      onPlayerAdd={handleAddPlayer}
      onPlayerRemove={handleRemovePlayer}
      onPlayerSelect={setActivePlayer}
      onPlayerNameChange={handleNameChange}
      canAddPlayer={!!currentGameId}
    />
  );
}
