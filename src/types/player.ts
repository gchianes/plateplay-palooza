
export interface Player {
  id: number; // Client-side numeric ID
  name: string;
  states: string[];
  score: number;
  databaseId?: string; // Supabase UUID for database operations
}
