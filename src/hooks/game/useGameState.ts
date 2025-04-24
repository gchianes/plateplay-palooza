
import { useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { Player } from '@/types/player';
import { UseGameStateReturn } from '@/types/game';
import { useGameFetch } from './useGameFetch';

export function useGameState(user: User | null): UseGameStateReturn {
  const [activePlayer, setActivePlayer] = useState<number>(0);
  const [globalSpottedStates, setGlobalSpottedStates] = useState<string[]>([]);
  
  const { players: fetchedPlayers, currentGameId, isLoading, setPlayers: updatePlayers } = useGameFetch(user);
  
  // Ensure we have at least one player
  const players = fetchedPlayers?.length ? fetchedPlayers : [{
    id: 0,
    name: 'Player 1',
    states: [],
    score: 0
  }];

  // Initialize states from loaded players
  useEffect(() => {
    if (players.length > 0) {
      const allSpottedStates = players.reduce((acc: string[], player) => {
        player.states.forEach(state => {
          if (!acc.includes(state)) {
            acc.push(state);
          }
        });
        return acc;
      }, []);
      
      console.log("Initializing global spotted states from loaded players:", allSpottedStates);
      setGlobalSpottedStates(allSpottedStates);
    }
  }, [players]);
  
  const setPlayers = (newPlayers: Player[]) => {
    updatePlayers(newPlayers);
  };

  useEffect(() => {
    // Make sure we have an active player selected
    if (players.length > 0 && (activePlayer === 0 || !players.find(p => p.id === activePlayer))) {
      setActivePlayer(players[0].id);
    }
  }, [players, activePlayer]);

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
