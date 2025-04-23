
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
    // Handle mock game ID or missing game ID with local name change
    if (!currentGameId || currentGameId === "mock-game-id") {
      console.log(`Using mock game ID, updating player ${playerId} name to ${newName} locally`);
      
      // Update the local state with the new player name
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
      
      return;
    }

    try {
      console.log(`Updating player ${playerId} name to ${newName} for game ${currentGameId}`);
      const { error } = await supabase
        .from('players')
        .update({ name: newName })
        .eq('game_id', currentGameId)
        .eq('id', playerId.toString()); // Convert number to string here

      if (error) {
        console.error('Error updating player name:', error);
        toast({
          title: "Error",
          description: "Failed to update player name",
          duration: 3000,
        });
        return;
      }

      // Update local state with the new player name
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

  return {
    handleNameChange
  };
}
