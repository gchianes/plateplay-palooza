
export interface Player {
  id: number; // Changed from possibly null to required number
  name: string;
  states: string[];
  score: number;
}
