import React from 'react';
import { Home, Brain, Gamepad2, MessageCircle } from 'lucide-react';

interface NavigationProps {
  currentView: string;
  setCurrentView: (view: string) => void;
}

const Navigation: React.FC<NavigationProps> = ({ currentView, setCurrentView }) => {
  const navItems = [
    { id: 'dashboard', label: 'Beranda', icon: Home },
    { id: 'quizzes', label: 'Misi', icon: Brain },
    { id: 'games', label: 'Permainan', icon: Gamepad2 },
    { id: 'chatbot', label: 'Teman Privasi', icon: MessageCircle }
  ];

  return (
    <nav className="bg-white rounded-2xl shadow-lg p-2">
      <div className="flex justify-center gap-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentView(item.id)}
              className={`flex flex-col items-center gap-2 px-6 py-4 rounded-xl transition-all duration-300 ${
                currentView === item.id
                  ? 'bg-blue-600 text-white shadow-lg transform scale-105'
                  : 'text-gray-600 hover:bg-blue-50 hover:text-blue-600'
              }`}
            >
              <Icon className="h-6 w-6" />
              <span className="text-sm font-semibold">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default Navigation;