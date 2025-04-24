
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
    const currentPlayers = Array.isArray(players) ? players : [];
    
    console.log("handleAddPlayer called with:", { currentGameId, playerCount: currentPlayers.length });
    
    if (currentPlayers.length >= 6) {
      toast({
        title: "Maximum players reached",
        description: "You can only have up to 6 players in a game.",
        duration: 3000,
      });
      return;
    }

    const newPlayerNumber = currentPlayers.length + 1;
    const playerName = `Player ${newPlayerNumber}`;
    
    if (!currentGameId || currentGameId === "mock-game-id") {
      console.log("Creating local player");
      
      const newPlayer = {
        id: newPlayerNumber,
        name: playerName,
        states: [],
        score: 0
      };
      
      const updatedPlayers = [...currentPlayers, newPlayer];
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
      console.log("Creating player in database for game:", currentGameId);
      
      const { data: newPlayer, error } = await supabase
        .from('players')
        .insert({
          game_id: currentGameId,
          name: playerName,
          states: [],
          score: 0,
          player_number: newPlayerNumber
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
        
        const formattedPlayer: Player = {
          id: newPlayer.player_number,
          name: newPlayer.name,
          states: newPlayer.states as string[],
          score: newPlayer.score || 0,
          databaseId: newPlayer.id
        };
        
        const updatedPlayers = [...currentPlayers, formattedPlayer];
        console.log("Updated players array:", updatedPlayers);
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
