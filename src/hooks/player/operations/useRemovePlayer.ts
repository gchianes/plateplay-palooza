
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { Player } from '@/types/player';

interface UseRemovePlayerProps {
  currentGameId: string | null;
  players: Player[];
  setPlayers: (players: Player[]) => void;
  activePlayer: number;
  setActivePlayer: (id: number) => void;
  globalSpottedStates: string[];
  setGlobalSpottedStates: (states: string[]) => void;
}

export function useRemovePlayer({
  currentGameId,
  players,
  setPlayers,
  activePlayer,
  setActivePlayer,
  globalSpottedStates,
  setGlobalSpottedStates
}: UseRemovePlayerProps) {
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
    handleRemovePlayer
  };
}
