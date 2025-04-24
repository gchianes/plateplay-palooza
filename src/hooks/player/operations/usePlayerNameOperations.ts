
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { Player } from '@/types/player';

interface UsePlayerNameOperationsProps {
  currentGameId: string | null;
  players: Player[];
  setPlayers: (players: Player[]) => void;
}

export function usePlayerNameOperations({
  currentGameId,
  players,
  setPlayers
}: UsePlayerNameOperationsProps) {
  const handleNameChange = async (playerId: number, newName: string) => {
    // Log the parameters to help diagnose issues
    console.log(`Attempting to update player name. Client ID: ${playerId}, New name: ${newName}, Game ID: ${currentGameId}`);
    
    // Find the player with the specified client-side ID to get their database ID
    const playerToUpdate = players.find(p => p.id === playerId);
    if (!playerToUpdate) {
      console.error(`Player with client ID ${playerId} not found`);
      toast({
        title: "Error",
        description: "Player not found",
        duration: 3000,
      });
      return;
    }

    console.log(`Player object:`, playerToUpdate);
    
    // For mock game or missing game ID, only update locally
    if (!currentGameId || currentGameId === "mock-game-id") {
      console.log(`Using mock game ID, updating player ${playerId} name to ${newName} locally`);
      updateLocalPlayerName(playerId, newName);
      return;
    }

    // Make sure we have the database ID
    if (!playerToUpdate.databaseId) {
      console.error(`Player with client ID ${playerId} has no database ID`);
      toast({
        title: "Error",
        description: "Player has no database ID",
        duration: 3000,
      });
      updateLocalPlayerName(playerId, newName);
      return;
    }

    try {
      // Use the database ID (UUID string) for the database operation
      const databaseId = playerToUpdate.databaseId;
      console.log(`Updating player name in database. Database UUID: ${databaseId}`);
      
      const { error } = await supabase
        .from('players')
        .update({ name: newName })
        .eq('game_id', currentGameId)
        .eq('id', databaseId);

      if (error) {
        console.error('Error updating player name:', error);
        toast({
          title: "Error",
          description: "Failed to update player name",
          duration: 3000,
        });
        return;
      }

      updateLocalPlayerName(playerId, newName);
    } catch (error) {
      console.error('Error updating player name:', error);
      toast({
        title: "Error",
        description: "Failed to update player name",
        duration: 3000,
      });
    }
  };

  const updateLocalPlayerName = (playerId: number, newName: string) => {
    console.log(`Updating local player data. ID: ${playerId}, New name: ${newName}`);
    
    const updatedPlayers = players.map(player => {
      return player.id === playerId 
        ? { ...player, name: newName }
        : player;
    });
    
    console.log("Updated players list:", updatedPlayers);
    setPlayers(updatedPlayers);
    toast({
      title: "Name updated",
      description: "Player name has been changed successfully.",
      duration: 3000,
    });
  };

  return {
    handleNameChange
  };
}
