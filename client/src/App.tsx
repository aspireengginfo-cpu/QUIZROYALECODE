import React, { useState, useEffect } from 'react';
import {
  socket,
  getOrCreateSessionPlayerId,
  getSavedNickname,
  saveNickname,
  getSavedAvatar,
  saveAvatar,
} from './utils/socket';
import { Player, RoomState, ClientQuestion } from './types';
import { Header } from './components/Header';
import { HowToPlayModal } from './components/HowToPlayModal';
import { HomeScreen } from './components/HomeScreen';
import { LobbyScreen } from './components/LobbyScreen';
import { CountdownOverlay } from './components/CountdownOverlay';
import { QuizScreen } from './components/QuizScreen';
import { RevealScreen } from './components/RevealScreen';
import { LeaderboardScreen } from './components/LeaderboardScreen';
import { PodiumScreen } from './components/PodiumScreen';
import { ConnectionBanner } from './components/ConnectionBanner';

export const App: React.FC = () => {
  const [isConnected, setIsConnected] = useState<boolean>(socket.connected);
  const [room, setRoom] = useState<RoomState | null>(null);
  const [currentPlayer, setCurrentPlayer] = useState<Player | null>(null);
  const [isRulesOpen, setIsRulesOpen] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Round states
  const [selectedOptionIndex, setSelectedOptionIndex] = useState<number | undefined>(undefined);
  const [hasLockedAnswer, setHasLockedAnswer] = useState<boolean>(false);

  // Setup Socket Listeners
  useEffect(() => {
    function onConnect() {
      setIsConnected(true);
      setErrorMessage('');
      console.log('Connected to Quiz Royale Server!');
    }

    function onDisconnect() {
      setIsConnected(false);
      console.log('Disconnected from Quiz Royale Server.');
    }

    function onRoomJoined(payload: { room: RoomState; player: Player }) {
      setIsLoading(false);
      setErrorMessage('');
      setRoom(payload.room);
      setCurrentPlayer(payload.player);
      saveNickname(payload.player.nickname);
      saveAvatar(payload.player.avatar);
    }

    function onRoomState(updatedRoom: RoomState) {
      setRoom(updatedRoom);
      // Update our player instance
      const sessionPlayerId = getOrCreateSessionPlayerId();
      const me = updatedRoom.players.find(
        (p) => p.id === sessionPlayerId || p.socketId === socket.id
      );
      if (me) {
        setCurrentPlayer(me);
      }
    }

    function onQuestionStart(question: ClientQuestion) {
      setSelectedOptionIndex(undefined);
      setHasLockedAnswer(false);
    }

    function onAnswerAcknowledged(payload: { questionId: string; selectedOptionIndex: number }) {
      setSelectedOptionIndex(payload.selectedOptionIndex);
      setHasLockedAnswer(true);
    }

    function onRoomKicked(payload: { message?: string }) {
      alert(payload.message || 'You were removed from the room.');
      setRoom(null);
      setCurrentPlayer(null);
    }

    function onError(payload: { message: string }) {
      setIsLoading(false);
      setErrorMessage(payload.message);
      setTimeout(() => setErrorMessage(''), 5000);
    }

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('room:joined', onRoomJoined);
    socket.on('room:state', onRoomState);
    socket.on('game:question_start', onQuestionStart);
    socket.on('game:answer_acknowledged', onAnswerAcknowledged);
    socket.on('room:kicked', onRoomKicked);
    socket.on('error', onError);

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('room:joined', onRoomJoined);
      socket.off('room:state', onRoomState);
      socket.off('game:question_start', onQuestionStart);
      socket.off('game:answer_acknowledged', onAnswerAcknowledged);
      socket.off('room:kicked', onRoomKicked);
      socket.off('error', onError);
    };
  }, []);

  // Handlers
  const handleCreateRoom = (nickname: string, avatar: string) => {
    setIsLoading(true);
    setErrorMessage('');
    const sessionPlayerId = getOrCreateSessionPlayerId();
    socket.emit('room:create', { nickname, avatar, sessionPlayerId });
  };

  const handleJoinRoom = (roomCode: string, nickname: string, avatar: string) => {
    setIsLoading(true);
    setErrorMessage('');
    const sessionPlayerId = getOrCreateSessionPlayerId();
    socket.emit('room:join', { roomCode, nickname, avatar, sessionPlayerId });
  };

  const handleLeaveRoom = () => {
    socket.emit('room:leave');
    setRoom(null);
    setCurrentPlayer(null);
    setSelectedOptionIndex(undefined);
    setHasLockedAnswer(false);
  };

  const handleStartGame = () => {
    if (!room) return;
    socket.emit('game:start', { roomCode: room.roomCode });
  };

  const handleUpdateQuestionsCount = (totalQuestions: number) => {
    if (!room) return;
    socket.emit('room:update_settings', { roomCode: room.roomCode, totalQuestions });
  };

  const handleKickPlayer = (playerIdToKick: string) => {
    if (!room) return;
    socket.emit('room:kick_player', { roomCode: room.roomCode, playerIdToKick });
  };

  const handleSubmitAnswer = (index: number) => {
    if (!room || !room.currentQuestion || hasLockedAnswer) return;
    setSelectedOptionIndex(index);
    setHasLockedAnswer(true);

    socket.emit('game:submit_answer', {
      roomCode: room.roomCode,
      questionId: room.currentQuestion.questionId,
      selectedOptionIndex: index,
    });
  };

  const handleRematch = () => {
    if (!room) return;
    socket.emit('game:rematch', { roomCode: room.roomCode });
  };

  const isHost = Boolean(
    currentPlayer && (currentPlayer.isHost || (room && room.hostId === currentPlayer.id))
  );

  return (
    <div className="min-h-screen flex flex-col justify-between selection:bg-cyan-400 selection:text-black">
      {/* Reconnecting Alert */}
      <ConnectionBanner isConnected={isConnected} />

      {/* Main Header */}
      <Header
        roomCode={room?.roomCode}
        isConnected={isConnected}
        onOpenRules={() => setIsRulesOpen(true)}
        onLeaveRoom={room ? handleLeaveRoom : undefined}
      />

      {/* Main Screen Body based on Room Status Machine */}
      <main className="flex-1 flex flex-col justify-center">
        {!room ? (
          <HomeScreen
            initialNickname={getSavedNickname()}
            initialAvatar={getSavedAvatar()}
            onCreateRoom={handleCreateRoom}
            onJoinRoom={handleJoinRoom}
            isLoading={isLoading}
            errorMessage={errorMessage}
          />
        ) : room.status === 'LOBBY' ? (
          <LobbyScreen
            room={room}
            currentPlayer={currentPlayer!}
            isHost={isHost}
            onStartGame={handleStartGame}
            onLeaveRoom={handleLeaveRoom}
            onUpdateQuestionsCount={handleUpdateQuestionsCount}
            onKickPlayer={handleKickPlayer}
          />
        ) : room.status === 'COUNTDOWN' ? (
          <CountdownOverlay />
        ) : room.status === 'QUESTION_ACTIVE' && room.currentQuestion ? (
          <QuizScreen
            question={room.currentQuestion}
            room={room}
            currentPlayer={currentPlayer!}
            onSubmitAnswer={handleSubmitAnswer}
            selectedOptionIndex={selectedOptionIndex}
            hasLockedAnswer={hasLockedAnswer}
          />
        ) : room.status === 'QUESTION_REVEAL' && room.currentQuestion ? (
          <RevealScreen
            question={room.currentQuestion}
            room={room}
            currentPlayer={currentPlayer!}
          />
        ) : room.status === 'LEADERBOARD' ? (
          <LeaderboardScreen
            room={room}
            currentPlayer={currentPlayer!}
          />
        ) : room.status === 'GAME_OVER' ? (
          <PodiumScreen
            room={room}
            currentPlayer={currentPlayer!}
            isHost={isHost}
            onRematch={handleRematch}
            onReturnHome={handleLeaveRoom}
          />
        ) : null}
      </main>

      {/* Footer */}
      <footer className="w-full py-4 text-center text-xs text-purple-300/50">
        Quiz Royale • Real-Time Multiplayer Trivia Battle • 100% Server Authoritative
      </footer>

      {/* Rules Modal */}
      <HowToPlayModal isOpen={isRulesOpen} onClose={() => setIsRulesOpen(false)} />
    </div>
  );
};

export default App;
