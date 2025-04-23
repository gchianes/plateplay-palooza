
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
    console.log(`Attempting to update player name. ID: ${playerId}, New name: ${newName}, Game ID: ${currentGameId}`);
    console.log(`Player object:`, players.find(p => {
      // Safely compare player ids regardless of their format
      const id = p.id;
      const numericId = getNumericId(id);
      return numericId === playerId;
    }));
    
    // For mock game or missing game ID, only update locally
    if (!currentGameId || currentGameId === "mock-game-id") {
      console.log(`Using mock game ID, updating player ${playerId} name to ${newName} locally`);
      updateLocalPlayerName(playerId, newName);
      return;
    }

    try {
      // Convert number ID to string for database query
      const playerIdString = playerId.toString();
      console.log(`Updating player name in database. Player ID: ${playerIdString}`);
      
      const { error } = await supabase
        .from('players')
        .update({ name: newName })
        .eq('game_id', currentGameId)
        .eq('id', playerIdString);

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

  // Helper function to safely convert any type of ID to a number
  const getNumericId = (id: any): number => {
    if (typeof id === 'number') {
      return id;
    } else if (id !== null && typeof id === 'object' && typeof id._type === 'string' && id._type === 'Number') {
      return parseInt(id.value) || 0;
    }
    return 0;
  };

  const updateLocalPlayerName = (playerId: number, newName: string) => {
    console.log(`Updating local player data. ID: ${playerId}, New name: ${newName}`);
    
    const updatedPlayers = players.map(player => {
      // Add a console log to debug the comparison
      const id = player.id;
      
      // Safely compare player ids regardless of their format
      const currentId = getNumericId(id);
        
      console.log(`Checking player: ${currentId} against: ${playerId}`);
      
      return currentId === playerId 
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
