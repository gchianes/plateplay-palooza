
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';
import { toast } from '@/components/ui/use-toast';
import { Player } from '@/types/player';

interface UseGameFetchReturn {
  players: Player[];
  currentGameId: string | null;
  isLoading: boolean;
}

export function useGameFetch(user: User | null): UseGameFetchReturn {
  const [players, setPlayers] = useState<Player[]>([]);
  const [currentGameId, setCurrentGameId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    if (user) {
      loadOrCreateGame();
    } else {
      setPlayers([]);
      setCurrentGameId(null);
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
      
      const userId = user.id;
      if (!userId) {
        console.error("No valid user ID found");
        setIsLoading(false);
        return;
      }

      console.log("Fetching games for userId:", userId);
      const { data: games, error: gamesError } = await supabase
        .from('games')
        .select('*')
        .eq('user_id', userId)
        .order('updated_at', { ascending: false })
        .limit(1);

      console.log("Games fetched:", games);
      if (gamesError) {
        console.error("Error fetching games:", gamesError);
      }

      if (games && games.length > 0) {
        await handleExistingGame(games[0].id);
      } else {
        await createNewGame(userId);
      }
    } catch (error) {
      console.error('Error loading/creating game:', error);
      toast({
        title: "Error",
        description: "Failed to load or create game",
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleExistingGame = async (gameId: string) => {
    setCurrentGameId(gameId);
    console.log("Found existing game with ID:", gameId);

    const { data: playersData, error: playersError } = await supabase
      .from('players')
      .select('*')
      .eq('game_id', gameId);

    console.log("Players fetched:", playersData);
    if (playersError) {
      console.error("Error fetching players:", playersError);
      return;
    }

    if (playersData && playersData.length > 0) {
      const formattedPlayers = playersData.map(p => ({
        id: parseInt(p.id),
        name: p.name,
        states: p.states as string[],
        score: p.score
      }));
      
      console.log("Setting players to:", formattedPlayers);
      setPlayers(formattedPlayers);
    } else {
      await createInitialPlayer(gameId);
    }
  };

  const createNewGame = async (userId: string) => {
    console.log("No existing game found, creating new game");
    try {
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
        await createInitialPlayer(newGame.id);
      }
    } catch (error) {
      console.error("Error in game creation:", error);
      toast({
        title: "Error",
        description: "Failed to create game",
        duration: 3000,
      });
    }
  };

  const createInitialPlayer = async (gameId: string) => {
    try {
      const { data: newPlayer, error: newPlayerError } = await supabase
        .from('players')
        .insert({
          game_id: gameId,
          name: 'Player 1',
          states: [],
          score: 0
        })
        .select()
        .single();

      if (newPlayerError) {
        console.error("Error creating initial player:", newPlayerError);
        throw newPlayerError;
      }

      if (newPlayer) {
        console.log("Created initial player:", newPlayer);
        const formattedPlayer = {
          id: parseInt(newPlayer.id),
          name: newPlayer.name,
          states: newPlayer.states as string[],
          score: newPlayer.score
        };
        setPlayers([formattedPlayer]);
      }
    } catch (error) {
      console.error("Error in player creation:", error);
      toast({
        title: "Error",
        description: "Failed to create player",
        duration: 3000,
      });
    }
  };

  return { players, currentGameId, isLoading };
}
