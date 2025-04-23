
import React from 'react';
import { Player } from '@/types/player';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { states } from '@/utils/stateData';
import ScoreBoard from './ScoreBoard';
import USAMap from './USAMap';
import LicensePlateList from './LicensePlateList';

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
  const handleToggleState = async (stateId: string) => {
    if (!currentGameId || globalSpottedStates.includes(stateId)) {
      if (globalSpottedStates.includes(stateId)) {
        toast({
          title: "State already spotted",
          description: "This state has already been spotted by another player.",
          duration: 3000,
        });
      }
      return;
    }

    try {
      const currentPlayer = players.find(p => p.id === activePlayer);
      if (!currentPlayer) return;

      const hasState = currentPlayer.states.includes(stateId);
      const newStates = hasState 
        ? currentPlayer.states.filter(id => id !== stateId)
        : [...currentPlayer.states, stateId];

      await supabase
        .from('players')
        .update({
          states: newStates,
          score: newStates.length
        })
        .eq('game_id', currentGameId)
        .eq('id', activePlayer.toString());

      if (!hasState) {
        setGlobalSpottedStates(prev => [...prev, stateId]);
        toast({
          title: `License plate spotted!`,
          description: `${currentPlayer.name} spotted ${states.find(s => s.id === stateId)?.name}`,
          duration: 3000,
        });
      } else {
        setGlobalSpottedStates(prev => prev.filter(id => id !== stateId));
        toast({
          title: `Removed from spotted list`,
          description: `${states.find(s => s.id === stateId)?.name} removed from ${currentPlayer.name}'s collection`,
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
    } catch (error) {
      console.error('Error toggling state:', error);
      toast({
        title: "Error",
        description: "Failed to update state",
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
      <ScoreBoard 
        spottedStates={spottedStates.length} 
        totalStates={states.length} 
        progress={progress} 
        score={score}
        playerName={currentPlayer?.name || ""}
      />
      
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
