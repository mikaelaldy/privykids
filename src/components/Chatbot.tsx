import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles, RotateCcw, Zap } from 'lucide-react';
import { UserProgress } from '../types';
import { openAIService, ChatMessage } from '../services/openAIService';

interface ChatbotProps {
  userProgress: UserProgress;
  updateProgress: (updates: Partial<UserProgress>) => void;
  isOnline?: boolean;
}

interface DisplayMessage extends ChatMessage {
  id: string;
  isTyping?: boolean;
}

const Chatbot: React.FC<ChatbotProps> = ({ userProgress, updateProgress, isOnline = true }) => {
  const [messages, setMessages] = useState<DisplayMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content: `Halo, Privacy Guardian! 🤖 Aku Privacy Pal, dan aku di sini untuk membantu kamu belajar tentang keamanan internet! 

Aku bisa jawab pertanyaan tentang password, informasi pribadi, keamanan online, dan game edukatif di aplikasi ini. Mau tanya apa nih? 🛡️`,
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [questionsAsked, setQuestionsAsked] = useState(0);
  const [conversationStarted, setConversationStarted] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickSuggestions = [
    { text: "Bagaimana cara membuat password yang kuat?", icon: "🔐" },
    { text: "Informasi apa yang tidak boleh dibagikan online?", icon: "🕵️" },
    { text: "Apa itu phishing dan bagaimana menghindarinya?", icon: "🎣" },
    { text: "Ceritakan tentang game di Privykids!", icon: "🎮" },
    { text: "Tips aman menggunakan media sosial", icon: "📱" }
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (messageText?: string) => {
    const content = messageText || inputValue.trim();
    if (!content) return;

    const userMessage: DisplayMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: content,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);
    setConversationStarted(true);

    // Track questions asked for achievements
    const newQuestionsAsked = questionsAsked + 1;
    setQuestionsAsked(newQuestionsAsked);

    try {
      const result = await openAIService.generateResponse(content);
      
      const botResponse: DisplayMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: result.data || "Maaf, aku lagi ada masalah teknis. Coba tanya lagi ya! 🤖",
        timestamp: new Date()
      };

      // Add typing delay for better UX
      setTimeout(() => {
        setMessages(prev => [...prev, botResponse]);
        setIsTyping(false);
        
        // Check for curious explorer achievement (10 questions)
        if (newQuestionsAsked >= 10) {
          console.log('🏆 Curious Explorer achievement unlocked!');
          // Update achievement in user progress
          updateProgress({
            badges: [...userProgress.badges, 'curious-explorer']
          });
        }
      }, 1500);

    } catch (error) {
      console.error('❌ Error generating response:', error);
      const errorResponse: DisplayMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "Aduh, aku lagi ada gangguan nih. Coba tanya lagi dalam beberapa saat ya! 🤖💭",
        timestamp: new Date()
      };
      
      setTimeout(() => {
        setMessages(prev => [...prev, errorResponse]);
        setIsTyping(false);
      }, 1000);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const startNewConversation = async () => {
    try {
      setIsTyping(true);
      await openAIService.startNewConversation();
      
      setMessages([
        {
          id: Date.now().toString(),
          role: 'assistant',
          content: `Halo lagi! 🌟 Aku Privacy Pal, siap memulai petualangan baru dalam belajar keamanan internet! Mau bahas apa kali ini? Password? Privasi? Atau game seru di Privykids? Yuk, tanya apa aja! 🛡️✨`,
          timestamp: new Date()
        }
      ]);
      
      setQuestionsAsked(0);
      setConversationStarted(false);
      setIsTyping(false);
      
      console.log('🔄 New conversation started');
    } catch (error) {
      console.error('❌ Failed to start new conversation:', error);
      setIsTyping(false);
    }
  };

  const sendDailyTip = () => {
    const tips = [
      "💡 Tips hari ini: Password yang kuat itu seperti kunci rumah yang super aman! Pastikan ada huruf besar, kecil, angka, dan simbol ya! 🔐",
      "🛡️ Ingat: Informasi pribadi seperti nama lengkap, alamat, dan nomor HP itu seperti harta karun yang harus dijaga! Jangan kasih ke sembarang orang ya! 💎",
      "📱 Tips social media: Sebelum posting, tanya diri sendiri: 'Apakah aku masih bangga dengan ini 5 tahun lagi?' Kalau ragu, mending jangan! 🤔",
      "🎣 Waspada phishing! Kalau ada email atau pesan yang menjanjikan hadiah gratis, tanya orang dewasa dulu ya. Biasanya itu jebakan! 🚨",
      "🎮 Yuk main game edukatif di Privykids! Password Fortress dan Share or Shield seru banget buat belajar keamanan sambil main! 🏆"
    ];
    
    const randomTip = tips[Math.floor(Math.random() * tips.length)];
    const tipMessage: DisplayMessage = {
      id: Date.now().toString(),
      role: 'assistant',
      content: randomTip,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, tipMessage]);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-white/20 p-3 rounded-full">
                <Bot className="h-8 w-8" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Privacy Pal 🤖</h2>
                <p className="text-blue-100">Asisten keamanan internet yang ramah!</p>
              </div>
            </div>
            
            {/* New Conversation Button */}
            {conversationStarted && (
              <button
                onClick={startNewConversation}
                className="bg-white/20 hover:bg-white/30 p-2 rounded-full transition-colors"
                title="Mulai percakapan baru"
              >
                <RotateCcw className="h-5 w-5" />
              </button>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 border-b">
          <div className="flex flex-wrap gap-2 mb-3">
            <button
              onClick={sendDailyTip}
              className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold hover:bg-blue-200 transition-colors flex items-center gap-2"
            >
              <Sparkles className="h-4 w-4" />
              Tips Harian
            </button>
            {questionsAsked >= 5 && (
              <button
                onClick={startNewConversation}
                className="bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-semibold hover:bg-green-200 transition-colors flex items-center gap-2"
              >
                <RotateCcw className="h-4 w-4" />
                Obrolan Baru
              </button>
            )}
          </div>
          
          {/* Quick Suggestions */}
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-600">Saran pertanyaan:</p>
            <div className="flex flex-wrap gap-2">
              {quickSuggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handleSendMessage(suggestion.text)}
                  className="bg-white text-gray-700 px-3 py-2 rounded-full text-xs font-medium hover:bg-gray-50 transition-colors border border-gray-200 flex items-center gap-1"
                  disabled={isTyping}
                >
                  <span>{suggestion.icon}</span>
                  <span>{suggestion.text}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Chat Messages */}
        <div className="h-96 overflow-y-auto p-6 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}
            >
              <div className={`p-2 rounded-full flex-shrink-0 ${
                message.role === 'user' 
                  ? 'bg-blue-600' 
                  : 'bg-gradient-to-br from-purple-500 to-blue-500'
              }`}>
                {message.role === 'user' ? (
                  <User className="h-5 w-5 text-white" />
                ) : (
                  <Bot className="h-5 w-5 text-white" />
                )}
              </div>
              <div className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
                message.role === 'user'
                  ? 'bg-blue-600 text-white ml-auto'
                  : 'bg-gray-100 text-gray-800'
              }`}>
                <p className="whitespace-pre-line leading-relaxed">{message.content}</p>
                <p className={`text-xs mt-2 ${
                  message.role === 'user' ? 'text-blue-100' : 'text-gray-500'
                }`}>
                  {message.timestamp.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
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
                <div className="flex items-center space-x-2">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                  <span className="text-xs text-gray-500">Privacy Pal sedang mengetik...</span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 border-t bg-gray-50">
          <div className="flex gap-3">
            <textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Tanya aku tentang keamanan internet! 🛡️"
              className="flex-1 px-4 py-3 rounded-2xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              rows={1}
              disabled={isTyping}
            />
            <button
              onClick={() => handleSendMessage()}
              disabled={!inputValue.trim() || isTyping}
              className="bg-blue-600 text-white p-3 rounded-2xl hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isTyping ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <Send className="h-5 w-5" />
              )}
            </button>
          </div>
          
          <div className="flex items-center justify-between mt-2">
            <p className="text-xs text-gray-500">
              Privacy Pal siap membantu! Selalu minta bantuan orang dewasa untuk keputusan penting. 🤗
            </p>
            {questionsAsked > 0 && (
              <div className="flex items-center gap-2 text-xs">
                <Zap className="h-3 w-3 text-blue-600" />
                <span className="text-blue-600 font-semibold">
                  {questionsAsked}/10 pertanyaan 🎯
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;