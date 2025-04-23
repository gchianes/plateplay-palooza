
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { Player } from '@/types/player';

export const usePlayerOperations = () => {
  const fetchPlayers = async (gameId: string) => {
    if (!gameId) return null;
    
    try {
      const { data: playersData, error: playersError } = await supabase
        .from('players')
        .select('*')
        .eq('game_id', gameId);

      if (playersError) {
        console.error("Error fetching players:", playersError);
        return null;
      }

      if (playersData && playersData.length > 0) {
        return playersData.map(p => ({
          id: parseInt(p.id),
          name: p.name,
          states: p.states as string[],
          score: p.score
        }));
      }
    } catch (error) {
      console.error("Error fetching players:", error);
    }
    
    return null;
  };

  const createInitialPlayer = async (gameId: string) => {
    if (!gameId || gameId === "mock-game-id") {
      return createDefaultPlayer();
    }
    
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
        return createDefaultPlayer();
      }

      if (newPlayer) {
        return {
          id: parseInt(newPlayer.id),
          name: newPlayer.name,
          states: newPlayer.states as string[],
          score: newPlayer.score
        };
      }
    } catch (error) {
      console.error("Error in player creation:", error);
    }
    
    return createDefaultPlayer();
  };

  const createDefaultPlayer = (): Player => {
    console.log("Creating default local player");
    return {
      id: 1,
      name: 'Player 1',
      states: [],
      score: 0
    };
  };

  const setDefaultPlayer = (setPlayersFunc?: React.Dispatch<React.SetStateAction<Player[]>>) => {
    const defaultPlayer = createDefaultPlayer();
    
    if (setPlayersFunc) {
      setPlayersFunc([defaultPlayer]);
    }
    
    return defaultPlayer;
  };

  return {
    fetchPlayers,
    createInitialPlayer,
    setDefaultPlayer,
    createDefaultPlayer
  };
};
