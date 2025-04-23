
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { Player } from '@/types/player';
import { useState, useCallback } from 'react';

interface UsePlayerOperationsProps {
  currentGameId: string | null;
  players: Player[];
  setPlayers: (players: Player[]) => void;
  activePlayer: number;
  setActivePlayer: (id: number) => void;
  globalSpottedStates: string[];
  setGlobalSpottedStates: (states: string[]) => void;
}

export function usePlayerOperations({
  currentGameId,
  players,
  setPlayers,
  activePlayer,
  setActivePlayer,
  globalSpottedStates,
  setGlobalSpottedStates
}: UsePlayerOperationsProps) {
  const handleNameChange = async (playerId: number, newName: string) => {
    if (!currentGameId) {
      console.error("No current game ID available for name change");
      toast({
        title: "Error",
        description: "Game not initialized properly",
        duration: 3000,
      });
      return;
    }

    try {
      console.log(`Updating player ${playerId} name to ${newName} for game ${currentGameId}`);
      const { error } = await supabase
        .from('players')
        .update({ name: newName })
        .eq('game_id', currentGameId)
        .eq('id', playerId.toString());

      if (error) {
        console.error('Error updating player name:', error);
        toast({
          title: "Error",
          description: "Failed to update player name",
          duration: 3000,
        });
        return;
      }

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
    if (!currentGameId) {
      console.error("No current game ID available for adding player");
      toast({
        title: "Error",
        description: "Game not initialized properly",
        duration: 3000,
      });
      return;
    }
    
    const currentPlayers = Array.isArray(players) ? players : [];
    if (currentPlayers.length >= 6) {
      toast({
        title: "Maximum players reached",
        description: "You can only have up to 6 players in a game.",
        duration: 3000,
      });
      return;
    }

    try {
      console.log("Adding new player for game:", currentGameId);
      const { data: newPlayer, error } = await supabase
        .from('players')
        .insert({
          game_id: currentGameId,
          name: `Player ${currentPlayers.length + 1}`,
          states: [],
          score: 0
        })
        .select()
        .single();

      if (error) {
        console.error("Error inserting player:", error);
        toast({
          title: "Error",
          description: "Failed to add new player: " + error.message,
          duration: 3000,
        });
        return;
      }

      if (newPlayer) {
        console.log("New player created:", newPlayer);
        const formattedPlayer = {
          id: parseInt(newPlayer.id),
          name: newPlayer.name,
          states: newPlayer.states as string[],
          score: newPlayer.score
        };
        
        const updatedPlayers = [...currentPlayers, formattedPlayer];
        console.log("Updated players:", updatedPlayers);
        setPlayers(updatedPlayers);
        
        if (currentPlayers.length === 0) {
          setActivePlayer(formattedPlayer.id);
        }
        
        toast({
          title: "Player added",
          description: `${formattedPlayer.name} has been added to the game.`,
          duration: 3000,
        });
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
    if (!currentGameId) {
      console.error("No current game ID available for removing player");
      toast({
        title: "Error",
        description: "Game not initialized properly",
        duration: 3000,
      });
      return;
    }
    
    const currentPlayers = Array.isArray(players) ? players : [];
    if (currentPlayers.length <= 1) {
      toast({
        title: "Cannot remove player",
        description: "You must have at least one player in the game.",
        duration: 3000,
      });
      return;
    }

    try {
      console.log("Removing player:", playerId);
      const { error } = await supabase
        .from('players')
        .delete()
        .eq('game_id', currentGameId)
        .eq('id', playerId.toString());

      if (error) {
        console.error('Error removing player:', error);
        toast({
          title: "Error",
          description: "Failed to remove player: " + error.message,
          duration: 3000,
        });
        return;
      }

      const playerToRemove = currentPlayers.find(p => p.id === playerId);
      if (playerToRemove) {
        const updatedStates = globalSpottedStates.filter(
          stateId => !playerToRemove.states.includes(stateId)
        );
        setGlobalSpottedStates(updatedStates);
      }
      
      const updatedPlayers = currentPlayers.filter(p => p.id !== playerId);
      console.log("Updated players after removal:", updatedPlayers);
      setPlayers(updatedPlayers);
      
      if (activePlayer === playerId && updatedPlayers.length > 0) {
        setActivePlayer(updatedPlayers[0].id);
      }
      
      toast({
        title: "Player removed",
        description: "Player has been removed from the game.",
        duration: 3000,
      });
    } catch (error) {
      console.error('Error removing player:', error);
      toast({
        title: "Error",
        description: "Failed to remove player",
        duration: 3000,
      });
    }
  };

  return {
    handleNameChange,
    handleAddPlayer,
    handleRemovePlayer,
  };
}
