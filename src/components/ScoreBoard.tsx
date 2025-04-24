
import React from 'react';
import { Trophy, Flag } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from "@/components/ui/scroll-area";
import { states } from '@/utils/stateData';

interface ScoreBoardProps {
  spottedStates: number;
  totalStates: number;
  progress: number;
  score: number;
  playerName: string;
}

const ScoreBoard: React.FC<ScoreBoardProps> = ({ 
  spottedStates, 
  totalStates, 
  progress, 
  score,
  playerName
}) => {
  const currentPlayer = players.find(p => p.id === activePlayer);
  const spottedStatesList = currentPlayer?.states || [];
  const spottedStateNames = spottedStatesList
    .map(stateId => states.find(s => s.id === stateId)?.name)
    .filter(name => name) // Remove undefined values
    .sort();

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-6">
      <div className="text-center mb-4">
        <h2 className="text-xl font-bold text-primary">{playerName}</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="flex flex-col items-center justify-center p-2">
          <Trophy className="h-10 w-10 text-accent mb-2" />
          <h2 className="text-2xl font-bold">{score}</h2>
          <p className="text-sm text-muted-foreground">Score</p>
        </div>
        
        <div className="flex flex-col items-center justify-center p-2">
          <Flag className="h-10 w-10 text-secondary mb-2" />
          <h2 className="text-2xl font-bold">{spottedStates} / {totalStates}</h2>
          <p className="text-sm text-muted-foreground">States Spotted</p>
        </div>
        
        <div className="flex flex-col items-center justify-center p-2">
          <div className="w-full mb-2">
            <Progress value={progress} className="h-3" />
          </div>
          <h2 className="text-2xl font-bold">{Math.round(progress)}%</h2>
          <p className="text-sm text-muted-foreground">Progress</p>
        </div>
      </div>

      <div className="mt-4">
        <h3 className="text-sm font-semibold text-muted-foreground mb-2">Spotted States:</h3>
        <ScrollArea className="h-[100px] w-full rounded-md border p-2">
          <div className="grid grid-cols-2 gap-2 pr-4">
            {spottedStateNames.map((stateName) => (
              <div key={stateName} className="text-sm">
                {stateName}
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

export default ScoreBoard;
