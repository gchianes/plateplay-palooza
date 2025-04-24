import React, { useEffect } from 'react';
import { Player } from '@/types/player';
import { usePlayerOperations } from '@/hooks/game/operations/usePlayerOperations';
import { states } from '@/utils/stateData';
import ScoreBoard from './ScoreBoard';
import USAMap from './USAMap';
import LicensePlateList from './LicensePlateList';
import { toast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

interface GameStateProps {
  players: Player[];
  setPlayers: (players: Player[]) => void;
  activePlayer: number;
  globalSpottedStates: string[];
  setGlobalSpottedStates: (states: string[]) => void;
  currentGameId: string | null;
  isMapVisible: boolean;
}

export function GameState({
  players,
  setPlayers,
  activePlayer,
  globalSpottedStates,
  setGlobalSpottedStates,
  currentGameId,
  isMapVisible
}: GameStateProps) {
  const { updatePlayerStates } = usePlayerOperations();

  useEffect(() => {
    const allSpottedStates = players.reduce((acc: string[], player) => {
      player.states.forEach(state => {
        if (!acc.includes(state)) {
          acc.push(state);
        }
      });
      return acc;
    }, []);
    
    console.log("Setting global spotted states from players:", allSpottedStates);
    setGlobalSpottedStates(allSpottedStates);
  }, [players, setGlobalSpottedStates]);

  const handleToggleState = async (stateId: string) => {
    const currentPlayer = players.find(p => p.id === activePlayer);
    if (!currentPlayer) return;

    const hasState = currentPlayer.states.includes(stateId);

    if (!hasState && globalSpottedStates.includes(stateId)) {
      toast({
        title: "State already spotted",
        description: "This state has already been spotted by another player.",
        duration: 3000,
      });
      return;
    }

    const newStates = hasState 
      ? currentPlayer.states.filter(id => id !== stateId)
      : [...currentPlayer.states, stateId];
    
    if (currentGameId && currentGameId !== "mock-game-id") {
      const success = await updatePlayerStates(currentPlayer, newStates);
      if (!success) {
        toast({
          title: "Error",
          description: "Failed to update state in database",
          duration: 3000,
        });
        return;
      }
    }

    if (hasState) {
      const otherPlayersWithState = players.some(p => 
        p.id !== activePlayer && p.states.includes(stateId)
      );
      
      if (!otherPlayersWithState) {
        setGlobalSpottedStates(globalSpottedStates.filter(id => id !== stateId));
      }

      toast({
        title: "State removed",
        description: `${states.find(s => s.id === stateId)?.name} removed from ${currentPlayer.name}'s collection`,
        duration: 3000,
      });
    } else {
      setGlobalSpottedStates([...globalSpottedStates, stateId]);
      toast({
        title: "License plate spotted!",
        description: `${currentPlayer.name} spotted ${states.find(s => s.id === stateId)?.name}`,
        duration: 3000,
      });
    }

    setPlayers(players.map(player => {
      if (player.id !== activePlayer) return player;
      return {
        ...player,
        states: newStates,
        score: newStates.length
      };
    }));
  };

  const handleNewGame = async () => {
    try {
      if (currentGameId && currentGameId !== "mock-game-id") {
        const updatePromises = players.map(player => 
          updatePlayerStates(player, [])
        );
        await Promise.all(updatePromises);
      }

      setPlayers(players.map(player => ({
        ...player,
        states: [],
        score: 0
      })));
      setGlobalSpottedStates([]);

      toast({
        title: "New Game Started",
        description: "All player states have been reset",
        duration: 3000,
      });
    } catch (error) {
      console.error('Error starting new game:', error);
      toast({
        title: "Error",
        description: "Failed to start new game",
        duration: 3000,
      });
    }
  };

  const currentPlayer = players.find(p => p.id === activePlayer) || players[0];
  const spottedStates = currentPlayer?.states || [];
  const score = currentPlayer?.score || 0;
  const progress = (spottedStates.length / states.length) * 100;

  const sortedStates = states.map(state => ({
    ...state,
    spotted: globalSpottedStates.includes(state.id)
  })).sort((a, b) => {
    if (a.spotted && !b.spotted) return -1;
    if (!a.spotted && b.spotted) return 1;
    return a.name.localeCompare(b.name);
  });

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <ScoreBoard 
          spottedStates={spottedStates} 
          totalStates={states.length} 
          progress={progress} 
          score={score}
          playerName={currentPlayer?.name || ""}
          currentPlayer={currentPlayer}
        />
        <Button 
          variant="outline" 
          onClick={handleNewGame}
          className="ml-4"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Start New Game
        </Button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-10">
        {isMapVisible && (
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-5">United States Map</h2>
                <USAMap 
                  spottedStates={globalSpottedStates}
                  onStateClick={handleToggleState}
                />
              </div>
            </div>
          </div>
        )}
        
        <div className="lg:col-span-1">
          <LicensePlateList 
            states={sortedStates} 
            onToggleState={handleToggleState} 
          />
        </div>
      </div>
    </>
  );
}
