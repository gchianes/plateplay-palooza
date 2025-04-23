
import { usePlayerNameOperations } from './operations/usePlayerNameOperations';
import { useAddPlayer } from './operations/useAddPlayer';
import { useRemovePlayer } from './operations/useRemovePlayer';
import { Player } from '@/types/player';

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

  return {
    handleNameChange,
    handleAddPlayer,
    handleRemovePlayer,
  };
}
