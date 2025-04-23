
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

export const useGameOperations = (userId: string | undefined) => {
  const [currentGameId, setCurrentGameId] = useState<string | null>(null);

  const loadExistingGame = async () => {
    if (!userId) {
      console.log("No user ID provided, using mock game ID");
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
        return null;
      }

      if (games && games.length > 0) {
        console.log("Found existing game:", games[0].id);
        setCurrentGameId(games[0].id);
        return games[0].id;
      }
      
      // No existing game found, create a new one
      return await createNewGame();
    } catch (error) {
      console.error("Error loading game:", error);
      return null;
    }
  };

  const createNewGame = async () => {
    if (!userId) {
      console.log("No user ID provided, using mock game ID");
      return "mock-game-id";
    }

    try {
      const { data: newGame, error: newGameError } = await supabase
        .from('games')
        .insert({ 
          user_id: userId,
          name: 'New Game',
        })
        .select()
        .single();

      if (newGameError) {
        console.error("Error creating new game:", newGameError);
        toast({
          title: "Error",
          description: "Failed to create new game",
          duration: 3000,
        });
        return null;
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
