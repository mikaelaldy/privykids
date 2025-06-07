import React, { useState, useEffect } from 'react';
import { Shield, Eye, EyeOff, CheckCircle, XCircle, Trophy, ArrowRight, Lock, AlertCircle, Check, X } from 'lucide-react';
import { UserProgress, Game } from '../types';

interface MiniGamesProps {
  userProgress: UserProgress;
  updateProgress: (updates: Partial<UserProgress>) => void;
}

const MiniGames: React.FC<MiniGamesProps> = ({ userProgress, updateProgress }) => {
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [gameScore, setGameScore] = useState(0);
  const [gameCompleted, setGameCompleted] = useState(false);

  const games: Game[] = [
    {
      id: 'password-game',
      title: 'The Password Game',
      description: 'Create a password while following an ever-growing list of rules!',
      component: 'PasswordGame',
      requiredLevel: 1,
      maxPoints: 100
    },
    {
      id: 'share-shield',
      title: 'Share or Shield',
      description: 'Decide what information is safe to share online!',
      component: 'ShareOrShield',
      requiredLevel: 1,
      maxPoints: 80
    }
  ];

  const completeGame = (points: number) => {
    const newCompletedGames = [...userProgress.completedGames, selectedGame!.id];
    const newTotalPoints = userProgress.totalPoints + points;
    
    updateProgress({
      completedGames: newCompletedGames,
      totalPoints: newTotalPoints,
      level: Math.floor(newTotalPoints / 100) + 1
    });

    setGameScore(points);
    setGameCompleted(true);
  };

  const resetGame = () => {
    setSelectedGame(null);
    setGameScore(0);
    setGameCompleted(false);
  };

  if (selectedGame && !gameCompleted) {
    if (selectedGame.component === 'PasswordGame') {
      return <PasswordGame onComplete={completeGame} onBack={resetGame} />;
    } else if (selectedGame.component === 'ShareOrShield') {
      return <ShareOrShield onComplete={completeGame} onBack={resetGame} />;
    }
  }

  if (gameCompleted) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-3xl shadow-xl p-8 text-center">
          <div className="mb-6">
            <Trophy className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Game Complete! 🎮</h2>
            <p className="text-gray-600 text-lg">You earned {gameScore} points!</p>
          </div>
          
          <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-6 mb-6">
            <h3 className="font-bold text-gray-800 mb-2">Great Job!</h3>
            <p className="text-gray-600">
              You completed "{selectedGame!.title}" and learned important safety skills!
            </p>
          </div>

          <button
            onClick={resetGame}
            className="bg-blue-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors"
          >
            Play Another Game
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Safety Simulators 🎮</h2>
        <p className="text-gray-600 text-lg">Learn digital safety through fun, interactive games!</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {games.map((game) => {
          const isUnlocked = userProgress.level >= game.requiredLevel;
          const isCompleted = userProgress.completedGames.includes(game.id);

          return (
            <div
              key={game.id}
              className={`bg-white rounded-2xl shadow-lg p-8 transition-all duration-300 ${
                isUnlocked ? 'hover:shadow-xl hover:scale-105 cursor-pointer' : 'opacity-60'
              }`}
              onClick={() => isUnlocked && setSelectedGame(game)}
            >
              <div className="flex items-center justify-between mb-6">
                <div className={`p-4 rounded-full ${
                  isCompleted ? 'bg-green-100' : isUnlocked ? 'bg-purple-100' : 'bg-gray-100'
                }`}>
                  {isCompleted ? (
                    <Trophy className="h-8 w-8 text-green-600" />
                  ) : isUnlocked ? (
                    <Shield className="h-8 w-8 text-purple-600" />
                  ) : (
                    <Lock className="h-8 w-8 text-gray-400" />
                  )}
                </div>
                {isCompleted && (
                  <span className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-sm font-semibold">
                    Completed! ✓
                  </span>
                )}
              </div>

              <h3 className="text-2xl font-bold text-gray-800 mb-3">{game.title}</h3>
              <p className="text-gray-600 mb-6 text-lg">{game.description}</p>

              <div className="flex items-center justify-between">
                <span className="text-purple-600 font-semibold">
                  Up to {game.maxPoints} points
                </span>
                {!isUnlocked && (
                  <span className="text-gray-400 text-sm">Requires Level {game.requiredLevel}</span>
                )}
                {isUnlocked && (
                  <ArrowRight className="h-6 w-6 text-purple-600" />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// The Password Game Component
const PasswordGame: React.FC<{ onComplete: (points: number) => void; onBack: () => void }> = ({ onComplete, onBack }) => {
  const [password, setPassword] = useState('');
  const [currentRuleIndex, setCurrentRuleIndex] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [timeLeft, setTimeLeft] = useState(120); // 2 minutes to complete
  const [hintsUsed, setHintsUsed] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [currentHint, setCurrentHint] = useState('');

  const rules = [
    {
      id: 1,
      text: "Your password must be at least 5 characters",
      check: (pwd: string) => pwd.length >= 5,
      hint: "Try typing more letters or numbers!"
    },
    {
      id: 2,
      text: "Your password must include a number",
      check: (pwd: string) => /\d/.test(pwd),
      hint: "Add any number like 1, 2, 3..."
    },
    {
      id: 3,
      text: "Your password must include an uppercase letter",
      check: (pwd: string) => /[A-Z]/.test(pwd),
      hint: "Add a capital letter like A, B, C..."
    },
    {
      id: 4,
      text: "Your password must include a special character",
      check: (pwd: string) => /[!@#$%^&*(),.?\":{}|<>]/.test(pwd),
      hint: "Try adding ! or @ or # or $"
    },
    {
      id: 5,
      text: "Your password must be at least 8 characters",
      check: (pwd: string) => pwd.length >= 8,
      hint: "Make your password longer!"
    },
    {
      id: 6,
      text: "Your password must include a lowercase letter",
      check: (pwd: string) => /[a-z]/.test(pwd),
      hint: "Add a small letter like a, b, c..."
    },
    {
      id: 7,
      text: "Your password must not contain the word 'password'",
      check: (pwd: string) => !pwd.toLowerCase().includes('password'),
      hint: "Remove the word 'password' from your password!"
    },
    {
      id: 8,
      text: "Your password must include the current year (2024)",
      check: (pwd: string) => pwd.includes('2024'),
      hint: "Add 2024 somewhere in your password!"
    },
    {
      id: 9,
      text: "Your password must be at least 12 characters",
      check: (pwd: string) => pwd.length >= 12,
      hint: "Your password needs to be even longer!"
    },
    {
      id: 10,
      text: "Your password must include an emoji 🔒",
      check: (pwd: string) => pwd.includes('🔒'),
      hint: "Copy and paste this emoji: 🔒"
    }
  ];

  const getActiveRules = () => {
    return rules.slice(0, Math.min(currentRuleIndex + 1, rules.length));
  };

  const checkAllActiveRules = () => {
    const activeRules = getActiveRules();
    return activeRules.every(rule => rule.check(password));
  };

  const getFailedRules = () => {
    const activeRules = getActiveRules();
    return activeRules.filter(rule => !rule.check(password));
  };

  useEffect(() => {
    if (gameStarted && checkAllActiveRules() && currentRuleIndex < rules.length - 1) {
      // Add a small delay before introducing the next rule
      const timer = setTimeout(() => {
        setCurrentRuleIndex(prev => prev + 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (gameStarted && checkAllActiveRules() && currentRuleIndex === rules.length - 1) {
      // Game won!
      setGameWon(true);
      const bonusPoints = Math.max(0, 20 - hintsUsed * 2); // Bonus for using fewer hints
      const timeBonus = Math.floor(timeLeft / 10); // Bonus for time remaining
      const totalScore = Math.min(100, 60 + bonusPoints + timeBonus);
      onComplete(totalScore);
    }
  }, [password, currentRuleIndex, gameStarted]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (gameStarted && timeLeft > 0 && !gameWon) {
      timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    } else if (timeLeft === 0 && !gameWon) {
      // Time's up!
      onComplete(Math.min(currentRuleIndex * 10, 50)); // Partial credit
    }
    return () => clearTimeout(timer);
  }, [timeLeft, gameStarted, gameWon]);

  // Handle escape key to close hint modal
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && showHint) {
        setShowHint(false);
      }
    };

    if (showHint) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [showHint]);

  const startGame = () => {
    setGameStarted(true);
    setPassword('');
    setCurrentRuleIndex(0);
    setTimeLeft(120);
    setHintsUsed(0);
  };

  const useHint = (ruleId: number) => {
    setHintsUsed(prev => prev + 1);
    const rule = rules.find(r => r.id === ruleId);
    if (rule) {
      setCurrentHint(rule.hint);
      setShowHint(true);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!gameStarted) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-3xl shadow-xl p-8">
          <div className="text-center mb-8">
            <Shield className="h-16 w-16 text-blue-600 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-gray-800 mb-4">The Password Game 🔐</h2>
            <p className="text-gray-600 text-lg">
              Create a password while following an ever-growing list of rules! 
              Each time you satisfy all current rules, a new rule appears. Can you satisfy them all?
            </p>
          </div>

          <div className="bg-blue-50 rounded-2xl p-6 mb-8">
            <h3 className="font-bold text-blue-800 mb-4">How to Play:</h3>
            <ul className="space-y-2 text-blue-700">
              <li>• Start with simple rules like "must be 5 characters"</li>
              <li>• Each time you satisfy all rules, a new rule appears!</li>
              <li>• Rules get progressively more challenging and creative</li>
              <li>• You have 2 minutes to satisfy all 10 rules</li>
              <li>• Use hints if you get stuck (but they cost points!)</li>
            </ul>
          </div>

          <div className="bg-yellow-50 rounded-2xl p-6 mb-8">
            <h3 className="font-bold text-yellow-800 mb-2">🏆 Scoring:</h3>
            <ul className="space-y-1 text-yellow-700">
              <li>• Complete all rules: 60 points</li>
              <li>• Time bonus: +1 point per 10 seconds remaining</li>
              <li>• Hint penalty: -2 points per hint used</li>
              <li>• Maximum score: 100 points</li>
            </ul>
          </div>

          <div className="text-center">
            <button
              onClick={startGame}
              className="bg-blue-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-blue-700 transition-colors"
            >
              Start The Challenge! 🚀
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Custom Hint Modal */}
      {showHint && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fade-in"
          onClick={() => setShowHint(false)}
        >
          <div 
            className="bg-white rounded-2xl shadow-2xl p-6 max-w-md mx-4 transform transition-all duration-300 animate-bounce-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center">
              <div className="bg-yellow-100 p-3 rounded-full w-fit mx-auto mb-4">
                <svg className="h-8 w-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">💡 Hint!</h3>
              <p className="text-gray-600 mb-6 text-lg leading-relaxed">{currentHint}</p>
              <button
                onClick={() => setShowHint(false)}
                className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors shadow-lg"
              >
                Got it! ✨
              </button>
            </div>
          </div>
        </div>
      )}
      
      <div className="bg-white rounded-3xl shadow-xl p-8">
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={onBack}
            className="text-gray-600 hover:text-gray-800 font-semibold"
          >
            ← Back to Games
          </button>
          <div className="flex items-center gap-6">
            <div className="text-center">
              <div className={`text-2xl font-bold ${timeLeft <= 30 ? 'text-red-600' : 'text-blue-600'}`}>
                {formatTime(timeLeft)}
              </div>
              <div className="text-sm text-gray-600">Time Left</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{currentRuleIndex + 1}/{rules.length}</div>
              <div className="text-sm text-gray-600">Rules Active</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{hintsUsed}</div>
              <div className="text-sm text-gray-600">Hints Used</div>
            </div>
          </div>
        </div>

        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Create Your Password! 🔐</h2>
          <div className="relative">
            <input
              type="text"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Start typing your password..."
              className="w-full p-4 text-xl border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none font-mono"
              autoFocus
            />
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
              <span className="text-gray-400 text-sm">{password.length} chars</span>
            </div>
          </div>
        </div>

        {/* Rules List */}
        <div className="space-y-4 mb-8">
          <h3 className="text-lg font-bold text-gray-800">Password Rules:</h3>
          {getActiveRules().map((rule, index) => {
            const isValid = rule.check(password);
            const isLatest = index === currentRuleIndex;
            
            return (
              <div
                key={rule.id}
                className={`p-4 rounded-xl border-2 transition-all duration-500 ${
                  isValid
                    ? 'border-green-500 bg-green-50'
                    : isLatest
                    ? 'border-blue-500 bg-blue-50 animate-pulse'
                    : 'border-red-500 bg-red-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {isValid ? (
                      <Check className="h-5 w-5 text-green-600" />
                    ) : (
                      <X className="h-5 w-5 text-red-600" />
                    )}
                    <span className={`font-medium ${
                      isValid ? 'text-green-700' : 'text-red-700'
                    }`}>
                      Rule {rule.id}: {rule.text}
                    </span>
                    {isLatest && !isValid && (
                      <span className="bg-blue-100 text-blue-600 px-2 py-1 rounded-full text-xs font-semibold">
                        NEW!
                      </span>
                    )}
                  </div>
                  {!isValid && (
                    <button
                      onClick={() => useHint(rule.id)}
                      className="bg-yellow-500 text-white px-3 py-1 rounded-lg text-sm font-semibold hover:bg-yellow-600 transition-colors"
                    >
                      Hint (-2 pts)
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Progress Bar */}
        <div className="bg-gray-100 rounded-2xl p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="font-bold text-gray-800">Progress:</span>
            <span className="font-bold text-blue-600">
              {Math.round(((currentRuleIndex + (checkAllActiveRules() ? 1 : 0)) / rules.length) * 100)}%
            </span>
          </div>
          <div className="bg-gray-300 rounded-full h-4">
            <div 
              className="bg-gradient-to-r from-blue-500 to-purple-500 h-4 rounded-full transition-all duration-500"
              style={{ width: `${((currentRuleIndex + (checkAllActiveRules() ? 1 : 0)) / rules.length) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Failed Rules Alert */}
        {getFailedRules().length > 0 && (
          <div className="mt-6 bg-red-50 border border-red-200 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle className="h-5 w-5 text-red-600" />
              <span className="font-bold text-red-700">Rules that need fixing:</span>
            </div>
            <ul className="text-red-600 text-sm space-y-1">
              {getFailedRules().map(rule => (
                <li key={rule.id}>• Rule {rule.id}: {rule.text}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

// Share or Shield Game Component (unchanged)
const ShareOrShield: React.FC<{ onComplete: (points: number) => void; onBack: () => void }> = ({ onComplete, onBack }) => {
  const [currentCard, setCurrentCard] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [showFeedback, setShowFeedback] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);

  const infoCards = [
    { info: 'Your favorite color', safe: true, explanation: 'Your favorite color is generally safe to share!' },
    { info: 'Your home address', safe: false, explanation: 'Your address should be kept private for your safety!' },
    { info: 'Your favorite movie', safe: true, explanation: 'Sharing your favorite movie is usually fine!' },
    { info: 'Your school name', safe: false, explanation: 'Your school name can help strangers find you!' },
    { info: 'Your pet\'s name', safe: true, explanation: 'Pet names are usually okay to share!' },
    { info: 'Your phone number', safe: false, explanation: 'Phone numbers should only be shared with trusted people!' },
    { info: 'Your favorite food', safe: true, explanation: 'Food preferences are safe to share!' },
    { info: 'Your birthday', safe: false, explanation: 'Birthdays can be used to steal your identity!' },
    { info: 'Your hobby', safe: true, explanation: 'Sharing hobbies is a great way to make friends!' },
    { info: 'Your password', safe: false, explanation: 'Never share passwords with anyone!' }
  ];

  const makeChoice = (choice: 'share' | 'shield') => {
    const currentInfo = infoCards[currentCard];
    const isCorrect = (choice === 'share' && currentInfo.safe) || (choice === 'shield' && !currentInfo.safe);
    
    if (isCorrect) {
      setScore(prev => prev + 8);
      setFeedback(`Correct! ${currentInfo.explanation}`);
    } else {
      setFeedback(`Not quite. ${currentInfo.explanation}`);
    }
    
    setShowFeedback(true);
    
    setTimeout(() => {
      if (currentCard < infoCards.length - 1) {
        setCurrentCard(prev => prev + 1);
        setShowFeedback(false);
      } else {
        onComplete(score + (isCorrect ? 8 : 0));
      }
    }, 2500);
  };

  if (!gameStarted) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-3xl shadow-xl p-8">
          <div className="text-center mb-8">
            <Eye className="h-16 w-16 text-blue-600 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Share or Shield? 🛡️</h2>
            <p className="text-gray-600 text-lg">
              Help decide what information is safe to share online and what should be kept private!
            </p>
          </div>

          <div className="bg-blue-50 rounded-2xl p-6 mb-8">
            <h3 className="font-bold text-blue-800 mb-4">How to Play:</h3>
            <ul className="space-y-2 text-blue-700">
              <li>• Cards with different types of information will appear</li>
              <li>• Decide whether it's safe to SHARE or if you should SHIELD it</li>
              <li>• You'll get immediate feedback on each choice</li>
              <li>• Try to get as many correct as possible!</li>
            </ul>
          </div>

          <div className="text-center">
            <button
              onClick={() => setGameStarted(true)}
              className="bg-blue-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-blue-700 transition-colors"
            >
              Start the Challenge! 🚀
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-3xl shadow-xl p-8">
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={onBack}
            className="text-gray-600 hover:text-gray-800 font-semibold"
          >
            ← Back to Games
          </button>
          <div className="flex items-center gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{currentCard + 1}/{infoCards.length}</div>
              <div className="text-sm text-gray-600">Card</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{score}</div>
              <div className="text-sm text-gray-600">Points</div>
            </div>
          </div>
        </div>

        {!showFeedback ? (
          <div className="text-center">
            <div className="bg-gradient-to-br from-blue-100 to-purple-100 rounded-3xl p-12 mb-8 shadow-lg">
              <h3 className="text-3xl font-bold text-gray-800 mb-6">
                {infoCards[currentCard].info}
              </h3>
              <p className="text-gray-600 text-lg mb-8">
                Should you share this information online?
              </p>
              
              <div className="flex justify-center gap-8">
                <button
                  onClick={() => makeChoice('share')}
                  className="bg-green-600 text-white px-8 py-4 rounded-2xl font-bold text-xl hover:bg-green-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  <Eye className="h-6 w-6 mx-auto mb-2" />
                  SHARE
                </button>
                <button
                  onClick={() => makeChoice('shield')}
                  className="bg-red-600 text-white px-8 py-4 rounded-2xl font-bold text-xl hover:bg-red-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  <EyeOff className="h-6 w-6 mx-auto mb-2" />
                  SHIELD
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center">
            <div className="bg-blue-50 rounded-3xl p-12 mb-8">
              <div className="text-6xl mb-4">
                {feedback.startsWith('Correct') ? '🎉' : '💡'}
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">
                {feedback.startsWith('Correct') ? 'Excellent!' : 'Good Try!'}
              </h3>
              <p className="text-gray-700 text-lg">{feedback}</p>
            </div>
          </div>
        )}

        <div className="bg-gray-100 rounded-2xl p-4">
          <div className="flex items-center justify-between">
            <span className="font-bold text-gray-800">Progress:</span>
            <div className="flex-1 mx-4">
              <div className="bg-gray-300 rounded-full h-3">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${((currentCard + 1) / infoCards.length) * 100}%` }}
                ></div>
              </div>
            </div>
            <span className="font-bold text-blue-600">{Math.round(((currentCard + 1) / infoCards.length) * 100)}%</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MiniGames;