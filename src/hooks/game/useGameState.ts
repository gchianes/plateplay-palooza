
import { useState } from 'react';
import { User } from '@supabase/supabase-js';
import { Player } from '@/types/player';
import { UseGameStateReturn } from '@/types/game';
import { useGameFetch } from './useGameFetch';

export function useGameState(user: User | null): UseGameStateReturn {
  const [activePlayer, setActivePlayer] = useState<number>(0);
  const [globalSpottedStates, setGlobalSpottedStates] = useState<string[]>([]);
  
  const { players, currentGameId, isLoading } = useGameFetch(user);
  
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
