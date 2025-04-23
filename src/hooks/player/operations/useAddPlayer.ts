
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { Player } from '@/types/player';

interface UseAddPlayerProps {
  currentGameId: string | null;
  players: Player[];
  setPlayers: (players: Player[]) => void;
  setActivePlayer: (id: number) => void;
  globalSpottedStates: string[];
}

export function useAddPlayer({
  currentGameId,
  players,
  setPlayers,
  setActivePlayer
}: UseAddPlayerProps) {
  const handleAddPlayer = async () => {
    // Always ensure players is an array
    const currentPlayers = Array.isArray(players) ? players : [];
    
    console.log("handleAddPlayer called with:", { currentGameId, playerCount: currentPlayers.length });
    
    // Check for maximum players
    if (currentPlayers.length >= 6) {
      toast({
        title: "Maximum players reached",
        description: "You can only have up to 6 players in a game.",
        duration: 3000,
      });
      return;
    }

    // For testing, always create a local player
    console.log("Creating local player");
      
    // Find the highest ID in the current players to avoid duplicate IDs
    const highestId = currentPlayers.reduce((max, player) => 
      player.id > max ? player.id : max, 0);
    
    const newPlayerId = highestId + 1;
    const newPlayer = {
      id: newPlayerId,
      name: `Player ${currentPlayers.length + 1}`,
      states: [],
      score: 0
    };
    
    const updatedPlayers = [...currentPlayers, newPlayer];
    console.log("New player created locally:", newPlayer);
    console.log("Updated players array:", updatedPlayers);
    
    // Update the players state
    setPlayers(updatedPlayers);
    
    // If this is the first player, set them as active
    if (currentPlayers.length === 0) {
      setActivePlayer(newPlayer.id);
    }
    
    toast({
      title: "Player added",
      description: `${newPlayer.name} has been added to the game.`,
      duration: 3000,
    });
  };

  return {
    handleAddPlayer
  };
}
