
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

export const useGameOperations = (userId: string | undefined) => {
  const [currentGameId, setCurrentGameId] = useState<string | null>(null);

  const loadExistingGame = async () => {
    if (!userId || userId === 'mock-user-id') {
      console.log("Using mock user ID or no user ID, skipping database operations");
      return null;
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
        return null;
      }

      if (games && games.length > 0) {
        setCurrentGameId(games[0].id);
        return games[0].id;
      }
    } catch (error) {
      console.error("Error loading game:", error);
    }
    
    return null;
  };

  const createNewGame = async () => {
    try {
      if (!userId || userId === 'mock-user-id') {
        console.log("Using mock user ID or no user ID, skipping database operations");
        return null;
      }

      console.log("No existing game found, creating new game");
      const { data: newGame, error: newGameError } = await supabase
        .from('games')
        .insert({ user_id: userId })
        .select()
        .single();

      if (newGameError) {
        console.error("Error creating new game:", newGameError);
        throw newGameError;
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
    return null;
  };

  return {
    currentGameId,
    loadExistingGame,
    createNewGame,
  };
};
