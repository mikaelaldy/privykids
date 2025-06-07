import React, { useState } from 'react';
import { Shield, Menu, X, HelpCircle, Star, Users } from 'lucide-react';

interface LandingNavbarProps {
  onStartAdventure: () => void;
  onNavigateToSection: (section: string) => void;
}

const LandingNavbar: React.FC<LandingNavbarProps> = ({ onStartAdventure, onNavigateToSection }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { id: 'fitur', label: 'Fitur', icon: Star },
    { id: 'faq', label: 'FAQ', icon: HelpCircle },
    { id: 'untuk-orang-tua', label: 'Untuk Orang Tua', icon: Users }
  ];

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setIsMenuOpen(false);
  };

  const handleNavClick = (sectionId: string) => {
    onNavigateToSection(sectionId);
    setIsMenuOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-100">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo/Brand */}
          <button
            onClick={scrollToTop}
            className="flex items-center gap-3 hover:opacity-80 transition-opacity"
          >
            <div className="bg-gradient-to-br from-blue-600 to-purple-600 p-2 rounded-xl shadow-lg">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Privykids
            </span>
          </button>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition-colors font-medium"
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </button>
              );
            })}
            
            {/* CTA Button */}
            <button
              onClick={onStartAdventure}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              Mulai Petualangan!
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
          <div className="md:hidden py-4 border-t border-gray-100 bg-white">
            <div className="space-y-4">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className="flex items-center gap-3 w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <Icon className="h-5 w-5 text-blue-600" />
                    <span className="font-medium text-gray-700">{item.label}</span>
                  </button>
                );
              })}
              
              {/* Mobile CTA Button */}
              <div className="pt-4 border-t border-gray-100">
                <button
                  onClick={onStartAdventure}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg"
                >
                  Mulai Petualangan!
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default LandingNavbar; 