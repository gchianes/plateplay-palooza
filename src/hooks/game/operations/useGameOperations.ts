
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

export const useGameOperations = (userId: string | undefined) => {
  const [currentGameId, setCurrentGameId] = useState<string | null>(null);

  const loadExistingGame = async () => {
    if (!userId || !isValidUUID(userId)) {
      console.log("No valid user ID provided, using mock game ID");
      const mockId = "mock-game-id";
      setCurrentGameId(mockId);
      return mockId;
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
        // Fall back to mock game ID on error
        const mockId = "mock-game-id";
        setCurrentGameId(mockId);
        return mockId;
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
      const mockId = "mock-game-id";
      setCurrentGameId(mockId);
      return mockId;
    }
  };

  const createNewGame = async () => {
    if (!userId || !isValidUUID(userId)) {
      console.log("No valid user ID provided, using mock game ID");
      const mockId = "mock-game-id";
      setCurrentGameId(mockId);
      return mockId;
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
          description: "Failed to create new game. Using offline mode.",
          duration: 3000,
        });
        // Fall back to mock game ID on error
        const mockId = "mock-game-id";
        setCurrentGameId(mockId);
        return mockId;
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
        description: "Failed to create game. Using offline mode.",
        duration: 3000,
      });
    }
    // Final fallback
    const mockId = "mock-game-id";
    setCurrentGameId(mockId);
    return mockId;
  };

  // Helper function to validate UUID format
  const isValidUUID = (uuid: string): boolean => {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    return uuidRegex.test(uuid);
  };

  return {
    currentGameId,
    loadExistingGame,
    createNewGame,
  };
};
