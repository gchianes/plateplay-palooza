
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

export const useGameOperations = (userId: string | undefined) => {
  const [currentGameId, setCurrentGameId] = useState<string | null>("mock-game-id"); // Default to a mock game ID

  const loadExistingGame = async () => {
    if (!userId) {
      console.log("No user ID provided, using mock game ID");
      return "mock-game-id";
    }

    if (userId === 'mock-user-id') {
      console.log("Using mock user ID, using mock game ID");
      return "mock-game-id";
    }

    try {
      const { data: games, error: gamesError } = await supabase
        .from('games')
        .select('*')
        .eq('user_id', userId)
        .order('updated_at', { ascending: false })
        .limit(1);

      if (gamesError) {
        console.error("Error fetching games:", gamesError);
        return "mock-game-id"; // Return mock ID on error
      }

      if (games && games.length > 0) {
        setCurrentGameId(games[0].id);
        return games[0].id;
      } else {
        // No games found, return mock ID
        return "mock-game-id";
      }
    } catch (error) {
      console.error("Error loading game:", error);
      return "mock-game-id"; // Return mock ID on error
    }
  };

  const createNewGame = async () => {
    if (!userId) {
      console.log("No user ID provided, using mock game ID");
      return "mock-game-id";
    }

    if (userId === 'mock-user-id') {
      console.log("Using mock user ID, using mock game ID");
      return "mock-game-id";
    }

    try {
      console.log("No existing game found, creating new game");
      const { data: newGame, error: newGameError } = await supabase
        .from('games')
        .insert({ user_id: userId })
        .select()
        .single();

      if (newGameError) {
        console.error("Error creating new game:", newGameError);
        return "mock-game-id"; // Return mock ID on error
      }

      if (newGame) {
        console.log("Created new game with ID:", newGame.id);
        setCurrentGameId(newGame.id);
        return newGame.id;
      }
    } catch (error) {
      console.error("Error in game creation:", error);
      toast({
        title: "Error",
        description: "Failed to create game",
        duration: 3000,
      });
    }
    return "mock-game-id"; // Return mock ID by default
  };

  return {
    currentGameId,
    loadExistingGame,
    createNewGame,
  };
};
