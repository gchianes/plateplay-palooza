
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Header';
import { useGameState } from '@/hooks/useGameState';
import { PlayerManagement } from '@/components/PlayerManagement';
import { GameState } from '@/components/GameState';

const Index = () => {
  const [isMapVisible, setIsMapVisible] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const {
    players,
    setPlayers,
    activePlayer,
    setActivePlayer,
    globalSpottedStates,
    setGlobalSpottedStates,
    currentGameId
  } = useGameState(user);

  if (!user) {
    navigate('/login');
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-gray-100">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <PlayerManagement 
          players={players}
          setPlayers={setPlayers}
          activePlayer={activePlayer}
          setActivePlayer={setActivePlayer}
          currentGameId={currentGameId}
          setGlobalSpottedStates={setGlobalSpottedStates}
        />

        <GameState 
          players={players}
          setPlayers={setPlayers}
          activePlayer={activePlayer}
          globalSpottedStates={globalSpottedStates}
          setGlobalSpottedStates={setGlobalSpottedStates}
          currentGameId={currentGameId}
          isMapVisible={isMapVisible}
        />
      </main>
    </div>
  );
};

export default Index;
