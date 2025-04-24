
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
  const { currentGameId, loadExistingGame, createNewGame } = useGameOperations(user?.id || null);
  const { fetchPlayers, createInitialPlayer, setDefaultPlayer } = usePlayerOperations();

  useEffect(() => {
    loadOrCreateGame();
  }, [user]);

  const loadOrCreateGame = async () => {
    try {
      setIsLoading(true);
      console.log("Loading or creating game for user:", user?.id || "anonymous");
      
      // Attempt to load existing game with explicit user ID
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
          // Transform players from database to client format
          const formattedPlayers = existingPlayers.map((player, index) => ({
            id: index + 1, // Client-side numeric ID
            name: player.name,
            states: Array.isArray(player.states) ? player.states : [],
            score: player.score || 0,
            databaseId: player.id as string // Explicitly cast to string type
          }));
          setPlayersState(formattedPlayers);
        } else {
          // Create initial player if none exists
          const initialPlayer = await createInitialPlayer(existingGameId);
          if (initialPlayer) {
            setPlayersState([{
              id: 1,
              name: initialPlayer.name,
              states: Array.isArray(initialPlayer.states) ? initialPlayer.states : [],
              score: initialPlayer.score || 0,
              databaseId: initialPlayer.id as string // Explicitly cast to string type
            }]);
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
            setPlayersState([{
              id: 1,
              name: initialPlayer.name,
              states: Array.isArray(initialPlayer.states) ? initialPlayer.states : [],
              score: initialPlayer.score || 0,
              databaseId: initialPlayer.id as string // Explicitly cast to string type
            }]);
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

  // Ensure consistent player formatting when setting players
  const setPlayers = (newPlayers: Player[]) => {
    if (!Array.isArray(newPlayers)) {
      console.error('setPlayers called with non-array value:', newPlayers);
      return;
    }
    
    // Preserve database IDs when updating players
    const formattedPlayers = newPlayers.map((player, index) => {
      if (!player) {
        return { id: index + 1, name: "Unknown", states: [], score: 0 };
      }
      
      // Find existing player with same ID to preserve databaseId
      const existingPlayer = players.find(p => p.id === player.id);
      
      return {
        ...player,
        id: player.id || index + 1,
        databaseId: player.databaseId || (existingPlayer ? existingPlayer.databaseId : undefined)
      };
    });
    
    setPlayersState(formattedPlayers);
  };

  return { players, currentGameId, isLoading, setPlayers };
}
