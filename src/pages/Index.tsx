
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Header';
import { useGameState } from '@/hooks/game/useGameState';
import { PlayerManagement } from '@/components/PlayerManagement';
import { GameState } from '@/components/GameState';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from '@/components/ui/use-toast';

const Index = () => {
  const [isMapVisible, setIsMapVisible] = useState(false); // Changed to false to hide the map
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const {
    players,
    setPlayers,
    activePlayer,
    setActivePlayer,
    globalSpottedStates,
    setGlobalSpottedStates,
    currentGameId,
    isLoading
  } = useGameState(user);

  // Redirect to login if no user
  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-gray-100">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="space-y-4">
            <Skeleton className="h-[200px] w-full rounded-lg" />
            <Skeleton className="h-[400px] w-full rounded-lg" />
          </div>
        </main>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-gray-100">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <>
          <PlayerManagement 
            players={players || []}
            setPlayers={setPlayers}
            activePlayer={activePlayer}
            setActivePlayer={setActivePlayer}
            currentGameId={currentGameId}
            globalSpottedStates={globalSpottedStates}
            setGlobalSpottedStates={setGlobalSpottedStates}
          />

          <GameState 
            players={players || []}
            setPlayers={setPlayers}
            activePlayer={activePlayer}
            globalSpottedStates={globalSpottedStates}
            setGlobalSpottedStates={setGlobalSpottedStates}
            currentGameId={currentGameId}
            isMapVisible={isMapVisible}
          />
        </>
      </main>
    </div>
  );
};

export default Index;
