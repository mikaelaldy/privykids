import React, { useState, useEffect } from 'react';
import { Shield } from 'lucide-react';
import Dashboard from './components/Dashboard';
import QuizSystem from './components/QuizSystem';
import MiniGames from './components/MiniGames';
import Chatbot from './components/Chatbot';
import AppNavbar from './components/AppNavbar';
import LandingPage from './components/LandingPage';
import { UserProgress, Achievement } from './types';
import { cosmosDbService } from './services/cosmosDbService';
import { openAIService } from './services/openAIService';
import { logConfigStatus } from './config/azure';

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
  const [servicesAvailable, setServicesAvailable] = useState({
    cosmosDb: false,
    openAI: false
  });

  const [achievements] = useState<Achievement[]>([
    { id: 'first-steps', name: 'Langkah Pertama', description: 'Selesaikan kuis pertamamu!', icon: '🎯', unlocked: false },
    { id: 'password-pro', name: 'Ahli Kata Sandi', description: 'Kuasai permainan Benteng Password!', icon: '🔒', unlocked: false },
    { id: 'info-detective', name: 'Detektif Informasi', description: 'Skor sempurna di Share or Shield!', icon: '🕵️', unlocked: false },
    { id: 'privacy-guardian', name: 'Penjaga Privasi', description: 'Capai Level 5!', icon: '🛡️', unlocked: false },
    { id: 'curious-explorer', name: 'Penjelajah Penasaran', description: 'Tanya Teman Privasi 10 pertanyaan!', icon: '🤔', unlocked: false }
  ]);

  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    console.log('🚀 Initializing Privykids app...');
    
    try {
      // Log Azure configuration status
      const configStatus = logConfigStatus();

      // Set service availability based on configuration
      setServicesAvailable({
        cosmosDb: configStatus.cosmosDbAvailable,
        openAI: configStatus.openAIAvailable
      });

      // Load user progress
      console.log('📊 Loading user progress...');
      const result = await cosmosDbService.getUserProgress();
      
      if (result.success && result.data) {
        setUserProgress(result.data);
        console.log('✅ Progress loaded successfully');
      } else {
        console.warn('⚠️ Using default progress');
      }
    } catch (error) {
      console.error('💥 App initialization error:', error);
      
      // Fallback to localStorage
      const savedProgress = localStorage.getItem('privykids-progress');
      if (savedProgress) {
        setUserProgress(JSON.parse(savedProgress));
      }
    }
    
    console.log('✨ App initialization complete!');
  };

  const updateProgress = async (updates: Partial<UserProgress>) => {
    const newProgress = {
      ...userProgress,
      ...updates
    };
    
    setUserProgress(newProgress);

    try {
      console.log('💾 Saving progress...');
      const result = await cosmosDbService.updateUserProgress(newProgress);
      
      if (result.success) {
        console.log('✅ Progress saved successfully');
      } else {
        console.warn('⚠️ Progress saved to localStorage only');
      }
    } catch (error) {
      console.error('❌ Failed to save progress:', error);
      // Always save to localStorage as backup
      localStorage.setItem('privykids-progress', JSON.stringify(newProgress));
    }
  };

  const startAdventure = () => {
    setCurrentView('dashboard');
  };

  const backToLanding = () => {
    setCurrentView('landing');
  };

  if (currentView === 'landing') {
    return <LandingPage onStartAdventure={startAdventure} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 font-nunito">
      <div className="container mx-auto px-4 py-6">
        <AppNavbar 
          currentView={currentView} 
          setCurrentView={setCurrentView}
          onBackToLanding={backToLanding}
        />

        <main>
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
              isOnline={servicesAvailable.openAI}
            />
          )}
        </main>
      </div>
    </div>
  );
}

export default App;