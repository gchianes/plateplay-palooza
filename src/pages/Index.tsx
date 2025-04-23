import React, { useState } from 'react';
import Header from '@/components/Header';
import ScoreBoard from '@/components/ScoreBoard';
import USAMap from '@/components/USAMap';
import LicensePlateList from '@/components/LicensePlateList';
import PlayerScores from '@/components/PlayerScores';
import { states } from '@/utils/stateData';
import { toast } from '@/components/ui/use-toast';
import { Player } from '@/types/player';

const Index = () => {
  const [isMapVisible, setIsMapVisible] = useState(false);
  const [players, setPlayers] = useState<Player[]>([
    { id: 1, name: "Player 1", states: [], score: 0 }
  ]);
  const [activePlayer, setActivePlayer] = useState(1);
  const [globalSpottedStates, setGlobalSpottedStates] = useState<string[]>([]);
  
  const currentPlayer = players.find(p => p.id === activePlayer) || players[0];
  const spottedStates = currentPlayer.states;
  const score = currentPlayer.score;
  const progress = (spottedStates.length / states.length) * 100;

  const handleNameChange = (playerId: number, newName: string) => {
    setPlayers(players.map(player => 
      player.id === playerId 
        ? { ...player, name: newName }
        : player
    ));
    toast({
      title: "Name updated",
      description: "Player name has been changed successfully.",
      duration: 3000,
    });
  };

  const sortedStates = states.map(state => ({
    ...state,
    spotted: globalSpottedStates.includes(state.id)
  })).sort((a, b) => {
    if (a.spotted && !b.spotted) return -1;
    if (!a.spotted && b.spotted) return 1;
    return a.name.localeCompare(b.name);
  });

  const handleAddPlayer = () => {
    if (players.length >= 6) {
      toast({
        title: "Maximum players reached",
        description: "You can only have up to 6 players in a game.",
        duration: 3000,
      });
      return;
    }

    const newPlayerId = Math.max(...players.map(p => p.id)) + 1;
    setPlayers([...players, {
      id: newPlayerId,
      name: `Player ${newPlayerId}`,
      states: [],
      score: 0
    }]);
  };

  const handleRemovePlayer = (playerId: number) => {
    if (players.length <= 1) return;
    
    const playerToRemove = players.find(p => p.id === playerId);
    if (playerToRemove) {
      setGlobalSpottedStates(prev => 
        prev.filter(stateId => !playerToRemove.states.includes(stateId))
      );
    }
    
    setPlayers(players.filter(p => p.id !== playerId));
    if (activePlayer === playerId) {
      setActivePlayer(players[0].id);
    }
  };

  const handleToggleState = (stateId: string) => {
    if (globalSpottedStates.includes(stateId)) {
      toast({
        title: "State already spotted",
        description: "This state has already been spotted by another player.",
        duration: 3000,
      });
      return;
    }

    setPlayers(players.map(player => {
      if (player.id !== activePlayer) return player;

      const hasState = player.states.includes(stateId);
      const newStates = hasState 
        ? player.states.filter(id => id !== stateId)
        : [...player.states, stateId];
      
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

      return {
        ...player,
        states: newStates,
        score: newStates.length
      };
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-gray-100">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <PlayerScores 
          players={players}
          activePlayer={activePlayer}
          onPlayerAdd={handleAddPlayer}
          onPlayerRemove={handleRemovePlayer}
          onPlayerSelect={setActivePlayer}
          onPlayerNameChange={handleNameChange}
        />

        <ScoreBoard 
          spottedStates={spottedStates.length} 
          totalStates={states.length} 
          progress={progress} 
          score={score}
          playerName={currentPlayer.name}
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
      </main>
    </div>
  );
};

export default Index;
