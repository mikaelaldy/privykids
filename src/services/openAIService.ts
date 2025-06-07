import { DatabaseOperationResult } from '../types/database';
import { cosmosDbService } from './cosmosDbService';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface AssistantThread {
  id: string;
  userId: string;
  createdAt: Date;
  lastMessageAt: Date;
}

export interface AssistantResponse {
  id: string;
  object: string;
  created_at: number;
  name?: string;
  description?: string;
  model: string;
  instructions: string;
  tools: unknown[];
  file_ids: unknown[];
  metadata: Record<string, unknown>;
}

class OpenAIService {
  private assistantId: string | null = null;
  private currentThreadId: string | null = null;
  private isInitialized = false;
  private apiBaseUrl: string;

  constructor() {
    this.apiBaseUrl = import.meta.env.VITE_API_BASE_URL || '/api';
    
    // In development, check if we're running locally
    if (import.meta.env.DEV) {
      console.log('🛠️ Development mode: OpenAI API routes may not be available locally');
    }
  }

  private async makeRequest(endpoint: string, options: RequestInit = {}) {
    const url = `${this.apiBaseUrl}${endpoint}`;
    
    try {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error(`❌ API request failed for ${endpoint}:`, error);
      
      // In development, provide helpful message
      if (import.meta.env.DEV && error instanceof Error && error.message.includes('Unexpected token')) {
        console.warn('💡 OpenAI API routes not available in development. Using fallback responses.');
        throw new Error('API routes unavailable in development');
      }
      
      throw error;
    }
  }

