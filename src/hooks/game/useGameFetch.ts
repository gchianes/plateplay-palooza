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
            id: typeof player.id === 'string' ? parseInt(player.id) : player.id
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

  const setPlayers = (newPlayers: Player[]) => {
    // Ensure all player IDs are properly formatted as numbers
    const formattedPlayers = newPlayers.map(player => {
      if (player === null || player === undefined) {
        return { id: 0, name: "Unknown", states: [], score: 0 };
      }

      const id = player.id;
      
      // Handle object-like IDs (might come from DB or serialization)
      if (id !== null && typeof id === 'object' && typeof id._type === 'string' && id._type === 'Number') {
        return {
          ...player,
          id: parseInt(id.value) || 0
        };
      }
      
      // Handle any other cases to ensure id is always a number
      return {
        ...player,
        id: typeof id === 'number' ? id : 0
      };
    });
    
    setPlayersState(formattedPlayers);
  };

  return { players, currentGameId, isLoading, setPlayers };
}
