
import { toast } from '@/components/ui/use-toast';
import { Player } from '@/types/player';

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

    setPlayers(players.map(player => {
      if (player.id !== activePlayer) return player;
      return {
        ...player,
        states: newStates,
        score: newStates.length
      };
    }));
  };

  const handleNewGame = async () => {
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

