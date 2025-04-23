
import React from 'react';
import { Player } from '@/types/player';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import PlayerScores from './PlayerScores';

interface PlayerManagementProps {
  players: Player[];
  setPlayers: (players: Player[]) => void;
  activePlayer: number;
  setActivePlayer: (id: number) => void;
  currentGameId: string | null;
  setGlobalSpottedStates: (states: string[]) => void;
}

export function PlayerManagement({
  players,
  setPlayers,
  activePlayer,
  setActivePlayer,
  currentGameId,
  setGlobalSpottedStates
}: PlayerManagementProps) {
  const handleNameChange = async (playerId: number, newName: string) => {
    if (!currentGameId) return;

    try {
      await supabase
        .from('players')
        .update({ name: newName })
        .eq('game_id', currentGameId)
        .eq('id', playerId.toString());

      setPlayers(players.map(player => 
        player.id === playerId 
          ? { ...player, name: newName }
          : player
      ));

      toast({
        title: "Name updated",
        description: "Player name has been changed successfully.",
        duration: 3000,
      });
    } catch (error) {
      console.error('Error updating player name:', error);
      toast({
        title: "Error",
        description: "Failed to update player name",
        duration: 3000,
      });
    }
  };

  const handleAddPlayer = async () => {
    if (!currentGameId || players.length >= 6) {
      toast({
        title: "Maximum players reached",
        description: "You can only have up to 6 players in a game.",
        duration: 3000,
      });
      return;
    }

    try {
      const { data: newPlayer } = await supabase
        .from('players')
        .insert({
          game_id: currentGameId,
          name: `Player ${players.length + 1}`,
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
        setPlayers([...players, formattedPlayer]);
      }
    } catch (error) {
      console.error('Error adding player:', error);
      toast({
        title: "Error",
        description: "Failed to add new player",
        duration: 3000,
      });
    }
  };

  const handleRemovePlayer = async (playerId: number) => {
    if (!currentGameId || players.length <= 1) return;

    try {
      await supabase
        .from('players')
        .delete()
        .eq('game_id', currentGameId)
        .eq('id', playerId.toString());

      const playerToRemove = players.find(p => p.id === playerId);
      if (playerToRemove) {
        setGlobalSpottedStates(prev => 
          prev.filter(stateId => !playerToRemove.states.includes(stateId))
        );
      }
      
      const updatedPlayers = players.filter(p => p.id !== playerId);
      setPlayers(updatedPlayers);
      
      if (activePlayer === playerId) {
        setActivePlayer(updatedPlayers[0].id);
      }
    } catch (error) {
      console.error('Error removing player:', error);
      toast({
        title: "Error",
        description: "Failed to remove player",
        duration: 3000,
      });
    }
  };

  return (
    <PlayerScores 
      players={players}
      activePlayer={activePlayer}
      onPlayerAdd={handleAddPlayer}
      onPlayerRemove={handleRemovePlayer}
      onPlayerSelect={setActivePlayer}
      onPlayerNameChange={handleNameChange}
    />
  );
}
