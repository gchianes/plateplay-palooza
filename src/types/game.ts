
import { Player } from './player';

export interface GameState {
  players: Player[];
  activePlayer: number;
  globalSpottedStates: string[];
  currentGameId: string | null;
  isLoading: boolean;
}

export interface GameStateActions {
  setPlayers: (players: Player[]) => void;
  setActivePlayer: (playerId: number) => void;
  setGlobalSpottedStates: (states: string[]) => void;
}

export type UseGameStateReturn = GameState & GameStateActions;
