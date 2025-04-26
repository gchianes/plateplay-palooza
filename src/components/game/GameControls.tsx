
import React from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

interface GameControlsProps {
  onNewGame: () => void;
}

const GameControls: React.FC<GameControlsProps> = ({ onNewGame }) => {
  return (
    <Button 
      variant="outline" 
      onClick={onNewGame}
      className="w-full sm:w-auto"
    >
      <RefreshCw className="h-4 w-4 mr-2" />
      Start New Game
    </Button>
  );
};

export default GameControls;
