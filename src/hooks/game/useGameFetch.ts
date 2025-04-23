
import { useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { Player } from '@/types/player';
import { useGameOperations } from './operations/useGameOperations';
import { usePlayerOperations } from './operations/usePlayerOperations';

interface UseGameFetchReturn {
  players: Player[];
  currentGameId: string | null;
  isLoading: boolean;
  setPlayers: (players: Player[]) => void;
}

export function useGameFetch(user: User | null): UseGameFetchReturn {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [players, setPlayersState] = useState<Player[]>([]);
  const { currentGameId, loadExistingGame, createNewGame } = useGameOperations(user?.id);
  const { fetchPlayers, createInitialPlayer, setDefaultPlayer } = usePlayerOperations();

  useEffect(() => {
    if (user) {
      loadOrCreateGame();
    } else {
      setDefaultPlayer(setPlayersState);
      setIsLoading(false);
    }
  }, [user]);

  const loadOrCreateGame = async () => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      console.log("Loading or creating game for user:", user.id);
      
      const existingGameId = await loadExistingGame();
      
      if (existingGameId) {
        const existingPlayers = await fetchPlayers(existingGameId);
        if (existingPlayers) {
          setPlayersState(existingPlayers);
        } else {
          const initialPlayer = await createInitialPlayer(existingGameId);
          if (initialPlayer) {
            setPlayersState([initialPlayer]);
          } else {
            setDefaultPlayer(setPlayersState);
          }
        }
      } else {
        const newGameId = await createNewGame();
        if (newGameId) {
          const initialPlayer = await createInitialPlayer(newGameId);
          if (initialPlayer) {
            setPlayersState([initialPlayer]);
          } else {
            setDefaultPlayer(setPlayersState);
          }
        } else {
          setDefaultPlayer(setPlayersState);
        }
      }
    } catch (error) {
      console.error('Error loading/creating game:', error);
      setDefaultPlayer(setPlayersState);
    } finally {
      setIsLoading(false);
    }
  };

  const setPlayers = (newPlayers: Player[]) => {
    setPlayersState(newPlayers);
  };

  return { players, currentGameId, isLoading, setPlayers };
}
