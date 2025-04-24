
import { usePlayerNameOperations } from './operations/usePlayerNameOperations';
import { useAddPlayer } from './operations/useAddPlayer';
import { useRemovePlayer } from './operations/useRemovePlayer';
import { Player } from '@/types/player';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

interface UsePlayerOperationsProps {
  currentGameId: string | null;
  players: Player[];
  setPlayers: (players: Player[]) => void;
  activePlayer: number;
  setActivePlayer: (id: number) => void;
  globalSpottedStates: string[];
  setGlobalSpottedStates: (states: string[]) => void;
}

export function usePlayerOperations(props: UsePlayerOperationsProps) {
  const { handleNameChange } = usePlayerNameOperations(props);
  const { handleAddPlayer } = useAddPlayer(props);
  const { handleRemovePlayer } = useRemovePlayer(props);

  const updatePlayerStates = async (playerId: number, states: string[]) => {
    if (props.currentGameId && props.currentGameId !== "mock-game-id") {
      try {
        // Find the player to get its database ID
        const playerToUpdate = props.players.find(p => p.id === playerId);
        if (!playerToUpdate || !playerToUpdate.databaseId) {
          console.error('Player not found or missing database ID:', playerId);
          throw new Error("Cannot update player states: Player not found or missing database ID");
        }

        console.log(`Updating states for player with client ID ${playerId} and database ID ${playerToUpdate.databaseId}`);

        const { error } = await supabase
          .from('players')
          .update({ states })
          .eq('game_id', props.currentGameId)
          .eq('id', playerToUpdate.databaseId);

        if (error) {
          console.error('Error updating player states:', error);
          throw error;
        }
      } catch (error) {
        console.error('Error updating player states:', error);
        toast({
          title: "Error",
          description: "Failed to update player states, but changes are saved locally.",
          duration: 3000,
        });
      }
    }
  };

  return {
    handleNameChange,
    handleAddPlayer,
    handleRemovePlayer,
    updatePlayerStates,
  };
}
