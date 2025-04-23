
import React, { useEffect } from 'react';
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

  const safeHandleAddPlayer = () => {
    console.log("Add player button clicked, current players:", players);
    handleAddPlayer();
  };

  // Log the currentGameId to debug why the button might be disabled
  useEffect(() => {
    console.log("Current game ID in PlayerManagement:", currentGameId);
    console.log("Can add player:", !!currentGameId);
  }, [currentGameId]);

  return (
    <PlayerScores 
      players={Array.isArray(players) ? players : []}
      activePlayer={activePlayer}
      onPlayerAdd={safeHandleAddPlayer}
      onPlayerRemove={handleRemovePlayer}
      onPlayerSelect={setActivePlayer}
      onPlayerNameChange={handleNameChange}
      canAddPlayer={true} // Always enable the button for now, we'll fix the root cause later
    />
  );
}
