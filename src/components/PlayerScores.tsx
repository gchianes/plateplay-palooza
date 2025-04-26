import React, { useState } from 'react';
import { Player } from '@/types/player';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Trophy, UserPlus, X, Pen, ChevronDown, ChevronUp } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { states } from '@/utils/stateData';

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
  const [expandedPlayers, setExpandedPlayers] = useState<number[]>([]);

  const handleEditStart = (player: Player) => {
    let playerId = getNumericId(player.id);
    setEditingId(playerId);
    setEditName(player.name);
  };

  const getNumericId = (id: any): number => {
    if (typeof id === 'number') {
      return id;
    } else if (typeof id === 'object' && id !== null && typeof id._type === 'string' && id._type === 'Number') {
      return parseInt(id.value) || 0;
    }
    return 0;
  };

  const handleEditSave = () => {
    if (editingId !== null && editName.trim()) {
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
    onPlayerAdd();
  };

  const togglePlayerExpansion = (playerId: number) => {
    setExpandedPlayers(current => 
      current.includes(playerId)
        ? current.filter(id => id !== playerId)
        : [...current, playerId]
    );
  };

  const getSpottedStateNames = (stateIds: string[]) => {
    return stateIds
      .map(stateId => {
        const stateData = states.find(s => s.id === stateId);
        return stateData?.name || '';
      })
      .filter(name => name)
      .sort((a, b) => a.localeCompare(b));
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

      <div className="space-y-4">
        {players.map((player) => {
          const playerId = getNumericId(player.id);
          const isExpanded = expandedPlayers.includes(playerId);
          const spottedStates = getSpottedStateNames(player.states);
          
          return (
            <div
              key={playerId}
              className={cn(
                "flex flex-col p-3 rounded-lg border",
                activePlayer === playerId ? "bg-secondary/20 border-secondary" : "bg-background"
              )}
            >
              <div className="flex items-center justify-between">
                <button
                  className="flex items-center space-x-3 flex-1"
                  onClick={() => {
                    onPlayerSelect(playerId);
                    togglePlayerExpansion(playerId);
                  }}
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
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{player.name}</span>
                          {isExpanded ? (
                            <ChevronUp className="h-4 w-4 text-muted-foreground" />
                          ) : (
                            <ChevronDown className="h-4 w-4 text-muted-foreground" />
                          )}
                        </div>
                        <span className="text-sm text-muted-foreground">
                          States/Provinces: {player.states.length} | Score: {player.score}
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

              {isExpanded && (
                <div className="mt-3 pl-7">
                  <h4 className="text-sm font-semibold text-muted-foreground mb-2">
                    Spotted States/Provinces:
                  </h4>
                  <ScrollArea className="max-h-[200px] w-full rounded-md border p-2">
                    <div className="space-y-1">
                      {spottedStates.map((name) => (
                        <div key={name} className="text-xs sm:text-sm">
                          {name}
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PlayerScores;
