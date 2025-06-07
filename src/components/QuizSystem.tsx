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
      title: 'Privacy Basics',
      description: 'Learn what personal information is and why it matters',
      level: 1,
      requiredLevel: 1,
      requiredScore: 60, // Need 3/5 questions correct (60%)
      questions: [
        {
          id: 'q1',
          question: 'Which of these is considered personal information?',
          options: ['Your favorite color', 'Your full name', 'Your favorite movie', 'Your pet\'s breed'],
          correctAnswer: 1,
          explanation: 'Your full name is personal information because it can identify you specifically! Keep it safe and only share with trusted people.',
          points: 20
        },
        {
          id: 'q2',
          question: 'Who should you share your home address with online?',
          options: ['Anyone who asks nicely', 'Only people you know in real life', 'Everyone on social media', 'No one, unless it\'s necessary and with a trusted adult'],
          correctAnswer: 3,
          explanation: 'Your address is very private information! Only share it when absolutely necessary and always with a trusted adult\'s permission.',
          points: 20
        },
        {
          id: 'q3',
          question: 'What is a digital footprint?',
          options: ['Footprints you make while using a computer', 'The trail of information you leave online', 'A special type of shoe for gamers', 'Pictures of feet on the internet'],
          correctAnswer: 1,
          explanation: 'A digital footprint is all the information about you that exists online - like comments, photos, and searches! It follows you everywhere.',
          points: 20
        },
        {
          id: 'q4',
          question: 'If someone online asks for your school name, you should:',
          options: ['Tell them right away', 'Ask a trusted adult first', 'Only tell them if they seem nice', 'Share it on social media'],
          correctAnswer: 1,
          explanation: 'Always ask a trusted adult before sharing information about where you go to school. This helps keep you safe!',
          points: 20
        },
        {
          id: 'q5',
          question: 'Which of these is the safest to share online?',
          options: ['Your phone number', 'Your favorite book', 'Your birthday', 'Your home address'],
          correctAnswer: 1,
          explanation: 'Your favorite book is safe to share! It\'s a great way to connect with others who like the same things without revealing personal details.',
          points: 20
        }
      ]
    },
    {
      id: 'password-power',
      title: 'Password Power',
      description: 'Master the art of creating strong, secure passwords',
      level: 2,
      requiredLevel: 1, // Only need to complete Privacy Basics
      requiredScore: 75, // Need 3/4 questions correct (75%)
      questions: [
        {
          id: 'p1',
          question: 'Which password is strongest?',
          options: ['password123', 'MyP@ssw0rd!2024', '12345678', 'qwerty'],
          correctAnswer: 1,
          explanation: 'Strong passwords have uppercase letters, lowercase letters, numbers, and symbols! They\'re like super-strong locks for your accounts.',
          points: 25
        },
        {
          id: 'p2',
          question: 'Should you use the same password for everything?',
          options: ['Yes, it\'s easier to remember', 'No, use different passwords for different accounts', 'Only for important accounts', 'It doesn\'t matter'],
          correctAnswer: 1,
          explanation: 'Using different passwords keeps your accounts safer! If one gets compromised, the others stay protected.',
          points: 25
        },
        {
          id: 'p3',
          question: 'What should you do if you forget your password?',
          options: ['Use the same password for everything', 'Ask a friend to help you guess it', 'Use the "forgot password" feature', 'Write it on a sticky note'],
          correctAnswer: 2,
          explanation: 'The "forgot password" feature is the safest way to reset your password! It sends a secure link to your email.',
          points: 25
        },
        {
          id: 'p4',
          question: 'Who should you share your passwords with?',
          options: ['Your best friend', 'Your teacher', 'A trusted adult like a parent', 'Anyone who asks'],
          correctAnswer: 2,
          explanation: 'Only share passwords with trusted adults like parents or guardians who help keep you safe online!',
          points: 25
        }
      ]
    },
    {
      id: 'phishing-detective',
      title: 'Phishing Detective',
      description: 'Learn to spot and avoid online tricks and scams',
      level: 3,
      requiredLevel: 1, // Only need to complete Privacy Basics
      requiredScore: 70, // Need 3/4 questions correct (70%)
      questions: [
        {
          id: 'ph1',
          question: 'What is phishing?',
          options: ['Catching fish online', 'Tricks to steal your information', 'A new social media app', 'A computer game'],
          correctAnswer: 1,
          explanation: 'Phishing is when bad actors try to trick you into giving them your personal information! They pretend to be someone trustworthy.',
          points: 25
        },
        {
          id: 'ph2',
          question: 'You receive an email saying "You won $1000! Click here!" What should you do?',
          options: ['Click immediately!', 'Ask a trusted adult first', 'Share it with friends', 'Reply with your information'],
          correctAnswer: 1,
          explanation: 'This sounds like a phishing scam! Always ask a trusted adult before clicking suspicious links or claiming prizes.',
          points: 25
        },
        {
          id: 'ph3',
          question: 'A website asks for your password to "verify your account." What\'s the safest action?',
          options: ['Enter your password right away', 'Check with a trusted adult', 'Give them a fake password', 'Share your username only'],
          correctAnswer: 1,
          explanation: 'Legitimate websites rarely ask you to verify by entering your password in emails or pop-ups. Always check with a trusted adult!',
          points: 25
        },
        {
          id: 'ph4',
          question: 'How can you tell if a website is safe?',
          options: ['It has lots of colors', 'It has "https://" and a lock icon', 'It loads quickly', 'It has many ads'],
          correctAnswer: 1,
          explanation: 'Look for "https://" and a lock icon in your browser! These show the website is using secure encryption to protect your information.',
          points: 25
        }
      ]
    },
    {
      id: 'social-media-safety',
      title: 'Social Media Safety',
      description: 'Navigate social platforms like a privacy pro',
      level: 4,
      requiredLevel: 1, // Only need to complete Privacy Basics
      requiredScore: 80, // Need 4/5 questions correct (80%)
      questions: [
        {
          id: 's1',
          question: 'What should you do before posting a photo online?',
          options: ['Post it immediately', 'Think about who might see it', 'Add your location', 'Tag everyone you know'],
          correctAnswer: 1,
          explanation: 'Always think before you post! Once something is online, it can be seen by many people and stay there forever.',
          points: 20
        },
        {
          id: 's2',
          question: 'Someone you don\'t know wants to be your friend online. You should:',
          options: ['Accept immediately', 'Ask a trusted adult first', 'Accept if they seem nice', 'Ignore them completely'],
          correctAnswer: 1,
          explanation: 'Always ask a trusted adult before accepting friend requests from people you don\'t know in real life!',
          points: 20
        },
        {
          id: 's3',
          question: 'What information should you keep private on social media?',
          options: ['Your favorite color', 'Your school name and location', 'Your favorite movies', 'Your hobbies'],
          correctAnswer: 1,
          explanation: 'Keep your school name and location private! This information could help strangers find you in real life.',
          points: 20
        },
        {
          id: 's4',
          question: 'If someone online is being mean to you, what should you do?',
          options: ['Be mean back', 'Tell a trusted adult', 'Keep it secret', 'Post about it publicly'],
          correctAnswer: 1,
          explanation: 'Always tell a trusted adult if someone is being mean online! They can help you handle the situation safely.',
          points: 20
        },
        {
          id: 's5',
          question: 'What are privacy settings for?',
          options: ['Making your profile look cool', 'Controlling who can see your posts', 'Getting more followers', 'Making posts load faster'],
          correctAnswer: 1,
          explanation: 'Privacy settings help you control who can see your posts and information! They\'re like choosing who can come into your digital room.',
          points: 20
        }
      ]
    }
  ];

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
    setShowResult(true);
    
    const currentQ = selectedQuiz!.questions[currentQuestion];
    if (answerIndex === currentQ.correctAnswer) {
      setQuizScore(prev => prev + currentQ.points);
      setCorrectAnswers(prev => prev + 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestion < selectedQuiz!.questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      completeQuiz();
    }
  };

  const completeQuiz = () => {
    const totalQuestions = selectedQuiz!.questions.length;
    const scorePercentage = (correctAnswers / totalQuestions) * 100;
    const passed = scorePercentage >= selectedQuiz!.requiredScore;
    
    setMissionPassed(passed);
    
    if (passed) {
      const newCompletedQuizzes = [...userProgress.completedQuizzes, selectedQuiz!.id];
      const newTotalPoints = userProgress.totalPoints + quizScore;
      
      // Calculate new level based on completed quizzes, not just points
      let newLevel = userProgress.level;
      if (selectedQuiz!.id === 'privacy-basics' && !userProgress.completedQuizzes.includes('privacy-basics')) {
        newLevel = Math.max(newLevel, 2); // Unlock level 2 after completing Privacy Basics
      }
      if (selectedQuiz!.id === 'password-power' && !userProgress.completedQuizzes.includes('password-power')) {
        newLevel = Math.max(newLevel, 3); // Unlock level 3 after completing Password Power
      }
      if (selectedQuiz!.id === 'phishing-detective' && !userProgress.completedQuizzes.includes('phishing-detective')) {
        newLevel = Math.max(newLevel, 4); // Unlock level 4 after completing Phishing Detective
      }
      if (selectedQuiz!.id === 'social-media-safety' && !userProgress.completedQuizzes.includes('social-media-safety')) {
        newLevel = Math.max(newLevel, 5); // Unlock level 5 after completing Social Media Safety
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
    
    // Special logic for unlocking quizzes
    if (quiz.id === 'privacy-basics') {
      return 'available'; // Always available as the first mission
    }
    
    // For other quizzes, check if Privacy Basics is completed
    const privacyBasicsCompleted = userProgress.completedQuizzes.includes('privacy-basics');
    if (privacyBasicsCompleted) {
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
        return 'border-green-500 bg-green-50';
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
        <div className="bg-white rounded-3xl shadow-xl p-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">{selectedQuiz.title}</h2>
              <p className="text-gray-600">Mission Level {selectedQuiz.level}</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-center">
                <span className="text-sm font-semibold text-gray-600">
                  Question {currentQuestion + 1} of {selectedQuiz.questions.length}
                </span>
                <div className="text-xs text-gray-500">
                  Need {Math.ceil((selectedQuiz.requiredScore / 100) * selectedQuiz.questions.length)} correct to pass
                </div>
              </div>
              <div className="bg-blue-100 px-3 py-1 rounded-full">
                <span className="text-blue-600 font-semibold">{correctAnswers}/{selectedQuiz.questions.length} ✓</span>
              </div>
            </div>
          </div>

          <div className="bg-gray-200 rounded-full h-3 mb-8">
            <div 
              className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-500"
              style={{ width: `${((currentQuestion + 1) / selectedQuiz.questions.length) * 100}%` }}
            ></div>
          </div>

          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-800 mb-6">{currentQ.question}</h3>
            <div className="grid gap-4">
              {currentQ.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => !showResult && handleAnswerSelect(index)}
                  disabled={showResult}
                  className={`p-4 rounded-xl border-2 text-left transition-all duration-300 ${
                    showResult
                      ? index === currentQ.correctAnswer
                        ? 'border-green-500 bg-green-50 text-green-700'
                        : index === selectedAnswer && !isCorrect
                        ? 'border-red-500 bg-red-50 text-red-700'
                        : 'border-gray-200 bg-gray-50'
                      : 'border-gray-200 hover:border-blue-500 hover:bg-blue-50 cursor-pointer'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {showResult && index === currentQ.correctAnswer && (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    )}
                    {showResult && index === selectedAnswer && !isCorrect && (
                      <XCircle className="h-5 w-5 text-red-500" />
                    )}
                    <span className="font-medium">{option}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {showResult && (
            <div className={`p-6 rounded-xl mb-6 ${isCorrect ? 'bg-green-50 border border-green-200' : 'bg-blue-50 border border-blue-200'}`}>
              <div className="flex items-center gap-3 mb-3">
                {isCorrect ? (
                  <CheckCircle className="h-6 w-6 text-green-500" />
                ) : (
                  <Star className="h-6 w-6 text-blue-500" />
                )}
                <h4 className="font-bold text-lg">
                  {isCorrect ? 'Excellent! 🎉' : 'Good try! 💪'}
                </h4>
              </div>
              <p className="text-gray-700 mb-3">{currentQ.explanation}</p>
              {isCorrect && (
                <div className="text-green-600 font-semibold">
                  +{currentQ.points} points! ⭐
                </div>
              )}
            </div>
          )}

          {showResult && (
            <div className="flex justify-end">
              <button
                onClick={handleNextQuestion}
                className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                {currentQuestion < selectedQuiz.questions.length - 1 ? 'Next Question' : 'Complete Mission'}
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (quizCompleted) {
    const totalQuestions = selectedQuiz!.questions.length;
    const scorePercentage = Math.round((correctAnswers / totalQuestions) * 100);

    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-3xl shadow-xl p-8 text-center">
          <div className="mb-6">
            {missionPassed ? (
              <>
                <Trophy className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
                <h2 className="text-3xl font-bold text-gray-800 mb-2">Mission Complete! 🎉</h2>
                <p className="text-green-600 text-lg font-semibold">You passed with {scorePercentage}%!</p>
                <p className="text-blue-600 text-sm mt-2">🔓 New missions unlocked!</p>
              </>
            ) : (
              <>
                <Target className="h-16 w-16 text-orange-500 mx-auto mb-4" />
                <h2 className="text-3xl font-bold text-gray-800 mb-2">Mission Incomplete 📚</h2>
                <p className="text-orange-600 text-lg font-semibold">You scored {scorePercentage}% - Need {selectedQuiz!.requiredScore}% to pass</p>
              </>
            )}
          </div>
          
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 mb-6">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-blue-600">{correctAnswers}</div>
                <div className="text-sm text-gray-600">Correct</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-600">{totalQuestions - correctAnswers}</div>
                <div className="text-sm text-gray-600">Incorrect</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">{missionPassed ? quizScore : 0}</div>
                <div className="text-sm text-gray-600">Points Earned</div>
              </div>
            </div>
          </div>

          {missionPassed ? (
            <div className="mb-6">
              <h3 className="font-bold text-gray-800 mb-2">🎯 Mission Accomplished!</h3>
              <p className="text-gray-600">
                You've mastered "{selectedQuiz!.title}" and earned valuable privacy knowledge!
                All other missions are now available to explore!
              </p>
            </div>
          ) : (
            <div className="mb-6">
              <h3 className="font-bold text-gray-800 mb-2">💪 Keep Learning!</h3>
              <p className="text-gray-600">
                You need to get {Math.ceil((selectedQuiz!.requiredScore / 100) * totalQuestions)} out of {totalQuestions} questions correct to pass this mission. 
                Review the explanations and try again!
              </p>
            </div>
          )}

          <div className="flex gap-4 justify-center">
            {!missionPassed && (
              <button
                onClick={retryQuiz}
                className="bg-orange-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-orange-700 transition-colors flex items-center gap-2"
              >
                <Zap className="h-4 w-4" />
                Try Again
              </button>
            )}
            <button
              onClick={resetQuiz}
              className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors"
            >
              {missionPassed ? 'Choose Next Mission' : 'Back to Missions'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Knowledge Missions 🎯</h2>
        <p className="text-gray-600 text-lg">Complete Privacy Basics first to unlock all other missions!</p>
        <div className="mt-4 bg-blue-50 rounded-xl p-4 max-w-2xl mx-auto">
          <p className="text-blue-700 font-medium">
            💡 <strong>Mission Rules:</strong> You need to answer most questions correctly to pass each mission and unlock the next one!
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {quizzes.map((quiz) => {
          const status = getQuizStatus(quiz);
          const isClickable = status === 'available';

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
                  <span className="text-gray-500">{quiz.questions.length} questions</span>
                  <span className="text-gray-500">Need {quiz.requiredScore}% to pass</span>
                </div>
                
                {status === 'completed' && (
                  <div className="text-green-600 font-semibold text-sm flex items-center gap-1">
                    <CheckCircle className="h-4 w-4" />
                    Mission Completed! ✓
                  </div>
                )}
                
                {status === 'locked' && (
                  <div className="text-gray-400 text-sm flex items-center gap-1">
                    <Lock className="h-4 w-4" />
                    Complete Privacy Basics first
                  </div>
                )}

                {status === 'available' && (
                  <div className="text-blue-600 font-semibold text-sm flex items-center gap-1">
                    <Target className="h-4 w-4" />
                    Ready to start!
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Progress Overview */}
      <div className="mt-12 bg-white rounded-2xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Your Mission Progress 📊</h3>
        <div className="grid md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{userProgress.completedQuizzes.length}</div>
            <div className="text-sm text-gray-600">Missions Completed</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">{quizzes.length - userProgress.completedQuizzes.length}</div>
            <div className="text-sm text-gray-600">Missions Remaining</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{userProgress.level}</div>
            <div className="text-sm text-gray-600">Current Level</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-600">{userProgress.totalPoints}</div>
            <div className="text-sm text-gray-600">Total Points</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizSystem;