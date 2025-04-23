
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

  const loadOrCreateGame = async () => {
    if (!user) return;

    try {
      const { data: games } = await supabase
        .from('games')
        .select('*')
        .order('updated_at', { ascending: false })
        .limit(1);

      if (games && games.length > 0) {
        const gameId = games[0].id;
        setCurrentGameId(gameId);

        const { data: players } = await supabase
          .from('players')
          .select('*')
          .eq('game_id', gameId);

        if (players && players.length > 0) {
          const formattedPlayers = players.map(p => ({
            id: parseInt(p.id),
            name: p.name,
            states: p.states as string[],
            score: p.score
          }));
          setPlayers(formattedPlayers);
          setActivePlayer(formattedPlayers[0].id);
          const allSpottedStates = formattedPlayers.reduce((acc, player) => 
            [...acc, ...player.states], [] as string[]);
          setGlobalSpottedStates([...new Set(allSpottedStates)]);
          return;
        }
      }

      const { data: newGame } = await supabase
        .from('games')
        .insert({ user_id: user.id })
        .select()
        .single();

      if (newGame) {
        setCurrentGameId(newGame.id);
        const { data: newPlayer } = await supabase
          .from('players')
          .insert({
            game_id: newGame.id,
            name: 'Player 1',
            states: [],
            score: 0
          })
          .select()
          .single();

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
      }
    } catch (error) {
      console.error('Error loading/creating game:', error);
      toast({
        title: "Error",
        description: "Failed to load or create game",
        duration: 3000,
      });
    }
  };

  useEffect(() => {
    if (user) {
      loadOrCreateGame();
    }
  }, [user]);

  return {
    players,
    setPlayers,
    activePlayer,
    setActivePlayer,
    globalSpottedStates,
    setGlobalSpottedStates,
    currentGameId
  };
}
