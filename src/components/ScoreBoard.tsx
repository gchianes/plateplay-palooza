
import React from 'react';
import { Trophy, Flag } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { states } from '@/utils/stateData';
import { Player } from '@/types/player';

interface ScoreBoardProps {
  spottedStates: string[];
  totalStates: number;
  progress: number;
  score: number;
  playerName: string;
  currentPlayer: Player;
}

const ScoreBoard: React.FC<ScoreBoardProps> = ({ 
  spottedStates, 
  totalStates, 
  progress, 
  score,
  playerName,
  currentPlayer
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 w-full">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <div className="flex flex-col items-center justify-center p-2">
          <Trophy className="h-8 w-8 sm:h-10 sm:w-10 text-accent mb-2" />
          <h2 className="text-xl sm:text-2xl font-bold">{score}</h2>
          <p className="text-xs sm:text-sm text-muted-foreground">Score</p>
        </div>
        
        <div className="flex flex-col items-center justify-center p-2">
          <Flag className="h-8 w-8 sm:h-10 sm:w-10 text-secondary mb-2" />
          <h2 className="text-xl sm:text-2xl font-bold">
            {spottedStates.length} / {totalStates}
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground">States/Provinces</p>
        </div>
        
        <div className="flex flex-col items-center justify-center p-2 col-span-2 sm:col-span-1">
          <div className="w-full mb-2">
            <Progress value={progress} className="h-2 sm:h-3" />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold">{Math.round(progress)}%</h2>
          <p className="text-xs sm:text-sm text-muted-foreground">Progress</p>
        </div>
      </div>
    </div>
  );
};

export default ScoreBoard;
