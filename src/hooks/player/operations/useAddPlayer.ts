
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

    const playerName = `Player ${currentPlayers.length + 1}`;
    
    // For mock game ID or missing game ID, create a local player
    if (!currentGameId || currentGameId === "mock-game-id") {
      console.log("Creating local player");
      
      // Find the highest ID in the current players to avoid duplicate IDs
      const highestId = currentPlayers.reduce((max, player) => 
        player.id > max ? player.id : max, 0);
      
      const newPlayerId = highestId + 1;
      const newPlayer = {
        id: newPlayerId,
        name: playerName,
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
      return;
    }
    
    // If we have a valid game ID, create a player in the database
    try {
      console.log("Creating player in database for game:", currentGameId);
      
      const { data: newPlayer, error } = await supabase
        .from('players')
        .insert({
          game_id: currentGameId,
          name: playerName,
          states: [],
          score: 0
        })
        .select()
        .single();
      
      if (error) {
        console.error("Error creating player:", error);
        toast({
          title: "Error",
          description: "Failed to create new player in database.",
          duration: 3000,
        });
        return;
      }
      
      if (newPlayer) {
        console.log("New player created in database:", newPlayer);
        
        // Format the player to match our Player type
        const formattedPlayer: Player = {
          id: currentPlayers.length + 1, // Client-side numeric ID
          name: newPlayer.name,
          states: newPlayer.states as string[],
          score: newPlayer.score || 0,
          databaseId: newPlayer.id.toString() // Ensure database ID is stored as string
        };
        
        // Update the players state
        const updatedPlayers = [...currentPlayers, formattedPlayer];
        console.log("Updated players array:", updatedPlayers);
        setPlayers(updatedPlayers);
        
        // If this is the first player, set them as active
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
      console.error("Error adding player:", error);
      toast({
        title: "Error",
        description: "Failed to add player. Please try again.",
        duration: 3000,
      });
    }
  };

  return {
    handleAddPlayer
  };
}
