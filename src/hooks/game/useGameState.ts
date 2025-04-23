
import { useState } from 'react';
import { User } from '@supabase/supabase-js';
import { Player } from '@/types/player';
import { UseGameStateReturn } from '@/types/game';
import { useGameFetch } from './useGameFetch';

export function useGameState(user: User | null): UseGameStateReturn {
  const [activePlayer, setActivePlayer] = useState<number>(0);
  const [globalSpottedStates, setGlobalSpottedStates] = useState<string[]>([]);
  
  const { players: fetchedPlayers, currentGameId, isLoading } = useGameFetch(user);
  
  // Ensure we have at least one player
  const players = fetchedPlayers?.length ? fetchedPlayers : [{
    id: 0,
    name: 'Player 1',
    states: [],
    score: 0
  }];
  
  const setPlayers = (newPlayers: Player[]) => {
    // This will be handled by useGameFetch through database updates
    console.log("Setting players:", newPlayers);
  };

  return {
    players,
    setPlayers,
    activePlayer,
    setActivePlayer,
    globalSpottedStates,
    setGlobalSpottedStates,
    currentGameId,
    isLoading
  };
}
