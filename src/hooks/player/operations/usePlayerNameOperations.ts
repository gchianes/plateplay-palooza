
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
    console.log(`Player object:`, players.find(p => p.id === playerId));
    
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

  const updateLocalPlayerName = (playerId: number, newName: string) => {
    console.log(`Updating local player data. ID: ${playerId}, New name: ${newName}`);
    
    const updatedPlayers = players.map(player => {
      // Add a console log to debug the comparison
      console.log(`Checking player: ${typeof player.id === 'number' ? player.id : 'invalid'} against: ${playerId}`);
      
      // Ensure we're comparing numbers
      const currentId = typeof player.id === 'object' && player.id !== null 
        ? (player.id._type === 'Number' ? parseInt(player.id.value) : 0)
        : (typeof player.id === 'number' ? player.id : 0);
        
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
