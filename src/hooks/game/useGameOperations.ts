
import { toast } from '@/components/ui/use-toast';
import { Player } from '@/types/player';
import { states as stateData } from '@/utils/stateData';
import { supabase } from '@/integrations/supabase/client';

interface UseGameOperationsProps {
  players: Player[];
  setPlayers: (players: Player[]) => void;
  activePlayer: number;
  globalSpottedStates: string[];
  setGlobalSpottedStates: (states: string[]) => void;
  currentGameId: string | null;
}

export const useGameOperations = ({
  players,
  setPlayers,
  activePlayer,
  globalSpottedStates,
  setGlobalSpottedStates,
  currentGameId
}: UseGameOperationsProps) => {
  const calculatePlayerScore = (stateIds: string[], playerName: string): number => {
    const baseScore = stateIds.reduce((total, stateId) => {
      const stateInfo = stateData.find(state => state.id === stateId);
      return total + (stateInfo?.points || 1);
    }, 0);
    
    return playerName.toLowerCase() === 'george' ? baseScore * 1 : baseScore;
  };

  const handleToggleState = async (stateId: string) => {
    const currentPlayer = players.find(p => p.id === activePlayer);
    if (!currentPlayer) return;

    const hasState = currentPlayer.states.includes(stateId);

    if (!hasState && globalSpottedStates.includes(stateId)) {
      toast({
        title: "State already spotted",
        description: "This state has already been spotted by another player.",
        duration: 3000,
      });
      return;
    }

    const newStates = hasState 
      ? currentPlayer.states.filter(id => id !== stateId)
      : [...currentPlayer.states, stateId];

    if (hasState) {
      const otherPlayersWithState = players.some(p => 
        p.id !== activePlayer && p.states.includes(stateId)
      );
      
      if (!otherPlayersWithState) {
        setGlobalSpottedStates(globalSpottedStates.filter(id => id !== stateId));
      }
    } else {
      setGlobalSpottedStates([...globalSpottedStates, stateId]);
    }

    // Update players in state
    const updatedPlayers = players.map(player => {
      if (player.id !== activePlayer) return player;
      
      const updatedStates = newStates;
      const updatedScore = calculatePlayerScore(updatedStates, player.name);
      
      return {
        ...player,
        states: updatedStates,
        score: updatedScore
      };
    });
    
    setPlayers(updatedPlayers);

    // Update in database if we have a valid game ID and player has a database ID
    if (currentGameId && currentGameId !== "mock-game-id") {
      const playerToUpdate = updatedPlayers.find(p => p.id === activePlayer);
      
      if (playerToUpdate && playerToUpdate.databaseId) {
        try {
          // Log database update attempt
          console.log(`Updating player ${playerToUpdate.id} in database with ${newStates.length} states`);
          
          const { error } = await supabase
            .from('players')
            .update({
              states: newStates,
              score: calculatePlayerScore(newStates, playerToUpdate.name)
            })
            .eq('id', playerToUpdate.databaseId);
          
          if (error) {
            console.error('Error updating player states in database:', error);
            toast({
              title: "Database Error",
              description: "Failed to save your changes to the database.",
              duration: 3000,
            });
          } else {
            console.log('Successfully updated player states in database');
          }
        } catch (err) {
          console.error('Exception updating player states:', err);
          toast({
            title: "Error",
            description: "An error occurred while saving to the database.",
            duration: 3000,
          });
        }
      } else {
        console.warn('Cannot update database: Player has no database ID', playerToUpdate);
      }
    } else {
      console.log('Using local storage only (no database update)');
    }
  };

  const handleNewGame = async () => {
    const updatedPlayers = players.map(player => ({
      ...player,
      states: [],
      score: 0
    }));
    
    setPlayers(updatedPlayers);
    setGlobalSpottedStates([]);

    // Update database if we have a valid game ID
    if (currentGameId && currentGameId !== "mock-game-id") {
      try {
        // Update each player in database
        for (const player of updatedPlayers) {
          if (player.databaseId) {
            const { error } = await supabase
              .from('players')
              .update({
                states: [],
                score: 0
              })
              .eq('id', player.databaseId);
            
            if (error) {
              console.error(`Error resetting player ${player.id} in database:`, error);
            }
          }
        }
      } catch (err) {
        console.error('Exception during new game database update:', err);
        toast({
          title: "Database Error",
          description: "Failed to reset game data in the database.",
          duration: 3000,
        });
      }
    }

    toast({
      title: "New Game Started",
      description: "All player states have been reset",
      duration: 3000,
    });
  };

  return {
    handleToggleState,
    handleNewGame
  };
};
