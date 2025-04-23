
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { Player } from '@/types/player';

export const usePlayerOperations = () => {
  const fetchPlayers = async (gameId: string) => {
    const { data: playersData, error: playersError } = await supabase
      .from('players')
      .select('*')
      .eq('game_id', gameId);

    if (playersError) {
      console.error("Error fetching players:", playersError);
      return null;
    }

    if (playersData && playersData.length > 0) {
      const formattedPlayers = playersData.map(p => ({
        id: parseInt(p.id),
        name: p.name,
        states: p.states as string[],
        score: p.score
      }));
      
      return formattedPlayers;
    }
    
    return null;
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
        const formattedPlayer = {
          id: parseInt(newPlayer.id),
          name: newPlayer.name,
          states: newPlayer.states as string[],
          score: newPlayer.score
        };
        return formattedPlayer;
      }
    } catch (error) {
      console.error("Error in player creation:", error);
      toast({
        title: "Error",
        description: "Failed to create player",
        duration: 3000,
      });
    }
    return null;
  };

  const setDefaultPlayer = (setPlayersStateFn?: (players: Player[]) => void) => {
    const defaultPlayer = {
      id: 0,
      name: 'Player 1',
      states: [],
      score: 0
    };
    
    if (setPlayersStateFn) {
      setPlayersStateFn([defaultPlayer]);
    }
    
    return defaultPlayer;
  };

  return {
    fetchPlayers,
    createInitialPlayer,
    setDefaultPlayer
  };
};
