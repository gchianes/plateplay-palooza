
import { useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { Player } from '@/types/player';
import { useGameOperations } from './operations/useGameOperations';
import { usePlayerOperations } from './operations/usePlayerOperations';

interface UseGameFetchReturn {
  players: Player[];
  currentGameId: string | null;
  isLoading: boolean;
}

export function useGameFetch(user: User | null): UseGameFetchReturn {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { currentGameId, loadExistingGame, createNewGame } = useGameOperations(user?.id);
  const { players, fetchPlayers, createInitialPlayer, setDefaultPlayer } = usePlayerOperations();

  useEffect(() => {
    if (user) {
      loadOrCreateGame();
    } else {
      setDefaultPlayer();
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
        if (!existingPlayers) {
          await createInitialPlayer(existingGameId);
        }
      } else {
        const newGameId = await createNewGame();
        if (newGameId) {
          await createInitialPlayer(newGameId);
        }
      }
    } catch (error) {
      console.error('Error loading/creating game:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return { players, currentGameId, isLoading };
}
