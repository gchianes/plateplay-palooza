
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
    if (!currentGameId || currentGameId === "mock-game-id") {
      console.log(`Using mock game ID, updating player ${playerId} name to ${newName} locally`);
      updateLocalPlayerName(playerId, newName);
      return;
    }

    try {
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
    const updatedPlayers = players.map(player => 
      player.id === playerId 
        ? { ...player, name: newName }
        : player
    );
    
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
