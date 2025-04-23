
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
    
    // Check for maximum players
    if (currentPlayers.length >= 6) {
      toast({
        title: "Maximum players reached",
        description: "You can only have up to 6 players in a game.",
        duration: 3000,
      });
      return;
    }

    // Handle mock game ID or missing game ID with local player creation
    if (!currentGameId || currentGameId === "mock-game-id") {
      console.log("Using mock game ID or no currentGameId, creating local player");
      
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
      setPlayers(updatedPlayers);
      
      if (currentPlayers.length === 0) {
        setActivePlayer(newPlayer.id);
      }
      
      toast({
        title: "Player added",
        description: `${newPlayer.name} has been added to the game.`,
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

  return {
    handleAddPlayer
  };
}
