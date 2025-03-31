
import React from 'react';
import { Trophy, Flag } from 'lucide-react';
import { StateData } from '@/utils/stateData';
import { Progress } from '@/components/ui/progress';

interface ScoreBoardProps {
  spottedStates: StateData[];
  totalStates: number;
  progress: number;
  score: number;
}

const ScoreBoard: React.FC<ScoreBoardProps> = ({ 
  spottedStates, 
  totalStates, 
  progress, 
  score 
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="flex flex-col items-center justify-center p-2">
          <Trophy className="h-10 w-10 text-accent mb-2" />
          <h2 className="text-2xl font-bold">{score}</h2>
          <p className="text-sm text-muted-foreground">Score</p>
        </div>
        
        <div className="flex flex-col items-center justify-center p-2">
          <Flag className="h-10 w-10 text-secondary mb-2" />
          <h2 className="text-2xl font-bold">{spottedStates.length} / {totalStates}</h2>
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
    </div>
  );
};

export default ScoreBoard;
