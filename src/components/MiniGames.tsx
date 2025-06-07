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
      title: 'Benteng Kata Sandi',
      description: 'Buat kata sandi yang super kuat dengan mengikuti aturan seru yang makin banyak!',
      component: 'PasswordGame',
      requiredLevel: 1,
      maxPoints: 100
    },
    {
      id: 'share-shield',
      title: 'Bagikan atau Lindungi',
      description: 'Putuskan informasi mana yang aman dibagikan online dan mana yang harus dilindungi!',
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
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Game Selesai! 🎮</h2>
            <p className="text-gray-600 text-lg">Kamu berhasil meraih {gameScore} poin!</p>
          </div>
          
          <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-6 mb-6">
            <h3 className="font-bold text-gray-800 mb-2">Kerja Bagus!</h3>
            <p className="text-gray-600">
              Kamu telah menyelesaikan "{selectedGame!.title}" dan mempelajari keterampilan keamanan yang penting!
            </p>
          </div>

          <button
            onClick={resetGame}
            className="bg-blue-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors"
          >
            Main Game Lain
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Simulator Keamanan 🎮</h2>
        <p className="text-gray-600 text-lg">Belajar keamanan digital melalui permainan interaktif yang seru!</p>
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
                    Selesai! ✓
                  </span>
                )}
              </div>

              <h3 className="text-2xl font-bold text-gray-800 mb-3">{game.title}</h3>
              <p className="text-gray-600 mb-6 text-lg">{game.description}</p>

              <div className="flex items-center justify-between">
                <span className="text-purple-600 font-semibold">
                  Hingga {game.maxPoints} poin
                </span>
                {!isUnlocked && (
                  <span className="text-gray-400 text-sm">Perlu Level {game.requiredLevel}</span>
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
      text: "Kata sandi harus minimal 5 karakter",
      check: (pwd: string) => pwd.length >= 5,
      hint: "Coba ketik lebih banyak huruf atau angka!"
    },
    {
      id: 2,
      text: "Kata sandi harus mengandung angka",
      check: (pwd: string) => /\d/.test(pwd),
      hint: "Tambahkan angka seperti 1, 2, 3..."
    },
    {
      id: 3,
      text: "Kata sandi harus mengandung huruf besar",
      check: (pwd: string) => /[A-Z]/.test(pwd),
      hint: "Tambahkan huruf kapital seperti A, B, C..."
    },
    {
      id: 4,
      text: "Kata sandi harus mengandung karakter khusus",
      check: (pwd: string) => /[!@#$%^&*(),.?\":{}|<>]/.test(pwd),
      hint: "Coba tambahkan ! atau @ atau # atau $"
    },
    {
      id: 5,
      text: "Kata sandi harus minimal 8 karakter",
      check: (pwd: string) => pwd.length >= 8,
      hint: "Buat kata sandimu lebih panjang!"
    },
    {
      id: 6,
      text: "Kata sandi harus mengandung huruf kecil",
      check: (pwd: string) => /[a-z]/.test(pwd),
      hint: "Tambahkan huruf kecil seperti a, b, c..."
    },
    {
      id: 7,
      text: "Kata sandi tidak boleh mengandung kata 'sandi'",
      check: (pwd: string) => !pwd.toLowerCase().includes('sandi'),
      hint: "Hapus kata 'sandi' dari kata sandimu!"
    },
    {
      id: 8,
      text: "Kata sandi harus mengandung tahun sekarang (2025)",
      check: (pwd: string) => pwd.includes('2025'),
      hint: "Tambahkan 2025 di kata sandimu!"
    },
    {
      id: 9,
      text: "Kata sandi harus minimal 12 karakter",
      check: (pwd: string) => pwd.length >= 12,
      hint: "Kata sandimu perlu lebih panjang lagi!"
    },
    {
      id: 10,
      text: "Kata sandi harus mengandung emoji gembok 🔒",
      check: (pwd: string) => pwd.includes('🔒'),
      hint: "Salin dan tempel emoji ini: 🔒"
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
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Benteng Kata Sandi 🔐</h2>
            <p className="text-gray-600 text-lg">
              Buat kata sandi yang kuat sambil mengikuti aturan yang terus bertambah! 
              Setiap kali kamu memenuhi semua aturan, aturan baru akan muncul. Bisakah kamu memenuhi semuanya?
            </p>
          </div>

          <div className="bg-blue-50 rounded-2xl p-6 mb-8">
            <h3 className="font-bold text-blue-800 mb-4">Cara Bermain:</h3>
            <ul className="space-y-2 text-blue-700">
              <li>• Mulai dengan aturan sederhana seperti "minimal 5 karakter"</li>
              <li>• Setiap kali kamu memenuhi semua aturan, aturan baru akan muncul!</li>
              <li>• Aturan akan semakin menantang dan unik</li>
              <li>• Kamu punya waktu 2 menit untuk memenuhi semua 10 aturan</li>
              <li>• Gunakan petunjuk jika stuck (tapi akan mengurangi poin!)</li>
            </ul>
          </div>

          <div className="bg-yellow-50 rounded-2xl p-6 mb-8">
            <h3 className="font-bold text-yellow-800 mb-2">🏆 Sistem Poin:</h3>
            <ul className="space-y-1 text-yellow-700">
              <li>• Selesaikan semua aturan: 60 poin</li>
              <li>• Bonus waktu: +1 poin per 10 detik tersisa</li>
              <li>• Penalti petunjuk: -2 poin per petunjuk yang digunakan</li>
              <li>• Poin maksimal: 100 poin</li>
            </ul>
          </div>

          <div className="text-center">
            <button
              onClick={startGame}
              className="bg-blue-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-blue-700 transition-colors"
            >
              Mulai Tantangan! 🚀
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
              <h3 className="text-xl font-bold text-gray-800 mb-3">💡 Petunjuk!</h3>
              <p className="text-gray-600 mb-6 text-lg leading-relaxed">{currentHint}</p>
              <button
                onClick={() => setShowHint(false)}
                className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors shadow-lg"
              >
                Mengerti! ✨
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
            ← Kembali ke Games
          </button>
          <div className="flex items-center gap-6">
            <div className="text-center">
              <div className={`text-2xl font-bold ${timeLeft <= 30 ? 'text-red-600' : 'text-blue-600'}`}>
                {formatTime(timeLeft)}
              </div>
              <div className="text-sm text-gray-600">Waktu Tersisa</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{currentRuleIndex + 1}/{rules.length}</div>
              <div className="text-sm text-gray-600">Aturan Aktif</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{hintsUsed}</div>
              <div className="text-sm text-gray-600">Petunjuk Digunakan</div>
            </div>
          </div>
        </div>

        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Buat Kata Sandimu! 🔐</h2>
          <div className="relative">
            <input
              type="text"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mulai ketik kata sandimu..."
              className="w-full p-4 text-xl border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none font-mono"
              autoFocus
            />
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
              <span className="text-gray-400 text-sm">{password.length} karakter</span>
            </div>
          </div>
        </div>

        {/* Rules List */}
        <div className="space-y-4 mb-8">
          <h3 className="text-lg font-bold text-gray-800">Aturan Kata Sandi:</h3>
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
                      Aturan {rule.id}: {rule.text}
                    </span>
                    {isLatest && !isValid && (
                      <span className="bg-blue-100 text-blue-600 px-2 py-1 rounded-full text-xs font-semibold">
                        BARU!
                      </span>
                    )}
                  </div>
                  {!isValid && (
                    <button
                      onClick={() => useHint(rule.id)}
                      className="bg-yellow-500 text-white px-3 py-1 rounded-lg text-sm font-semibold hover:bg-yellow-600 transition-colors"
                    >
                      Petunjuk (-2 poin)
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
            <span className="font-bold text-gray-800">Kemajuan:</span>
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
              <span className="font-bold text-red-700">Aturan yang perlu diperbaiki:</span>
            </div>
            <ul className="text-red-600 text-sm space-y-1">
              {getFailedRules().map(rule => (
                <li key={rule.id}>• Aturan {rule.id}: {rule.text}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

// Share or Shield Game Component
const ShareOrShield: React.FC<{ onComplete: (points: number) => void; onBack: () => void }> = ({ onComplete, onBack }) => {
  const [currentCard, setCurrentCard] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [showFeedback, setShowFeedback] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(10);
  const [questionStarted, setQuestionStarted] = useState(false);

  const infoCards = [
    { info: 'Warna favoritmu', safe: true, explanation: 'Warna favorit umumnya aman untuk dibagikan!' },
    { info: 'Alamat rumahmu', safe: false, explanation: 'Alamat rumah harus dirahasiakan demi keamananmu!' },
    { info: 'Film favoritmu', safe: true, explanation: 'Membagikan film favorit biasanya tidak masalah!' },
    { info: 'Nama sekolahmu', safe: false, explanation: 'Nama sekolah bisa membantu orang asing menemukanmu!' },
    { info: 'Nama hewan peliharaanmu', safe: true, explanation: 'Nama hewan peliharaan biasanya aman untuk dibagikan!' },
    { info: 'Nomor teleponmu', safe: false, explanation: 'Nomor telepon hanya boleh dibagikan dengan orang terpercaya!' },
    { info: 'Makanan favoritmu', safe: true, explanation: 'Preferensi makanan aman untuk dibagikan!' },
    { info: 'Tanggal ulang tahunmu', safe: false, explanation: 'Tanggal lahir bisa digunakan untuk mencuri identitasmu!' },
    { info: 'Hobimu', safe: true, explanation: 'Membagikan hobi adalah cara yang bagus untuk berteman!' },
    { info: 'Kata sandimu', safe: false, explanation: 'Jangan pernah bagikan kata sandi kepada siapa pun!' },
    { info: 'Nama lengkap orang tuamu', safe: false, explanation: 'Nama orang tua adalah informasi pribadi yang harus dilindungi!' },
    { info: 'Tempat favoritmu untuk liburan', safe: true, explanation: 'Tempat liburan favorit umumnya aman untuk dibagikan!' }
  ];

  // Create audio contexts for different ticking sounds
  const createTickSound = (frequency: number, duration: number = 0.1) => {
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
      oscillator.type = 'square';
      
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + duration);
    } catch (error) {
      console.log('Audio not supported:', error);
    }
  };

  const playTickSound = () => {
    if (timeLeft <= 3) {
      // Urgent fast ticking
      createTickSound(800, 0.05);
    } else if (timeLeft <= 5) {
      // Warning ticking
      createTickSound(600, 0.08);
    } else {
      // Normal ticking
      createTickSound(400, 0.1);
    }
  };

  // Timer useEffect with sound
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (questionStarted && timeLeft > 0 && !showFeedback) {
      // Play tick sound
      playTickSound();
      
      timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    } else if (timeLeft === 0 && !showFeedback) {
      // Time's up! Play different sound
      try {
        createTickSound(200, 0.5); // Lower, longer sound for timeout
      } catch (error) {
        console.log('Audio not supported:', error);
      }
      
      const currentInfo = infoCards[currentCard];
      setFeedback(`Waktu habis! ${currentInfo.explanation}`);
      setShowFeedback(true);
      
      setTimeout(() => {
        if (currentCard < infoCards.length - 1) {
          setCurrentCard(prev => prev + 1);
          setShowFeedback(false);
          setTimeLeft(10);
          setQuestionStarted(true);
        } else {
          onComplete(score);
        }
      }, 2500);
    }
    return () => clearTimeout(timer);
  }, [timeLeft, questionStarted, showFeedback, currentCard, score]);

  // Start timer when card changes
  useEffect(() => {
    if (gameStarted && !showFeedback) {
      setTimeLeft(10);
      setQuestionStarted(true);
    }
  }, [currentCard, gameStarted, showFeedback]);

  const makeChoice = (choice: 'share' | 'shield') => {
    if (showFeedback) return;
    
    setQuestionStarted(false);
    
    // Play answer sound
    try {
      const currentInfo = infoCards[currentCard];
      const isCorrect = (choice === 'share' && currentInfo.safe) || (choice === 'shield' && !currentInfo.safe);
      
      if (isCorrect) {
        // Success sound
        createTickSound(523, 0.3); // C note
        setTimeout(() => createTickSound(659, 0.3), 150); // E note
        setTimeout(() => createTickSound(784, 0.3), 300); // G note
      } else {
        // Error sound
        createTickSound(150, 0.5); // Low buzz
      }
    } catch (error) {
      console.log('Audio not supported:', error);
    }
    
    const currentInfo = infoCards[currentCard];
    const isCorrect = (choice === 'share' && currentInfo.safe) || (choice === 'shield' && !currentInfo.safe);
    
    if (isCorrect) {
      setScore(prev => prev + 8);
      setFeedback(`Benar! ${currentInfo.explanation}`);
    } else {
      setFeedback(`Belum tepat. ${currentInfo.explanation}`);
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

  // Circular timer component
  const CircularTimer = () => {
    const radius = 40;
    const circumference = 2 * Math.PI * radius;
    const progress = (timeLeft / 10) * 100;
    const strokeDashoffset = circumference - (progress / 100) * circumference;

    return (
      <div className="relative w-24 h-24 mx-auto mb-6">
        <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
          {/* Background circle */}
          <circle
            cx="50"
            cy="50"
            r={radius}
            stroke="rgb(229, 231, 235)"
            strokeWidth="8"
            fill="transparent"
          />
          {/* Progress circle */}
          <circle
            cx="50"
            cy="50"
            r={radius}
            stroke={timeLeft <= 3 ? "rgb(239, 68, 68)" : timeLeft <= 5 ? "rgb(245, 158, 11)" : "rgb(59, 130, 246)"}
            strokeWidth="8"
            fill="transparent"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className="transition-all duration-1000 ease-linear"
          />
        </svg>
        {/* Timer text with pulse animation when urgent */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={`text-2xl font-bold ${
            timeLeft <= 3 
              ? 'text-red-600 animate-pulse' 
              : timeLeft <= 5 
                ? 'text-yellow-600' 
                : 'text-blue-600'
          }`}>
            {timeLeft}
          </span>
        </div>
        
        {/* Add visual pulse effect for urgency */}
        {timeLeft <= 3 && (
          <div className="absolute inset-0 rounded-full border-4 border-red-500 animate-ping opacity-25"></div>
        )}
      </div>
    );
  };

  if (!gameStarted) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-3xl shadow-xl p-8">
          <div className="text-center mb-8">
            <Eye className="h-16 w-16 text-blue-600 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Bagikan atau Lindungi? 🛡️</h2>
            <p className="text-gray-600 text-lg">
              Bantu putuskan informasi mana yang aman dibagikan online dan mana yang harus dijaga kerahasiaannya!
            </p>
          </div>

          <div className="bg-blue-50 rounded-2xl p-6 mb-8">
            <h3 className="font-bold text-blue-800 mb-4">Cara Bermain:</h3>
            <ul className="space-y-2 text-blue-700">
              <li>• Kartu dengan berbagai jenis informasi akan muncul</li>
              <li>• Kamu punya 10 detik untuk setiap pertanyaan! ⏰</li>
              <li>• Dengarkan suara detik-detik waktu berjalan! 🔊</li>
              <li>• Putuskan apakah aman untuk DIBAGIKAN atau harus DILINDUNGI</li>
              <li>• Kamu akan mendapat umpan balik langsung untuk setiap pilihan</li>
              <li>• Coba jawab sebanyak mungkin dengan benar sebelum waktu habis!</li>
            </ul>
          </div>

          <div className="bg-yellow-50 rounded-2xl p-4 mb-8">
            <div className="flex items-center gap-2 text-yellow-700">
              <span className="text-xl">🔊</span>
              <p className="text-sm">
                <strong>Tip:</strong> Pastikan volume perangkatmu menyala untuk mendengar efek suara yang membantu!
              </p>
            </div>
          </div>

          <div className="text-center">
            <button
              onClick={() => setGameStarted(true)}
              className="bg-blue-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-blue-700 transition-colors"
            >
              Mulai Tantangan! 🚀
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
            ← Kembali ke Games
          </button>
          <div className="flex items-center gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{currentCard + 1}/{infoCards.length}</div>
              <div className="text-sm text-gray-600">Kartu</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{score}</div>
              <div className="text-sm text-gray-600">Poin</div>
            </div>
          </div>
        </div>

        {!showFeedback ? (
          <div className="text-center">
            {/* Timer */}
            <CircularTimer />
            
            <div className="bg-gradient-to-br from-blue-100 to-purple-100 rounded-3xl p-12 mb-8 shadow-lg">
              <h3 className="text-3xl font-bold text-gray-800 mb-6">
                {infoCards[currentCard].info}
              </h3>
              <p className="text-gray-600 text-lg mb-8">
                Apakah kamu boleh membagikan informasi ini online?
              </p>
              
              <div className="flex justify-center gap-8">
                <button
                  onClick={() => makeChoice('share')}
                  disabled={showFeedback}
                  className="bg-green-600 text-white px-8 py-4 rounded-2xl font-bold text-xl hover:bg-green-700 transition-all duration-300 transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Eye className="h-6 w-6 mx-auto mb-2" />
                  BAGIKAN
                </button>
                <button
                  onClick={() => makeChoice('shield')}
                  disabled={showFeedback}
                  className="bg-red-600 text-white px-8 py-4 rounded-2xl font-bold text-xl hover:bg-red-700 transition-all duration-300 transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <EyeOff className="h-6 w-6 mx-auto mb-2" />
                  LINDUNGI
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center">
            <div className="bg-blue-50 rounded-3xl p-12 mb-8">
              <div className="text-6xl mb-4">
                {feedback.startsWith('Benar') ? '🎉' : feedback.startsWith('Waktu habis') ? '⏰' : '💡'}
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">
                {feedback.startsWith('Benar') ? 'Hebat!' : feedback.startsWith('Waktu habis') ? 'Waktu Habis!' : 'Coba Lagi!'}
              </h3>
              <p className="text-gray-700 text-lg">{feedback}</p>
            </div>
          </div>
        )}

        <div className="bg-gray-100 rounded-2xl p-4">
          <div className="flex items-center justify-between">
            <span className="font-bold text-gray-800">Kemajuan:</span>
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