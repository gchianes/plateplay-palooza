
import React from 'react';
import { Player } from '@/types/player';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Trophy, UserPlus, X } from 'lucide-react';

interface PlayerScoresProps {
  players: Player[];
  activePlayer: number;
  onPlayerAdd: () => void;
  onPlayerRemove: (id: number) => void;
  onPlayerSelect: (id: number) => void;
}

const PlayerScores: React.FC<PlayerScoresProps> = ({
  players,
  activePlayer,
  onPlayerAdd,
  onPlayerRemove,
  onPlayerSelect,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">Players</h2>
        {players.length < 6 && (
          <Button 
            variant="outline" 
            size="sm"
            onClick={onPlayerAdd}
          >
            <UserPlus className="h-4 w-4 mr-2" />
            Add Player
          </Button>
        )}
      </div>

      <ScrollArea className="h-[200px]">
        <div className="space-y-2">
          {players.map((player) => (
            <div
              key={player.id}
              className={cn(
                "flex items-center justify-between p-3 rounded-lg border",
                activePlayer === player.id ? "bg-secondary/20 border-secondary" : "bg-background"
              )}
            >
              <button
                className="flex items-center space-x-3 flex-1"
                onClick={() => onPlayerSelect(player.id)}
              >
                <Trophy className="h-4 w-4 text-accent" />
                <div className="flex flex-col">
                  <span className="font-medium">
                    {player.name}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    States: {player.states.length} | Score: {player.score}
                  </span>
                </div>
              </button>
              {players.length > 1 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onPlayerRemove(player.id)}
                >
                  <X className="h-4 w-4 text-muted-foreground" />
                </Button>
              )}
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default PlayerScores;
