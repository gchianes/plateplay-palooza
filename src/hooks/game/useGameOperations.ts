
import { toast } from '@/components/ui/use-toast';
import { Player } from '@/types/player';
import { states as stateData } from '@/utils/stateData';

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
  // Calculate score properly based on state point values
  const calculatePlayerScore = (stateIds: string[]): number => {
    return stateIds.reduce((total, stateId) => {
      const stateInfo = stateData.find(state => state.id === stateId);
      return total + (stateInfo?.points || 1); // Default to 1 point if not found
    }, 0);
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

    // Update the player with correct score calculation
    setPlayers(players.map(player => {
      if (player.id !== activePlayer) return player;
      
      const updatedStates = newStates;
      const updatedScore = calculatePlayerScore(updatedStates);
      
      return {
        ...player,
        states: updatedStates,
        score: updatedScore
      };
    }));
  };

  const handleNewGame = async () => {
    // Reset all players with zero scores
    setPlayers(players.map(player => ({
      ...player,
      states: [],
      score: 0
    })));
    setGlobalSpottedStates([]);

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
