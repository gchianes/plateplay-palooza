
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
    // Always ensure players is an array
    const currentPlayers = Array.isArray(players) ? players : [];
    
    if (currentPlayers.length <= 1) {
      toast({
        title: "Cannot remove player",
        description: "You must have at least one player in the game.",
        duration: 3000,
      });
      return;
    }

    // Handle mock game ID or missing game ID with local player removal
    if (!currentGameId || currentGameId === "mock-game-id") {
      console.log("Using mock game ID, removing player locally");
      
      const playerToRemove = currentPlayers.find(p => p.id === playerId);
      if (playerToRemove) {
        const updatedStates = globalSpottedStates.filter(
          stateId => !playerToRemove.states.includes(stateId)
        );
        setGlobalSpottedStates(updatedStates);
      }
      
      const updatedPlayers = currentPlayers.filter(p => p.id !== playerId);
      setPlayers(updatedPlayers);
      
      if (activePlayer === playerId && updatedPlayers.length > 0) {
        setActivePlayer(updatedPlayers[0].id);
      }
      
      toast({
        title: "Player removed",
        description: "Player has been removed from the game.",
        duration: 3000,
      });
      
      return;
    }

    try {
      // Find the player in the current players array
      const playerToRemove = currentPlayers.find(p => p.id === playerId);
      if (!playerToRemove) {
        console.error('Player not found:', playerId);
        toast({
          title: "Error",
          description: "Player not found",
          duration: 3000,
        });
        return;
      }
      
      console.log("Removing player:", playerId);
      
      // In Supabase, we need the database ID which is stored in playerToRemove.databaseId
      if (!playerToRemove.databaseId) {
        console.error('Player has no database ID:', playerId);
        toast({
          title: "Error",
          description: "Player has no database ID",
          duration: 3000,
        });
        return;
      }

      const { error } = await supabase
        .from('players')
        .delete()
        .eq('game_id', currentGameId)
        .eq('id', playerToRemove.databaseId);

      if (error) {
        console.error('Error removing player:', error);
        toast({
          title: "Error",
          description: "Failed to remove player: " + error.message,
          duration: 3000,
        });
        return;
      }

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
