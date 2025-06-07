import React, { useState } from 'react';
import { CheckCircle, XCircle, Star, ArrowRight, Trophy, Lock, Target, Award, Zap, Shield } from 'lucide-react';
import { UserProgress, Quiz } from '../types';

interface QuizSystemProps {
  userProgress: UserProgress;
  updateProgress: (updates: Partial<UserProgress>) => void;
}

const QuizSystem: React.FC<QuizSystemProps> = ({ userProgress, updateProgress }) => {
  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [missionPassed, setMissionPassed] = useState(false);

  const quizzes: Quiz[] = [
    {
      id: 'privacy-basics',
      title: 'Dasar-Dasar Privasi',
      description: 'Pelajari apa itu informasi pribadi dan mengapa itu penting',
      level: 1,
      requiredLevel: 1,
      requiredScore: 60, // Perlu 3/5 jawaban benar (60%)
      questions: [
        {
          id: 'q1',
          question: 'Manakah yang termasuk informasi pribadi?',
          options: ['Warna favoritmu', 'Nama lengkapmu', 'Film favoritmu', 'Jenis hewan peliharaanmu'],
          correctAnswer: 1,
          explanation: 'Nama lengkapmu adalah informasi pribadi karena bisa mengenali dirimu secara khusus! Jagalah dengan baik dan hanya bagikan dengan orang yang terpercaya.',
          points: 20
        },
        {
          id: 'q2',
          question: 'Kepada siapa kamu boleh membagikan alamat rumahmu secara online?',
          options: ['Siapa saja yang bertanya dengan sopan', 'Hanya orang yang kamu kenal di dunia nyata', 'Semua orang di media sosial', 'Tidak kepada siapa pun, kecuali perlu dan dengan persetujuan orang dewasa terpercaya'],
          correctAnswer: 3,
          explanation: 'Alamatmu adalah informasi yang sangat pribadi! Hanya bagikan jika benar-benar perlu dan selalu dengan izin orang dewasa yang terpercaya.',
          points: 20
        },
        {
          id: 'q3',
          question: 'Apa itu jejak digital?',
          options: ['Jejak kaki yang kamu buat saat menggunakan komputer', 'Jejak informasi yang kamu tinggalkan online', 'Jenis sepatu khusus untuk gamer', 'Foto kaki di internet'],
          correctAnswer: 1,
          explanation: 'Jejak digital adalah semua informasi tentang dirimu yang ada di internet - seperti komentar, foto, dan pencarian! Jejak ini mengikutimu ke mana-mana.',
          points: 20
        },
        {
          id: 'q4',
          question: 'Jika ada orang online yang menanyakan nama sekolahmu, kamu harus:',
          options: ['Langsung memberitahu mereka', 'Bertanya dulu kepada orang dewasa terpercaya', 'Memberitahu hanya jika mereka terlihat baik', 'Membagikannya di media sosial'],
          correctAnswer: 1,
          explanation: 'Selalu tanyakan dulu kepada orang dewasa terpercaya sebelum membagikan informasi tentang sekolahmu. Ini membantu menjaga keamananmu!',
          points: 20
        },
        {
          id: 'q5',
          question: 'Manakah yang paling aman untuk dibagikan online?',
          options: ['Nomor teleponmu', 'Buku favoritmu', 'Tanggal lahirmu', 'Alamat rumahmu'],
          correctAnswer: 1,
          explanation: 'Buku favoritmu aman untuk dibagikan! Ini cara yang bagus untuk terhubung dengan orang lain yang menyukai hal yang sama tanpa membuka detail pribadi.',
          points: 20
        }
      ]
    },
    {
      id: 'password-power',
      title: 'Kekuatan Kata Sandi',
      description: 'Kuasai seni membuat kata sandi yang kuat dan aman',
      level: 2,
      requiredLevel: 2, // Perlu level 2 (selesaikan Dasar-Dasar Privasi dulu)
      requiredScore: 75, // Perlu 3/4 jawaban benar (75%)
      questions: [
        {
          id: 'p1',
          question: 'Kata sandi mana yang paling kuat?',
          options: ['password123', 'MyP@ssw0rd!2024', '12345678', 'qwerty'],
          correctAnswer: 1,
          explanation: 'Kata sandi yang kuat memiliki huruf besar, huruf kecil, angka, dan simbol! Mereka seperti kunci super kuat untuk akun-akunmu.',
          points: 25
        },
        {
          id: 'p2',
          question: 'Haruskah kamu menggunakan kata sandi yang sama untuk semua akun?',
          options: ['Ya, lebih mudah diingat', 'Tidak, gunakan kata sandi berbeda untuk akun berbeda', 'Hanya untuk akun penting', 'Tidak masalah'],
          correctAnswer: 1,
          explanation: 'Menggunakan kata sandi berbeda membuat akun-akunmu lebih aman! Jika satu dikompromikan, yang lain tetap terlindungi.',
          points: 25
        },
        {
          id: 'p3',
          question: 'Apa yang harus kamu lakukan jika lupa kata sandi?',
          options: ['Menggunakan kata sandi yang sama untuk semuanya', 'Minta teman membantu menebaknya', 'Menggunakan fitur "lupa kata sandi"', 'Menulisnya di kertas tempel'],
          correctAnswer: 2,
          explanation: 'Fitur "lupa kata sandi" adalah cara teraman untuk mereset kata sandimu! Ini mengirimkan tautan aman ke emailmu.',
          points: 25
        },
        {
          id: 'p4',
          question: 'Kepada siapa kamu boleh membagikan kata sandimu?',
          options: ['Sahabatmu', 'Gurumu', 'Orang dewasa terpercaya seperti orang tua', 'Siapa saja yang bertanya'],
          correctAnswer: 2,
          explanation: 'Hanya bagikan kata sandi dengan orang dewasa terpercaya seperti orang tua atau wali yang membantu menjaga keamananmu online!',
          points: 25
        }
      ]
    },
    {
      id: 'phishing-detective',
      title: 'Detektif Phishing',
      description: 'Belajar mengenali dan menghindari trik serta penipuan online',
      level: 3,
      requiredLevel: 3, // Perlu level 3 (selesaikan Kekuatan Kata Sandi dulu)
      requiredScore: 70, // Perlu 3/4 jawaban benar (70%)
      questions: [
        {
          id: 'ph1',
          question: 'Apa itu phishing?',
          options: ['Memancing ikan secara online', 'Trik untuk mencuri informasimu', 'Aplikasi media sosial baru', 'Permainan komputer'],
          correctAnswer: 1,
          explanation: 'Phishing adalah saat orang jahat mencoba menipumu untuk memberikan informasi pribadimu! Mereka menyamar sebagai orang yang bisa dipercaya.',
          points: 25
        },
        {
          id: 'ph2',
          question: 'Kamu menerima email yang mengatakan "Kamu menang Rp15.000.000! Klik di sini!" Apa yang harus kamu lakukan?',
          options: ['Langsung klik!', 'Tanyakan dulu kepada orang dewasa terpercaya', 'Bagikan dengan teman-teman', 'Balas dengan informasimu'],
          correctAnswer: 1,
          explanation: 'Ini terdengar seperti penipuan phishing! Selalu tanyakan kepada orang dewasa terpercaya sebelum mengklik tautan mencurigakan atau mengklaim hadiah.',
          points: 25
        },
        {
          id: 'ph3',
          question: 'Sebuah website meminta kata sandimu untuk "memverifikasi akun." Tindakan paling aman adalah?',
          options: ['Langsung masukkan kata sandimu', 'Cek dengan orang dewasa terpercaya', 'Berikan kata sandi palsu', 'Hanya bagikan username'],
          correctAnswer: 1,
          explanation: 'Website resmi jarang meminta verifikasi dengan memasukkan kata sandi di email atau pop-up. Selalu cek dengan orang dewasa terpercaya!',
          points: 25
        },
        {
          id: 'ph4',
          question: 'Bagaimana cara mengetahui apakah website aman?',
          options: ['Memiliki banyak warna', 'Memiliki "https://" dan ikon gembok', 'Memuat dengan cepat', 'Memiliki banyak iklan'],
          correctAnswer: 1,
          explanation: 'Cari "https://" dan ikon gembok di browsermu! Ini menunjukkan website menggunakan enkripsi aman untuk melindungi informasimu.',
          points: 25
        }
      ]
    },
    {
      id: 'social-media-safety',
      title: 'Keamanan Media Sosial',
      description: 'Jelajahi platform sosial seperti ahli privasi',
      level: 4,
      requiredLevel: 4, // Perlu level 4 (selesaikan Detektif Phishing dulu)
      requiredScore: 80, // Perlu 4/5 jawaban benar (80%)
      questions: [
        {
          id: 's1',
          question: 'Apa yang harus kamu lakukan sebelum memposting foto online?',
          options: ['Langsung posting', 'Pikirkan siapa yang mungkin melihatnya', 'Tambahkan lokasimu', 'Tag semua orang yang kamu kenal'],
          correctAnswer: 1,
          explanation: 'Selalu pikirkan sebelum memposting! Sekali sesuatu ada online, bisa dilihat banyak orang dan bertahan selamanya.',
          points: 20
        },
        {
          id: 's2',
          question: 'Seseorang yang tidak kamu kenal ingin berteman denganmu online. Kamu harus:',
          options: ['Langsung terima', 'Tanyakan dulu kepada orang dewasa terpercaya', 'Terima jika mereka terlihat baik', 'Abaikan sepenuhnya'],
          correctAnswer: 1,
          explanation: 'Selalu tanyakan kepada orang dewasa terpercaya sebelum menerima permintaan pertemanan dari orang yang tidak kamu kenal di dunia nyata!',
          points: 20
        },
        {
          id: 's3',
          question: 'Informasi apa yang harus kamu rahasiakan di media sosial?',
          options: ['Warna favoritmu', 'Nama sekolah dan lokasimu', 'Film favoritmu', 'Hobimu'],
          correctAnswer: 1,
          explanation: 'Rahasiakan nama sekolah dan lokasimu! Informasi ini bisa membantu orang asing menemukanmu di dunia nyata.',
          points: 20
        },
        {
          id: 's4',
          question: 'Jika ada orang online yang berlaku jahat kepadamu, apa yang harus kamu lakukan?',
          options: ['Berlaku jahat balik', 'Beritahu orang dewasa terpercaya', 'Rahasiakan', 'Posting secara umum tentang itu'],
          correctAnswer: 1,
          explanation: 'Selalu beritahu orang dewasa terpercaya jika ada yang berlaku jahat online! Mereka bisa membantumu menangani situasi dengan aman.',
          points: 20
        },
        {
          id: 's5',
          question: 'Untuk apa pengaturan privasi?',
          options: ['Membuat profilmu terlihat keren', 'Mengontrol siapa yang bisa melihat postinganmu', 'Mendapat lebih banyak pengikut', 'Membuat postingan memuat lebih cepat'],
          correctAnswer: 1,
          explanation: 'Pengaturan privasi membantumu mengontrol siapa yang bisa melihat postingan dan informasimu! Seperti memilih siapa yang boleh masuk ke kamar digitalmu.',
          points: 20
        }
      ]
    }
  ];

  const handleAnswerSelect = (answerIndex: number) => {
    if (!selectedQuiz || showResult) return; // Prevent double-clicking
    
    setSelectedAnswer(answerIndex);
    setShowResult(true);
    
    const currentQ = selectedQuiz.questions[currentQuestion];
    if (answerIndex === currentQ.correctAnswer) {
      setQuizScore(prev => prev + currentQ.points);
      setCorrectAnswers(prev => prev + 1);
    }
  };

  const handleNextQuestion = () => {
    if (!selectedQuiz) return;
    
    if (currentQuestion < selectedQuiz.questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      completeQuiz();
    }
  };

  const completeQuiz = () => {
    if (!selectedQuiz) {
      console.error('No quiz selected when trying to complete');
      return;
    }
    
    const totalQuestions = selectedQuiz.questions.length;
    const scorePercentage = (correctAnswers / totalQuestions) * 100;
    const passed = scorePercentage >= selectedQuiz.requiredScore;
    
    setMissionPassed(passed);
    
    if (passed) {
      // Prevent duplicate completions
      if (userProgress.completedQuizzes.includes(selectedQuiz.id)) {
        console.log('Quiz already completed, not adding duplicate');
        setQuizCompleted(true);
        return;
      }
      
      const newCompletedQuizzes = [...userProgress.completedQuizzes, selectedQuiz.id];
      const newTotalPoints = userProgress.totalPoints + quizScore;
      
      // Fix: Calculate level based on completed quizzes using quiz.level instead of hardcoded values
      let newLevel = userProgress.level;
      const completedQuizLevel = selectedQuiz.level;
      
      // Only advance level if this quiz completion would unlock a higher level
      if (completedQuizLevel >= newLevel) {
        newLevel = Math.max(newLevel, completedQuizLevel + 1);
      }
      
      updateProgress({
        completedQuizzes: newCompletedQuizzes,
        totalPoints: newTotalPoints,
        level: newLevel
      });
    }

    setQuizCompleted(true);
  };

  const resetQuiz = () => {
    setSelectedQuiz(null);
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setQuizScore(0);
    setCorrectAnswers(0);
    setQuizCompleted(false);
    setMissionPassed(false);
  };

  const retryQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setQuizScore(0);
    setCorrectAnswers(0);
    setQuizCompleted(false);
    setMissionPassed(false);
  };

  const getQuizStatus = (quiz: Quiz) => {
    const isCompleted = userProgress.completedQuizzes.includes(quiz.id);
    if (isCompleted) return 'completed';
    
    // Fix: Use proper level-based unlocking instead of only checking privacy-basics
    if (quiz.id === 'privacy-basics') {
      return 'available'; // Always available as the first mission
    }
    
    // Check if user level meets the required level for this quiz
    if (userProgress.level >= quiz.requiredLevel) {
      return 'available';
    }
    
    return 'locked';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <Trophy className="h-6 w-6 text-green-600" />;
      case 'available':
        return <Target className="h-6 w-6 text-blue-600" />;
      case 'locked':
        return <Lock className="h-6 w-6 text-gray-400" />;
      default:
        return <Star className="h-6 w-6 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'border-green-500 bg-green-50 hover:shadow-xl hover:scale-105 cursor-pointer';
      case 'available':
        return 'border-blue-500 bg-blue-50 hover:shadow-xl hover:scale-105 cursor-pointer';
      case 'locked':
        return 'border-gray-300 bg-gray-50 opacity-60';
      default:
        return 'border-gray-300 bg-gray-50';
    }
  };

  if (selectedQuiz && !quizCompleted) {
    const currentQ = selectedQuiz.questions[currentQuestion];
    const isCorrect = selectedAnswer === currentQ.correctAnswer;

    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-4">
          {/* Compact Header */}
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-bold text-gray-800">{selectedQuiz.title}</h2>
              <p className="text-sm text-gray-600">Misi Level {selectedQuiz.level}</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-center">
                <span className="text-xs font-semibold text-gray-600">
                  {currentQuestion + 1}/{selectedQuiz.questions.length}
                </span>
                <div className="text-xs text-gray-500">
                  Perlu {Math.ceil((selectedQuiz.requiredScore / 100) * selectedQuiz.questions.length)} benar
                </div>
              </div>
              <div className="bg-blue-100 px-2 py-1 rounded-full">
                <span className="text-blue-600 font-semibold text-sm">{correctAnswers}/{selectedQuiz.questions.length} ✓</span>
              </div>
            </div>
          </div>

          {/* Compact Progress Bar */}
          <div className="bg-gray-200 rounded-full h-2 mb-4">
            <div 
              className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${((currentQuestion + 1) / selectedQuiz.questions.length) * 100}%` }}
            ></div>
          </div>

          {/* Question Section */}
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">{currentQ.question}</h3>
            <div className="grid gap-3">
              {currentQ.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => !showResult && handleAnswerSelect(index)}
                  disabled={showResult}
                  className={`p-3 rounded-lg border-2 text-left transition-all duration-300 text-sm ${
                    showResult
                      ? index === currentQ.correctAnswer
                        ? 'border-green-500 bg-green-50 text-green-700'
                        : index === selectedAnswer && !isCorrect
                        ? 'border-red-500 bg-red-50 text-red-700'
                        : 'border-gray-200 bg-gray-50'
                      : 'border-gray-200 hover:border-blue-500 hover:bg-blue-50 cursor-pointer'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {showResult && index === currentQ.correctAnswer && (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    )}
                    {showResult && index === selectedAnswer && !isCorrect && (
                      <XCircle className="h-4 w-4 text-red-500" />
                    )}
                    <span className="font-medium">{option}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Compact Feedback Section */}
          {showResult && (
            <div className={`p-4 rounded-lg mb-4 ${isCorrect ? 'bg-green-50 border border-green-200' : 'bg-blue-50 border border-blue-200'}`}>
              <div className="flex items-center gap-2 mb-2">
                {isCorrect ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : (
                  <Star className="h-5 w-5 text-blue-500" />
                )}
                <h4 className="font-bold text-base">
                  {isCorrect ? 'Hebat! 🎉' : 'Kurang tepat 😓'}
                </h4>
                {isCorrect && (
                  <span className="text-green-600 font-semibold text-sm ml-auto">
                    +{currentQ.points} poin! ⭐
                  </span>
                )}
              </div>
              <p className="text-gray-700 text-sm">{currentQ.explanation}</p>
            </div>
          )}

          {/* Compact Action Button */}
          {showResult && (
            <div className="flex justify-end">
              <button
                onClick={handleNextQuestion}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2 text-sm"
              >
                {currentQuestion < selectedQuiz.questions.length - 1 ? 'Pertanyaan Selanjutnya' : 'Selesaikan Misi'}
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (quizCompleted) {
    if (!selectedQuiz) {
      console.error('Quiz completed but no quiz selected');
      resetQuiz();
      return null;
    }
    
    const totalQuestions = selectedQuiz.questions.length;
    const scorePercentage = Math.round((correctAnswers / totalQuestions) * 100);

    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-6 text-center">
          <div className="mb-4">
            {missionPassed ? (
              <>
                <Trophy className="h-12 w-12 text-yellow-500 mx-auto mb-3" />
                <h2 className="text-xl font-bold text-gray-800 mb-2">Misi Selesai! 🎉</h2>
                <p className="text-green-600 text-base font-semibold">Kamu berhasil dengan skor {scorePercentage}%!</p>
                <p className="text-blue-600 text-xs mt-1">🔓 Naik level! Misi baru mungkin sudah tersedia!</p>
              </>
            ) : (
              <>
                <Target className="h-12 w-12 text-orange-500 mx-auto mb-3" />
                <h2 className="text-xl font-bold text-gray-800 mb-2">Misi Belum Selesai 📚</h2>
                <p className="text-orange-600 text-base font-semibold">Skormu {scorePercentage}% - Perlu {selectedQuiz.requiredScore}% untuk lulus</p>
              </>
            )}
          </div>
          
          <div className="bg-gray-50 rounded-lg p-4 mb-4">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-lg font-bold text-blue-600">{correctAnswers}</div>
                <div className="text-xs text-gray-600">Benar</div>
              </div>
              <div>
                <div className="text-lg font-bold text-purple-600">{totalQuestions - correctAnswers}</div>
                <div className="text-xs text-gray-600">Salah</div>
              </div>
              <div>
                <div className="text-lg font-bold text-green-600">{missionPassed ? quizScore : 0}</div>
                <div className="text-xs text-gray-600">Poin Diperoleh</div>
              </div>
            </div>
          </div>

          {missionPassed ? (
            <div className="mb-4">
              <h3 className="font-bold text-gray-800 mb-1 text-sm">🎯 Misi Berhasil!</h3>
              <p className="text-gray-600 text-sm">
                Kamu telah menguasai "{selectedQuiz.title}" dan mendapat pengetahuan privasi yang berharga!
                Cek apakah ada misi baru yang tersedia untuk levelmu!
              </p>
            </div>
          ) : (
            <div className="mb-4">
              <h3 className="font-bold text-gray-800 mb-1 text-sm">💪 Terus Belajar!</h3>
              <p className="text-gray-600 text-sm">
                Kamu perlu menjawab {Math.ceil((selectedQuiz.requiredScore / 100) * totalQuestions)} dari {totalQuestions} pertanyaan dengan benar untuk lulus misi ini. 
                Pelajari lagi penjelasannya dan coba lagi!
              </p>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-2 justify-center">
            {!missionPassed && (
              <button
                onClick={retryQuiz}
                className="bg-orange-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-orange-700 transition-colors flex items-center gap-2 text-sm"
              >
                <Zap className="h-4 w-4" />
                Coba Lagi
              </button>
            )}
            <button
              onClick={resetQuiz}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors text-sm"
            >
              {missionPassed ? 'Pilih Misi Selanjutnya' : 'Kembali ke Misi'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Misi Utama 🎯</h2>
        <p className="text-gray-600 text-lg">Selesaikan misi seru untuk naik level dan jadi jagoan privasi!</p>
        <div className="mt-4 bg-blue-50 rounded-xl p-4 max-w-2xl mx-auto">
          <p className="text-blue-700 font-medium">
            💡 <strong>Aturan Misi:</strong> Jawab sebagian besar pertanyaan dengan benar untuk lulus dan naik level!
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {quizzes.map((quiz) => {
          const status = getQuizStatus(quiz);
          const isClickable = status === 'available' || status === 'completed';

          return (
            <div
              key={quiz.id}
              className={`bg-white rounded-2xl shadow-lg p-6 transition-all duration-300 border-2 ${getStatusColor(status)}`}
              onClick={() => isClickable && setSelectedQuiz(quiz)}
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-full ${
                  status === 'completed' ? 'bg-green-100' : 
                  status === 'available' ? 'bg-blue-100' : 'bg-gray-100'
                }`}>
                  {getStatusIcon(status)}
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-sm font-semibold px-3 py-1 rounded-full ${
                    status === 'completed' ? 'bg-green-100 text-green-600' : 
                    status === 'available' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-500'
                  }`}>
                    Level {quiz.level}
                  </span>
                  {status === 'completed' && (
                    <Award className="h-5 w-5 text-yellow-500" />
                  )}
                </div>
              </div>

              <h3 className="text-xl font-bold text-gray-800 mb-2">{quiz.title}</h3>
              <p className="text-gray-600 mb-4">{quiz.description}</p>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">{quiz.questions.length} pertanyaan</span>
                  <span className="text-gray-500">Perlu {quiz.requiredScore}% untuk lulus</span>
                </div>
                
                {status === 'completed' && (
                  <div className="text-green-600 font-semibold text-sm flex items-center gap-1">
                    <CheckCircle className="h-4 w-4" />
                    Misi Selesai! ✓
                  </div>
                )}
                
                {status === 'locked' && (
                  <div className="text-gray-400 text-sm flex items-center gap-1">
                    <Lock className="h-4 w-4" />
                    Perlu Level {quiz.requiredLevel}
                  </div>
                )}

                {status === 'available' && (
                  <div className="text-blue-600 font-semibold text-sm flex items-center gap-1">
                    <Target className="h-4 w-4" />
                    Siap dimulai!
                  </div>
                )}

                {status === 'completed' && (
                  <div className="text-green-600 font-semibold text-sm flex items-center gap-1">
                    <Zap className="h-4 w-4" />
                    Klik untuk mulai lagi!
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Progress Overview */}
      <div className="mt-12 bg-white rounded-2xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Progress Misimu 📊</h3>
        <div className="grid md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{userProgress.completedQuizzes.length}</div>
            <div className="text-sm text-gray-600">Misi Selesai</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">{quizzes.length - userProgress.completedQuizzes.length}</div>
            <div className="text-sm text-gray-600">Misi Tersisa</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{userProgress.level}</div>
            <div className="text-sm text-gray-600">Level Saat Ini</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-600">{userProgress.totalPoints}</div>
            <div className="text-sm text-gray-600">Total Poin</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizSystem;