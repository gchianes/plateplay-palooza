
import { useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { Player } from '@/types/player';
import { useGameOperations } from './operations/useGameOperations';
import { usePlayerOperations } from './operations/usePlayerOperations';
import { toast } from '@/components/ui/use-toast';

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
    loadOrCreateGame();
  }, [user]);

  const loadOrCreateGame = async () => {
    try {
      setIsLoading(true);
      console.log("Loading or creating game for user:", user?.id || "anonymous");
      
      // Attempt to load existing game
      const existingGameId = await loadExistingGame();
      
      if (existingGameId) {
        // For mock game ID, create local players
        if (existingGameId === "mock-game-id") {
          console.log("Using mock game ID, creating local player");
          setDefaultPlayer(setPlayersState);
          setIsLoading(false);
          return;
        }
        
        const existingPlayers = await fetchPlayers(existingGameId);
        if (existingPlayers && existingPlayers.length > 0) {
          // Ensure all player IDs are properly formatted as numbers
          const formattedPlayers = existingPlayers.map(player => ({
            ...player,
            id: getNumericId(player.id)
          }));
          setPlayersState(formattedPlayers);
        } else {
          // Create initial player if none exists
          const initialPlayer = await createInitialPlayer(existingGameId);
          if (initialPlayer) {
            setPlayersState([initialPlayer]);
          } else {
            setDefaultPlayer(setPlayersState);
          }
        }
      } else {
        // Create new game if none exists
        const newGameId = await createNewGame();
        if (newGameId) {
          // For mock game ID, create local players
          if (newGameId === "mock-game-id") {
            console.log("Using mock game ID, creating local player");
            setDefaultPlayer(setPlayersState);
            setIsLoading(false);
            return;
          }
          
          const initialPlayer = await createInitialPlayer(newGameId);
          if (initialPlayer) {
            setPlayersState([initialPlayer]);
          } else {
            setDefaultPlayer(setPlayersState);
          }
        } else {
          setDefaultPlayer(setPlayersState);
          toast({
            title: "Error",
            description: "Could not initialize game. Using offline mode.",
            duration: 3000,
          });
        }
      }
    } catch (error) {
      console.error('Error loading/creating game:', error);
      setDefaultPlayer(setPlayersState);
      toast({
        title: "Error",
        description: "There was a problem initializing your game. Using offline mode.",
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function to safely convert any type of ID to a number
  const getNumericId = (id: any): number => {
    if (id === null || id === undefined) {
      return 0;
    }
    
    if (typeof id === 'number') {
      return id;
    } 
    
    if (typeof id === 'string') {
      return parseInt(id) || 0;
    }
    
    if (typeof id === 'object') {
      // Handle object-like IDs that might come from serialization
      if (id._type === 'Number' && 'value' in id) {
        return parseInt(String(id.value) || '0') || 0;
      }
    }
    
    return 0;
  };

  const setPlayers = (newPlayers: Player[]) => {
    if (!Array.isArray(newPlayers)) {
      console.error('setPlayers called with non-array value:', newPlayers);
      return;
    }
    
    // Ensure all player IDs are properly formatted as numbers
    const formattedPlayers = newPlayers.map(player => {
      if (!player) {
        return { id: 0, name: "Unknown", states: [], score: 0 };
      }

      return {
        ...player,
        id: getNumericId(player.id)
      };
    });
    
    setPlayersState(formattedPlayers);
  };

  return { players, currentGameId, isLoading, setPlayers };
}
