
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
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
  const [players, setPlayers] = useState<Player[]>([]);
  const [activePlayer, setActivePlayer] = useState<number>(0);
  const [globalSpottedStates, setGlobalSpottedStates] = useState<string[]>([]);
  const [currentGameId, setCurrentGameId] = useState<string | null>(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    loadOrCreateGame();
  }, [user]);

  const loadOrCreateGame = async () => {
    if (!user) return;

    try {
      // Try to load the most recent game
      const { data: games } = await supabase
        .from('games')
        .select('*')
        .order('updated_at', { ascending: false })
        .limit(1);

      if (games && games.length > 0) {
        const gameId = games[0].id;
        setCurrentGameId(gameId);

        // Load players for this game
        const { data: players } = await supabase
          .from('players')
          .select('*')
          .eq('game_id', gameId);

        if (players && players.length > 0) {
          const formattedPlayers = players.map(p => ({
            id: parseInt(p.id),
            name: p.name,
            states: p.states as string[],
            score: p.score
          }));
          setPlayers(formattedPlayers);
          setActivePlayer(formattedPlayers[0].id);
          const allSpottedStates = formattedPlayers.reduce((acc, player) => 
            [...acc, ...player.states], [] as string[]);
          setGlobalSpottedStates([...new Set(allSpottedStates)]);
          return;
        }
      }

      // If no existing game, create a new one
      const { data: newGame } = await supabase
        .from('games')
        .insert({ user_id: user.id })
        .select()
        .single();

      if (newGame) {
        setCurrentGameId(newGame.id);
        const { data: newPlayer } = await supabase
          .from('players')
          .insert({
            game_id: newGame.id,
            name: 'Player 1',
            states: [],
            score: 0
          })
          .select()
          .single();

        if (newPlayer) {
          const formattedPlayer = {
            id: parseInt(newPlayer.id),
            name: newPlayer.name,
            states: newPlayer.states as string[],
            score: newPlayer.score
          };
          setPlayers([formattedPlayer]);
          setActivePlayer(formattedPlayer.id);
        }
      }
    } catch (error) {
      console.error('Error loading/creating game:', error);
      toast({
        title: "Error",
        description: "Failed to load or create game",
        duration: 3000,
      });
    }
  };

  const handleNameChange = async (playerId: number, newName: string) => {
    if (!currentGameId) return;

    try {
      await supabase
        .from('players')
        .update({ name: newName })
        .eq('game_id', currentGameId)
        .eq('id', playerId);

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
    } catch (error) {
      console.error('Error updating player name:', error);
      toast({
        title: "Error",
        description: "Failed to update player name",
        duration: 3000,
      });
    }
  };

  const handleAddPlayer = async () => {
    if (!currentGameId || players.length >= 6) {
      toast({
        title: "Maximum players reached",
        description: "You can only have up to 6 players in a game.",
        duration: 3000,
      });
      return;
    }

    try {
      const { data: newPlayer } = await supabase
        .from('players')
        .insert({
          game_id: currentGameId,
          name: `Player ${players.length + 1}`,
          states: [],
          score: 0
        })
        .select()
        .single();

      if (newPlayer) {
        const formattedPlayer = {
          id: parseInt(newPlayer.id),
          name: newPlayer.name,
          states: newPlayer.states as string[],
          score: newPlayer.score
        };
        setPlayers([...players, formattedPlayer]);
      }
    } catch (error) {
      console.error('Error adding player:', error);
      toast({
        title: "Error",
        description: "Failed to add new player",
        duration: 3000,
      });
    }
  };

  const handleRemovePlayer = async (playerId: number) => {
    if (!currentGameId || players.length <= 1) return;

    try {
      await supabase
        .from('players')
        .delete()
        .eq('game_id', currentGameId)
        .eq('id', playerId);

      const playerToRemove = players.find(p => p.id === playerId);
      if (playerToRemove) {
        setGlobalSpottedStates(prev => 
          prev.filter(stateId => !playerToRemove.states.includes(stateId))
        );
      }
      
      const updatedPlayers = players.filter(p => p.id !== playerId);
      setPlayers(updatedPlayers);
      
      if (activePlayer === playerId) {
        setActivePlayer(updatedPlayers[0].id);
      }
    } catch (error) {
      console.error('Error removing player:', error);
      toast({
        title: "Error",
        description: "Failed to remove player",
        duration: 3000,
      });
    }
  };

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
        .eq('id', activePlayer);
      
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

  if (!user) {
    return null;
  }

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
      </main>
    </div>
  );
};

export default Index;
