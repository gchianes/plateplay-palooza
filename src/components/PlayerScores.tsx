
import React, { useState } from 'react';
import { Player } from '@/types/player';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Trophy, UserPlus, X, Pen } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface PlayerScoresProps {
  players: Player[];
  activePlayer: number;
  onPlayerAdd: () => void;
  onPlayerRemove: (id: number) => void;
  onPlayerSelect: (id: number) => void;
  onPlayerNameChange: (id: number, name: string) => void;
  canAddPlayer?: boolean;
}

const PlayerScores: React.FC<PlayerScoresProps> = ({
  players,
  activePlayer,
  onPlayerAdd,
  onPlayerRemove,
  onPlayerSelect,
  onPlayerNameChange,
  canAddPlayer = true,
}) => {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editName, setEditName] = useState("");

  const handleEditStart = (player: Player) => {
    console.log("Starting edit for player:", player);
    
    // Safely handle player.id regardless of its type
    const id = player.id;
    
    // Handle different possible id formats
    let playerId = 0;
    
    if (typeof id === 'number') {
      playerId = id;
    } else if (typeof id === 'object' && id !== null && id._type === 'Number') {
      playerId = parseInt(id.value) || 0;
    }
    
    setEditingId(playerId);
    setEditName(player.name);
  };

  const handleEditSave = () => {
    if (editingId !== null && editName.trim()) {
      console.log(`Saving edit for player ID: ${editingId}, New name: ${editName.trim()}`);
      onPlayerNameChange(editingId, editName.trim());
      setEditingId(null);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleEditSave();
    } else if (e.key === 'Escape') {
      setEditingId(null);
    }
  };

  const handleAddPlayerClick = (e: React.MouseEvent) => {
    e.preventDefault();
    console.log("Add player button clicked in PlayerScores with canAddPlayer:", canAddPlayer);
    onPlayerAdd();
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">Players</h2>
        {players.length < 6 && canAddPlayer && (
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleAddPlayerClick}
          >
            <UserPlus className="h-4 w-4 mr-2" />
            Add Player
          </Button>
        )}
      </div>

      <ScrollArea className="h-[200px]">
        <div className="space-y-2">
          {players.map((player) => {
            // Safely extract player ID regardless of its type
            const id = player.id;
            let playerId = 0;
            
            if (typeof id === 'number') {
              playerId = id;
            } else if (typeof id === 'object' && id !== null && id._type === 'Number') {
              playerId = parseInt(id.value) || 0;
            }
            
            console.log(`Rendering player: ${player.name}, ID: ${playerId}, Type: ${typeof playerId}`);
                  
            return (
              <div
                key={playerId}
                className={cn(
                  "flex items-center justify-between p-3 rounded-lg border",
                  activePlayer === playerId ? "bg-secondary/20 border-secondary" : "bg-background"
                )}
              >
                <button
                  className="flex items-center space-x-3 flex-1"
                  onClick={() => onPlayerSelect(playerId)}
                >
                  <Trophy className="h-4 w-4 text-accent" />
                  <div className="flex flex-col flex-1">
                    {editingId === playerId ? (
                      <Input
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        onKeyDown={handleKeyPress}
                        onBlur={handleEditSave}
                        className="h-7 py-1"
                        autoFocus
                      />
                    ) : (
                      <>
                        <span className="font-medium">
                          {player.name}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          States: {player.states.length} | Score: {player.score}
                        </span>
                      </>
                    )}
                  </div>
                </button>
                <div className="flex items-center gap-2">
                  {editingId !== playerId && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditStart(player)}
                    >
                      <Pen className="h-4 w-4 text-muted-foreground" />
                    </Button>
                  )}
                  {players.length > 1 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onPlayerRemove(playerId)}
                      disabled={!canAddPlayer}
                    >
                      <X className="h-4 w-4 text-muted-foreground" />
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
};

export default PlayerScores;