  async initialize(): Promise<DatabaseOperationResult<void>> {
    if (this.isInitialized) {
      return { success: true };
    }

    try {
      console.log('🤖 Creating Azure OpenAI Assistant...');
      
      // Create the assistant
      const result = await this.makeRequest('/openai/assistant', {
        method: 'POST'
      });

      if (result.success && result.data?.id) {
        this.assistantId = result.data.id;
        this.isInitialized = true;
        console.log('✅ OpenAI Assistant initialized:', this.assistantId);
        return { success: true };
      } else {
        throw new Error('Failed to create assistant');
      }
    } catch (error) {
      console.error('❌ Error initializing OpenAI service:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  async createNewConversation(): Promise<DatabaseOperationResult<string>> {
    try {
      if (!this.isInitialized) {
        const initResult = await this.initialize();
        if (!initResult.success) {
          throw new Error('Failed to initialize OpenAI service');
        }
      }

      console.log('🧵 Creating new conversation thread...');
      
      const result = await this.makeRequest('/openai/threads', {
        method: 'POST'
      });

      if (result.success && result.data?.id) {
        this.currentThreadId = result.data.id;
        console.log('✅ New conversation thread created:', this.currentThreadId);
        return { success: true, data: this.currentThreadId };
      } else {
        throw new Error('Failed to create thread');
      }
    } catch (error) {
      console.error('❌ Error creating conversation:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  async sendMessage(message: string): Promise<DatabaseOperationResult<string>> {
    try {
      // In development mode, skip API calls and use fallback responses directly
      if (import.meta.env.DEV) {
        console.log('💬 Development mode: Using fallback response for:', message);
        const fallbackResponse = this.getFallbackResponse(message);
        
        // Simulate some processing time for better UX
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        return { 
          success: true, 
          data: fallbackResponse,
          fromCache: true 
        };
      }

      // Production/deployed environment - use real API
      if (!this.isInitialized) {
        const initResult = await this.initialize();
        if (!initResult.success) {
          throw new Error('Failed to initialize OpenAI service');
        }
      }

      // Create thread if none exists
      if (!this.currentThreadId) {
        const threadResult = await this.createNewConversation();
        if (!threadResult.success) {
          throw new Error('Failed to create conversation thread');
        }
      }

      console.log('💬 Sending message to assistant...');
      
      // Add message to thread
      await this.makeRequest(`/openai/threads/${this.currentThreadId}/messages`, {
        method: 'POST',
        body: JSON.stringify({ content: message })
      });

      // Run the assistant
      const runResult = await this.makeRequest(`/openai/threads/${this.currentThreadId}/runs`, {
        method: 'POST',
        body: JSON.stringify({ assistantId: this.assistantId })
      });

      if (!runResult.success || !runResult.data?.id) {
        throw new Error('Failed to start assistant run');
      }

      // Poll for completion
      const response = await this.waitForCompletion(runResult.data.id);
      
      // Save to chat history
      await cosmosDbService.saveChatHistory([
        { role: 'user', content: message, timestamp: new Date() },
        { role: 'assistant', content: response, timestamp: new Date() }
      ]);

      return { success: true, data: response };
    } catch (error) {
      console.error('❌ Error sending message:', error);
      
      // Fallback response for offline mode
      const fallbackResponse = this.getFallbackResponse(message);
      return { 
        success: false, 
        data: fallbackResponse,
        error: error instanceof Error ? error.message : 'Unknown error',
        fromCache: true 
      };
    }
  }

  // Backward compatibility method for existing Chatbot component
  async generateResponse(message: string): Promise<DatabaseOperationResult<string>> {
    return this.sendMessage(message);
  }

  // Backward compatibility method for starting new conversations
  async startNewConversation(): Promise<void> {
    return this.clearConversation();
  }

  private async waitForCompletion(runId: string, maxAttempts: number = 30): Promise<string> {
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second
      
      const statusResult = await this.makeRequest(`/openai/threads/${this.currentThreadId}/runs/${runId}`);
      
      if (statusResult.success && statusResult.data) {
        const status = statusResult.data.status;
        console.log(`🔄 Run status: ${status} (attempt ${attempt + 1}/${maxAttempts})`);
        
        if (status === 'completed') {
          // Get the messages
          const messagesResult = await this.makeRequest(`/openai/threads/${this.currentThreadId}/messages`);
          
          if (messagesResult.success && messagesResult.data?.data?.length > 0) {
            const messages = messagesResult.data.data;
            const assistantMessage = messages.find((msg: any) => msg.role === 'assistant');
            
            if (assistantMessage?.content?.[0]?.text?.value) {
              return assistantMessage.content[0].text.value;
            }
          }
          
          throw new Error('No response from assistant');
        } else if (status === 'failed' || status === 'cancelled' || status === 'expired') {
          throw new Error(`Assistant run ${status}`);
        }
        // Continue polling for in_progress, queued states
      }
    }
    
    throw new Error('Assistant response timeout');
  }

  private getFallbackResponse(message: string): string {
    const lowerMessage = message.toLowerCase();
    
    // Password related questions
    if (lowerMessage.includes('password') || lowerMessage.includes('kata sandi') || lowerMessage.includes('sandi')) {
      const passwordResponses = [
        '🔐 Halo! Kata sandi yang kuat itu seperti kunci rumah yang super aman! Pastikan ada huruf besar, kecil, angka, dan simbol ya! Jangan pernah kasih tau kata sandi ke siapa-siapa! 😊',
        '🔒 Wah, pertanyaan bagus! Password yang kuat itu minimal 8 karakter, campuran huruf dan angka. Jangan pakai tanggal lahir atau nama hewan peliharaan ya! Kamu pintar bertanya! 🌟',
        '🛡️ Password itu seperti rahasia super penting! Buat yang unik untuk setiap akun, jangan yang mudah ditebak kayak "123456". Kamu sudah jadi Privacy Guardian yang hebat! 🏆'
      ];
      return passwordResponses[Math.floor(Math.random() * passwordResponses.length)];
    }
    
    // Privacy and personal information
    if (lowerMessage.includes('pribadi') || lowerMessage.includes('personal') || lowerMessage.includes('informasi') || lowerMessage.includes('data')) {
      const privacyResponses = [
        '🛡️ Wah, pertanyaan tentang privasi nih! Ingat ya, jangan pernah kasih tau informasi pribadi kayak nama lengkap, alamat, atau nomor telepon ke orang yang nggak kamu kenal di internet! 🌟',
        '🕵️ Informasi pribadi itu seperti harta karun yang harus dijaga! Nama sekolah, alamat rumah, nomor HP - semua itu rahasia. Hanya kasih tau ke orang yang kamu percaya ya! 💎',
        '📱 Data pribadi itu penting banget! Di internet, jangan share foto rumah, plat nomor mobil, atau lokasi real-time. Kamu keren sudah peduli privasi! ⭐'
      ];
      return privacyResponses[Math.floor(Math.random() * privacyResponses.length)];
    }
    
    // Safety and security
    if (lowerMessage.includes('aman') || lowerMessage.includes('safety') || lowerMessage.includes('keamanan') || lowerMessage.includes('bahaya')) {
      const safetyResponses = [
        '⭐ Bagus banget kamu mau belajar tentang keamanan internet! Selalu minta izin orang tua sebelum download aplikasi baru atau ngasih informasi pribadi ya! 🎉',
        '🚨 Keamanan online itu penting! Kalau ada yang aneh di internet, langsung cerita ke orang dewasa yang kamu percaya. Kamu pintar menjaga diri! 🛡️',
        '🌟 Tips keamanan: Jangan klik link yang mencurigakan, jangan download dari sumber yang nggak jelas, dan selalu tanya orang tua kalau ragu! Kamu hebat! 👏'
      ];
      return safetyResponses[Math.floor(Math.random() * safetyResponses.length)];
    }
    
    // Social media related
    if (lowerMessage.includes('sosial') || lowerMessage.includes('instagram') || lowerMessage.includes('facebook') || lowerMessage.includes('tiktok') || lowerMessage.includes('medsos')) {
      const socialResponses = [
        '📱 Media sosial bisa seru, tapi hati-hati ya! Jangan share lokasi asli, jangan terima pertemanan dari orang asing, dan pikir dulu sebelum posting. Kamu smart! 🌈',
        '📸 Kalau mau posting, tanya diri sendiri: "Apakah aku masih bangga dengan ini 5 tahun lagi?" Kalau ragu, mending jangan! Privacy Guardian yang bijak! 🤗',
        '👥 Di medsos, jadilah diri sendiri yang positif! Jangan bully, jangan share hal negatif, dan selalu hormat sama orang lain. Kamu keren! ✨'
      ];
      return socialResponses[Math.floor(Math.random() * socialResponses.length)];
    }
    
    // Game related
    if (lowerMessage.includes('game') || lowerMessage.includes('main') || lowerMessage.includes('privykids') || lowerMessage.includes('bermain')) {
      const gameResponses = [
        '🎮 Wah, seru banget! Di Privykids ada Password Fortress yang mengajarkan cara bikin password kuat, dan Share or Shield yang melatih kemampuan deteksi informasi pribadi! Yuk main! 🏆',
        '🎯 Game di Privykids itu edukatif banget! Sambil main, kamu belajar jadi Privacy Guardian yang hebat. Ada quiz juga lho yang bikin kamu makin pintar soal keamanan! 🌟',
        '🏅 Asyik! Main game sambil belajar itu menyenangkan. Di sini kamu bisa dapat badge dan naik level dengan belajar tentang keamanan internet! Kamu amazing! 🚀'
      ];
      return gameResponses[Math.floor(Math.random() * gameResponses.length)];
    }
    
    // Phishing related
    if (lowerMessage.includes('phishing') || lowerMessage.includes('penipuan') || lowerMessage.includes('tipu') || lowerMessage.includes('link')) {
      const phishingResponses = [
        '🎣 Phishing itu seperti pancing ikan, tapi yang dipancing adalah data kamu! Kalau ada email atau pesan yang menjanjikan hadiah gratis, hati-hati ya. Tanya orang tua dulu! 🚨',
        '⚠️ Link mencurigakan itu bahaya! Kalau ada yang nawarin hadiah jutaan rupiah atau bilang kamu menang undian yang nggak pernah kamu ikuti, jangan diklik! Kamu pintar! 🛡️',
        '🔍 Selalu cek sender email atau pesan. Kalau dari alamat aneh atau typo banyak, kemungkinan besar itu penipuan. Kamu jadi detektif yang hebat! 🕵️'
      ];
      return phishingResponses[Math.floor(Math.random() * phishingResponses.length)];
    }
    
    // Greeting responses
    if (lowerMessage.includes('halo') || lowerMessage.includes('hai') || lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
      const greetingResponses = [
        '😊 Halo juga, Privacy Guardian! Aku Privacy Pal, teman kamu untuk belajar keamanan internet! Mau tanya tentang password, privasi, atau keamanan online? Yuk tanya apa aja! 🌈',
        '👋 Hai! Senang banget bisa ngobrol sama kamu! Aku siap bantu kamu jadi ahli keamanan internet. Mau bahas password kuat? Atau tips aman di media sosial? 🛡️✨',
        '🤗 Halo, teman! Aku Privacy Pal yang siap membantu kamu menjelajahi dunia internet dengan aman. Ada yang mau ditanyakan tentang privasi data? 🌟'
      ];
      return greetingResponses[Math.floor(Math.random() * greetingResponses.length)];
    }
    
    // General questions about internet/technology
    if (lowerMessage.includes('internet') || lowerMessage.includes('online') || lowerMessage.includes('teknologi') || lowerMessage.includes('digital')) {
      const internetResponses = [
        '🌐 Internet itu tempat yang luas dan seru! Tapi seperti di dunia nyata, ada tempat yang aman dan ada yang nggak. Aku siap ajarin kamu cara jelajah internet dengan aman! 🗺️',
        '💻 Dunia digital itu amazing! Tapi ingat, setiap jejak digital kita itu tersimpan lama. Makanya penting banget belajar cara melindungi diri. Kamu sudah di jalan yang benar! 🚀',
        '📡 Online safety itu skill penting di zaman sekarang! Kayak belajar nyebrang jalan, kita perlu tau aturannya biar aman. Yuk belajar bareng! 🎯'
      ];
      return internetResponses[Math.floor(Math.random() * internetResponses.length)];
    }
    
    // Default encouraging responses
    const defaultResponses = [
      '😊 Halo! Aku Privacy Pal, teman kamu untuk belajar keamanan internet! Ayo tanya tentang password, privasi, atau keamanan online! 🌈',
      '🛡️ Wah, senang banget bisa ngobrol sama kamu! Aku spesialis keamanan internet untuk anak-anak. Yuk, kita bahas tentang cara aman berinternet! 🌟',
      '🎯 Keren banget kamu mau belajar tentang keamanan online! Aku bisa bantu kamu jadi Privacy Guardian yang hebat. Mau tanya tentang apa nih? 🚀',
      '👋 Hai, Privacy Guardian! Aku di sini buat bantu kamu belajar melindungi diri di internet. Password, privasi, game edukatif - tanya apa aja! 🏆'
    ];
    
    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
  }

  async getConversationHistory(): Promise<DatabaseOperationResult<ChatMessage[]>> {
    try {
      if (!this.currentThreadId) {
        return { success: true, data: [] };
      }

      const messagesResult = await this.makeRequest(`/openai/threads/${this.currentThreadId}/messages`);
      
      if (messagesResult.success && messagesResult.data?.data) {
        const messages: ChatMessage[] = messagesResult.data.data
          .reverse() // OpenAI returns messages in reverse order
          .map((msg: any) => ({
            role: msg.role,
            content: msg.content?.[0]?.text?.value || '',
            timestamp: new Date(msg.created_at * 1000)
          }));
        
        return { success: true, data: messages };
      }
      
      return { success: true, data: [] };
    } catch (error) {
      console.error('❌ Error getting conversation history:', error);
      return { 
        success: false, 
        data: [],
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  async isServiceAvailable(): Promise<boolean> {
    // In development mode, skip API health checks
    if (import.meta.env.DEV) {
      console.log('🛠️ Development mode: Skipping OpenAI API health check');
      return false; // Indicate API not available, will use fallbacks
    }

    try {
      const result = await this.makeRequest('/health');
      return result.success && result.services?.openai;
    } catch (error) {
      console.warn('⚠️ OpenAI service unavailable:', error);
      return false;
    }
  }

  async getServiceStatus(): Promise<{
    available: boolean;
    latency: number;
    error?: string;
  }> {
    const startTime = Date.now();
    
    // In development mode, skip API status checks  
    if (import.meta.env.DEV) {
      const latency = Date.now() - startTime;
      console.log('🛠️ Development mode: Using fallback responses');
      return { 
        available: false, 
        latency, 
        error: 'Development mode - using fallback responses'
      };
    }
    
    try {
      const available = await this.isServiceAvailable();
      const latency = Date.now() - startTime;
      
      return { available, latency };
    } catch (error) {
      const latency = Date.now() - startTime;
      return { 
        available: false, 
        latency, 
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  async clearConversation(): Promise<void> {
    try {
      // Create a new thread for the next conversation
      this.currentThreadId = null;
      console.log('🧹 Conversation cleared, new thread will be created for next message');
    } catch (error) {
      console.error('❌ Error clearing conversation:', error);
    }
  }

  // Cleanup method
  async cleanup(): Promise<void> {
    try {
      this.currentThreadId = null;
      this.assistantId = null;
      this.isInitialized = false;
      console.log('🧹 OpenAI service cleanup completed');
    } catch (error) {
      console.error('❌ Error during cleanup:', error);
    }
  }
}

// Export singleton instance
export const openAIService = new OpenAIService();

// Export for testing
export { OpenAIService }; 