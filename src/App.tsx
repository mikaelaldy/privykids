import React, { useState, useEffect } from 'react';
import { Shield } from 'lucide-react';
import Dashboard from './components/Dashboard';
import QuizSystem from './components/QuizSystem';
import MiniGames from './components/MiniGames';
import Chatbot from './components/Chatbot';
import Navigation from './components/Navigation';
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
    { id: 'first-steps', name: 'First Steps', description: 'Complete your first quiz!', icon: '🎯', unlocked: false },
    { id: 'password-pro', name: 'Password Pro', description: 'Master the Password Fortress game!', icon: '🔒', unlocked: false },
    { id: 'info-detective', name: 'Info Detective', description: 'Perfect score on Share or Shield!', icon: '🕵️', unlocked: false },
    { id: 'privacy-guardian', name: 'Privacy Guardian', description: 'Reach Level 5!', icon: '🛡️', unlocked: false },
    { id: 'curious-explorer', name: 'Curious Explorer', description: 'Ask your Privacy Pal 10 questions!', icon: '🤔', unlocked: false }
  ]);

  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    console.log('🚀 Initializing Privykids app...');
    
    try {
      // Validate Azure configuration
      const configValidation = logConfigStatus();

      // Check service availability in background
      const [cosmosStatus, openAIStatus] = await Promise.all([
        cosmosDbService.getServiceStatus(),
        openAIService.getServiceStatus()
      ]);

      setServicesAvailable({
        cosmosDb: cosmosStatus.available,
        openAI: openAIStatus.available
      });

      // Load user progress
      if (cosmosStatus.available) {
        console.log('📊 Loading progress from Cosmos DB...');
        const result = await cosmosDbService.getUserProgress();
        
        if (result.success && result.data) {
          setUserProgress(result.data);
          console.log('✅ Progress loaded successfully');
        } else {
          console.warn('⚠️ Failed to load from Cosmos DB, using fallback');
        }
      } else {
        console.log('📱 Loading progress from localStorage fallback...');
        const savedProgress = localStorage.getItem('privykids-progress');
        if (savedProgress) {
          setUserProgress(JSON.parse(savedProgress));
        }
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
      if (servicesAvailable.cosmosDb) {
        console.log('💾 Saving progress to Cosmos DB...');
        const result = await cosmosDbService.updateUserProgress(newProgress);
        
        if (result.success) {
          console.log('✅ Progress saved to Cosmos DB');
        } else {
          console.warn('⚠️ Cosmos DB save failed, using localStorage backup');
        }
      } else {
        console.log('📱 Saving progress to localStorage (offline mode)');
        localStorage.setItem('privykids-progress', JSON.stringify(newProgress));
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
              isOnline={servicesAvailable.openAI}
            />
          )}
        </main>
      </div>
    </div>
  );
}

export default App;