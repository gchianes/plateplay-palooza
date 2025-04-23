
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
  globalSpottedStates: string[];
  setGlobalSpottedStates: (states: string[]) => void;
}

export function PlayerManagement({
  players,
  setPlayers,
  activePlayer,
  setActivePlayer,
  currentGameId,
  globalSpottedStates,
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
    // Fix: Check if players array exists and its length
    if (!currentGameId || (players && players.length >= 6)) {
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
          name: `Player ${players ? players.length + 1 : 1}`,
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
        // Fix: Handle case where players might be undefined
        setPlayers(players ? [...players, formattedPlayer] : [formattedPlayer]);
        
        // If this is the first player, set it as active
        if (!players || players.length === 0) {
          setActivePlayer(formattedPlayer.id);
        }
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
    // Fix: Check if players exists and has more than 1 element
    if (!currentGameId || !players || players.length <= 1) return;

    try {
      await supabase
        .from('players')
        .delete()
        .eq('game_id', currentGameId)
        .eq('id', playerId.toString());

      const playerToRemove = players.find(p => p.id === playerId);
      if (playerToRemove) {
        const updatedStates = globalSpottedStates.filter(
          stateId => !playerToRemove.states.includes(stateId)
        );
        setGlobalSpottedStates(updatedStates);
      }
      
      const updatedPlayers = players.filter(p => p.id !== playerId);
      setPlayers(updatedPlayers);
      
      if (activePlayer === playerId && updatedPlayers.length > 0) {
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
      players={players || []}  // Fix: Provide empty array if players is undefined
      activePlayer={activePlayer}
      onPlayerAdd={handleAddPlayer}
      onPlayerRemove={handleRemovePlayer}
      onPlayerSelect={setActivePlayer}
      onPlayerNameChange={handleNameChange}
    />
  );
}
