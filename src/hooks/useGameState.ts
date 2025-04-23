
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Player } from '@/types/player';
import { toast } from '@/components/ui/use-toast';
import { User } from '@supabase/supabase-js';
import { UseGameStateReturn } from '@/types/game';

export function useGameState(user: User | null): UseGameStateReturn {
  const [players, setPlayers] = useState<Player[]>([]);
  const [activePlayer, setActivePlayer] = useState<number>(0);
  const [globalSpottedStates, setGlobalSpottedStates] = useState<string[]>([]);
  const [currentGameId, setCurrentGameId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const loadOrCreateGame = async () => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      console.log("Loading or creating game for user:", user.id);
      
      // For development/testing, check if we have a mock user
      const userId = user.id;
      if (!userId) {
        console.error("No valid user ID found");
        setIsLoading(false);
        return;
      }

      // First try to load an existing game
      const { data: games, error: gamesError } = await supabase
        .from('games')
        .select('*')
        .eq('user_id', userId)
        .order('updated_at', { ascending: false })
        .limit(1);

      console.log("Games fetched:", games);
      if (gamesError) {
        console.error("Error fetching games:", gamesError);
        // Continue execution to create a new game
      }

      if (games && games.length > 0) {
        const gameId = games[0].id;
        setCurrentGameId(gameId);
        console.log("Found existing game with ID:", gameId);

        const { data: playersData, error: playersError } = await supabase
          .from('players')
          .select('*')
          .eq('game_id', gameId);

        console.log("Players fetched:", playersData);
        if (playersError) {
          console.error("Error fetching players:", playersError);
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
          setActivePlayer(formattedPlayers[0].id);
          
          const allSpottedStates = formattedPlayers.reduce((acc, player) => 
            [...acc, ...player.states], [] as string[]);
          setGlobalSpottedStates([...new Set(allSpottedStates)]);
          
          setIsLoading(false);
          return;
        } else {
          console.log("No players found for game, creating initial player");
          try {
            // Game exists but no players, create an initial player
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
              const formattedPlayer = {
                id: parseInt(newPlayer.id),
                name: newPlayer.name,
                states: newPlayer.states as string[],
                score: newPlayer.score
              };
              setPlayers([formattedPlayer]);
              setActivePlayer(formattedPlayer.id);
            }
          } catch (error) {
            console.error("Error in player creation:", error);
            toast({
              title: "Error",
              description: "Failed to create player",
              duration: 3000,
            });
          }
          
          setIsLoading(false);
          return;
        }
      }

      console.log("No existing game found, creating new game");
      try {
        // If no game exists, create a new one
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
          
          // Create initial player
          const { data: newPlayer, error: newPlayerError } = await supabase
            .from('players')
            .insert({
              game_id: newGame.id,
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
            setActivePlayer(formattedPlayer.id);
          }
        }
      } catch (error) {
        console.error("Error in game/player creation:", error);
        toast({
          title: "Error",
          description: "Failed to create game or player",
          duration: 3000,
        });
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

  useEffect(() => {
    if (user) {
      loadOrCreateGame();
    } else {
      setPlayers([]);
      setActivePlayer(0);
      setGlobalSpottedStates([]);
      setCurrentGameId(null);
      setIsLoading(false);
    }
  }, [user]);

  return {
    players,
    setPlayers,
    activePlayer,
    setActivePlayer,
    globalSpottedStates,
    setGlobalSpottedStates,
    currentGameId,
    isLoading
  };
}
