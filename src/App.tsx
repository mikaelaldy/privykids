import React, { useState, useEffect } from 'react';
import { Shield, Star, Trophy, MessageCircle, Play, ChevronRight, Award, Lock, Eye, EyeOff, ArrowRight, Users, Target, Gamepad2, Brain, CheckCircle, Sparkles } from 'lucide-react';
import Dashboard from './components/Dashboard';
import QuizSystem from './components/QuizSystem';
import MiniGames from './components/MiniGames';
import Chatbot from './components/Chatbot';
import Navigation from './components/Navigation';
import LandingPage from './components/LandingPage';
import { UserProgress, Achievement } from './types';

function App() {
  const [currentView, setCurrentView] = useState('landing');
  const [userProgress, setUserProgress] = useState<UserProgress>({
    level: 1,
    totalPoints: 0,
    badges: [],
    completedQuizzes: [],
    completedGames: [],
    streakDays: 1
  });

  const [achievements] = useState<Achievement[]>([
    { id: 'first-steps', name: 'First Steps', description: 'Complete your first quiz!', icon: '🎯', unlocked: false },
    { id: 'password-pro', name: 'Password Pro', description: 'Master the Password Fortress game!', icon: '🔒', unlocked: false },
    { id: 'info-detective', name: 'Info Detective', description: 'Perfect score on Share or Shield!', icon: '🕵️', unlocked: false },
    { id: 'privacy-guardian', name: 'Privacy Guardian', description: 'Reach Level 5!', icon: '🛡️', unlocked: false },
    { id: 'curious-explorer', name: 'Curious Explorer', description: 'Ask your Privacy Pal 10 questions!', icon: '🤔', unlocked: false }
  ]);

  useEffect(() => {
    // Load saved progress from localStorage
    const savedProgress = localStorage.getItem('privykids-progress');
    if (savedProgress) {
      setUserProgress(JSON.parse(savedProgress));
    }
  }, []);

  useEffect(() => {
    // Save progress to localStorage
    localStorage.setItem('privykids-progress', JSON.stringify(userProgress));
  }, [userProgress]);

  const updateProgress = (updates: Partial<UserProgress>) => {
    setUserProgress(prev => ({
      ...prev,
      ...updates
    }));
  };

  const startAdventure = () => {
    setCurrentView('dashboard');
  };

  if (currentView === 'landing') {
    return <LandingPage onStartAdventure={startAdventure} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 font-nunito">
      <div className="container mx-auto px-4 py-6">
        <header className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="bg-blue-600 p-3 rounded-full shadow-lg">
              <Shield className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Privykids
            </h1>
          </div>
          <p className="text-lg text-gray-600 font-medium">Your Digital Privacy Academy Adventure!</p>
        </header>

        <Navigation currentView={currentView} setCurrentView={setCurrentView} />

        <main className="mt-8">
          {currentView === 'dashboard' && (
            <Dashboard 
              userProgress={userProgress} 
              achievements={achievements}
              setCurrentView={setCurrentView}
            />
          )}
          {currentView === 'quizzes' && (
            <QuizSystem 
              userProgress={userProgress} 
              updateProgress={updateProgress}
            />
          )}
          {currentView === 'games' && (
            <MiniGames 
              userProgress={userProgress} 
              updateProgress={updateProgress}
            />
          )}
          {currentView === 'chatbot' && (
            <Chatbot 
              userProgress={userProgress} 
              updateProgress={updateProgress}
            />
          )}
        </main>
      </div>
    </div>
  );
}

export default App;