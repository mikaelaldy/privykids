import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles, Shield, MessageCircle } from 'lucide-react';
import { UserProgress } from '../types';

interface ChatbotProps {
  userProgress: UserProgress;
  updateProgress: (updates: Partial<UserProgress>) => void;
}

interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
}

const Chatbot: React.FC<ChatbotProps> = ({ userProgress, updateProgress }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'bot',
      content: `Hi there, Privacy Cadet! 🤖 I'm your Privacy Pal, and I'm here to help you learn about staying safe online! 

I can answer questions about passwords, personal information, online safety, and much more. What would you like to know? 🛡️`,
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const dailyTips = [
    "🔐 Tip: Use different passwords for different accounts - it's like having different keys for different doors!",
    "👀 Tip: Never share your personal information like your address or phone number with strangers online!",
    "🤔 Tip: Before clicking on links, ask yourself: 'Do I trust where this is taking me?'",
    "📱 Tip: Always tell a trusted adult if someone online makes you feel uncomfortable!",
    "🛡️ Tip: Your real name, age, and school are special information - keep them private online!"
  ];

  const quickResponses = {
    'password': "Great question about passwords! 🔐 A strong password is like a super-strong lock on your digital door. It should have:\n\n• Uppercase letters (A, B, C...)\n• Lowercase letters (a, b, c...)\n• Numbers (1, 2, 3...)\n• Special symbols (!@#$...)\n• At least 8 characters long\n\nNever use the same password for everything - that's like using the same key for your house, bike, and locker!",
    
    'personal information': "Personal information is any detail that could help someone identify or find you! 🕵️ This includes:\n\n• Your real name\n• Your address\n• Your phone number\n• Your school name\n• Your birthday\n• Photos of you\n\nThink of this information as your 'secret identity' - only share it with people you trust in real life!",
    
    'phishing': "Phishing is when bad people try to trick you into giving them your personal information! 🎣 They might:\n\n• Send fake emails that look real\n• Create fake websites\n• Ask for your passwords\n• Promise free stuff to get your info\n\nRemember: If something seems too good to be true, it probably is! Always ask a trusted adult before clicking links or sharing information.",
    
    'social media': "Social media can be fun, but stay safe! 📱 Here are my top tips:\n\n• Never share your real location\n• Don't accept friend requests from strangers\n• Think before you post - will you be proud of this in 5 years?\n• Use privacy settings to control who sees your posts\n• Tell a trusted adult if anyone makes you uncomfortable\n\nRemember: Once something is online, it stays online forever!",
    
    'cookies': "Website cookies aren't the yummy kind! 🍪 They're tiny files that websites use to remember information about you, like:\n\n• What language you prefer\n• Items in your shopping cart\n• Your login status\n\nMost cookies are harmless, but some track what you do online. That's why it's good to clear your cookies sometimes and ask an adult to help you check your privacy settings!"
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const generateBotResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();

    // Check for keywords in the user's message
    for (const [keyword, response] of Object.entries(quickResponses)) {
      if (lowerMessage.includes(keyword)) {
        return response;
      }
    }

    // Generic encouraging responses
    const genericResponses = [
      "That's a really smart question! 🌟 Online safety is super important. Here's what I think: Always remember that your personal information is like treasure - keep it safe and only share it with people you trust in real life!",
      
      "You're doing great by asking questions! 🎯 Learning about digital safety is like becoming a superhero - the more you know, the better you can protect yourself and others online!",
      
      "Excellent question! 🤔 Remember the golden rule of the internet: When in doubt, don't share it out! If you're ever unsure about something online, ask a trusted adult for help.",
      
      "I love that you're thinking about online safety! 🛡️ Here's a quick tip: Treat your personal information like your most precious belongings - you wouldn't give those to strangers, right?",
      
      "That's the kind of question a true Privacy Guardian would ask! 🏆 Remember: being careful online isn't about being scared - it's about being smart and prepared!"
    ];

    return genericResponses[Math.floor(Math.random() * genericResponses.length)];
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate typing delay
    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: generateBotResponse(inputValue),
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  const sendQuickTip = () => {
    const randomTip = dailyTips[Math.floor(Math.random() * dailyTips.length)];
    const tipMessage: Message = {
      id: Date.now().toString(),
      type: 'bot',
      content: `Here's your daily privacy tip! ✨\n\n${randomTip}`,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, tipMessage]);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
          <div className="flex items-center gap-4">
            <div className="bg-white/20 p-3 rounded-full">
              <Bot className="h-8 w-8" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Privacy Pal 🤖</h2>
              <p className="text-blue-100">Your friendly digital safety assistant!</p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="p-4 bg-gray-50 border-b">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={sendQuickTip}
              className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold hover:bg-blue-200 transition-colors flex items-center gap-2"
            >
              <Sparkles className="h-4 w-4" />
              Daily Tip
            </button>
            <button
              onClick={() => setInputValue("How do I create a strong password?")}
              className="bg-purple-100 text-purple-700 px-4 py-2 rounded-full text-sm font-semibold hover:bg-purple-200 transition-colors"
            >
              Password Help
            </button>
            <button
              onClick={() => setInputValue("What information should I keep private?")}
              className="bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-semibold hover:bg-green-200 transition-colors"
            >
              Privacy Basics
            </button>
          </div>
        </div>

        {/* Chat Messages */}
        <div className="h-96 overflow-y-auto p-6 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${message.type === 'user' ? 'flex-row-reverse' : ''}`}
            >
              <div className={`p-2 rounded-full flex-shrink-0 ${
                message.type === 'user' 
                  ? 'bg-blue-600' 
                  : 'bg-gradient-to-br from-purple-500 to-blue-500'
              }`}>
                {message.type === 'user' ? (
                  <User className="h-5 w-5 text-white" />
                ) : (
                  <Bot className="h-5 w-5 text-white" />
                )}
              </div>
              <div className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
                message.type === 'user'
                  ? 'bg-blue-600 text-white ml-auto'
                  : 'bg-gray-100 text-gray-800'
              }`}>
                <p className="whitespace-pre-line leading-relaxed">{message.content}</p>
                <p className={`text-xs mt-2 ${
                  message.type === 'user' ? 'text-blue-100' : 'text-gray-500'
                }`}>
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex gap-3">
              <div className="p-2 rounded-full bg-gradient-to-br from-purple-500 to-blue-500">
                <Bot className="h-5 w-5 text-white" />
              </div>
              <div className="bg-gray-100 px-4 py-3 rounded-2xl">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 border-t bg-gray-50">
          <div className="flex gap-3">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me anything about staying safe online! 🛡️"
              className="flex-1 px-4 py-3 rounded-2xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              onClick={handleSendMessage}
              disabled={!inputValue.trim()}
              className="bg-blue-600 text-white p-3 rounded-2xl hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="h-5 w-5" />
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-2 text-center">
            Privacy Pal is here to help you learn! Always ask a trusted adult for important decisions. 🤗
          </p>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;