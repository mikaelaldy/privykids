import React, { useState } from 'react';
import { Shield, Menu, X, Home, Brain, Gamepad2, MessageCircle, ArrowLeft } from 'lucide-react';

interface AppNavbarProps {
  currentView: string;
  setCurrentView: (view: string) => void;
  onBackToLanding?: () => void;
}

const AppNavbar: React.FC<AppNavbarProps> = ({ currentView, setCurrentView, onBackToLanding }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Beranda', icon: Home },
    { id: 'quizzes', label: 'Misi', icon: Brain },
    { id: 'games', label: 'Permainan', icon: Gamepad2 },
    { id: 'chatbot', label: 'Teman Privasi', icon: MessageCircle }
  ];

  const handleNavClick = (viewId: string) => {
    setCurrentView(viewId);
    setIsMenuOpen(false);
  };

  const handleBackToLanding = () => {
    if (onBackToLanding) {
      onBackToLanding();
    }
    setIsMenuOpen(false);
  };

  return (
    <nav className="bg-white rounded-2xl shadow-lg mb-8">
      <div className="px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo/Brand */}
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-blue-600 to-purple-600 p-2 rounded-xl shadow-lg">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Privykids
              </h1>
              <p className="text-sm text-gray-600">Akademi Privasi Digital Petualanganmu!</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-4">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all duration-300 ${
                    currentView === item.id
                      ? 'bg-blue-600 text-white shadow-lg transform scale-105'
                      : 'text-gray-600 hover:bg-blue-50 hover:text-blue-600'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span className="text-xs font-semibold">{item.label}</span>
                </button>
              );
            })}
            
            {/* Back to Landing Button */}
            <button
              onClick={handleBackToLanding}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-300 transform hover:scale-105 shadow-lg text-sm"
            >
              <ArrowLeft className="h-4 w-4" />
              Kembali
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            {isMenuOpen ? (
              <X className="h-6 w-6 text-gray-700" />
            ) : (
              <Menu className="h-6 w-6 text-gray-700" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pt-4 border-t border-gray-100">
            <div className="grid grid-cols-2 gap-2 mb-4">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className={`flex flex-col items-center gap-2 p-3 rounded-xl transition-all duration-300 ${
                      currentView === item.id
                        ? 'bg-blue-600 text-white shadow-lg'
                        : 'text-gray-600 hover:bg-blue-50 hover:text-blue-600'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="text-xs font-semibold">{item.label}</span>
                  </button>
                );
              })}
            </div>
            
            {/* Mobile Back to Landing Button */}
            <button
              onClick={handleBackToLanding}
              className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-lg"
            >
              <ArrowLeft className="h-4 w-4" />
              Kembali ke Landing Page
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default AppNavbar; 