import { AzureOpenAI } from 'openai';
import config, { isOpenAIConfigured } from '../config/azure';
import { CosmosClient, Container, Database } from '@azure/cosmos';

// Use the correct environment variable names from README
const endpoint = import.meta.env.VITE_COSMOS_DB_ENDPOINT;
const key = import.meta.env.VITE_COSMOS_DB_KEY;
const databaseId = import.meta.env.VITE_COSMOS_DB_DATABASE_ID || 'jagajiwa';

console.log('🔍 Cosmos DB Configuration Debug:');
console.log('Endpoint:', endpoint);
console.log('Key present:', !!key);
console.log('Key length:', key ? key.length : 0);
console.log('Database ID:', databaseId);

// Check if Cosmos DB is properly configured
const isCosmosDBConfigured = !!(endpoint && key);

if (!isCosmosDBConfigured) {
  console.warn('❌ Cosmos DB not configured, using localStorage fallback');
  console.warn('Missing:', !endpoint ? 'ENDPOINT' : '', !key ? 'KEY' : '');
} else {
  console.log('✅ Cosmos DB configured');
}

// Initialize Cosmos Client only if configured
const client = isCosmosDBConfigured ? new CosmosClient({ endpoint, key }) : null;

// Get or create database
export const getDatabase = async (): Promise<Database | null> => {
  if (!client) {
    console.log('❌ Cosmos DB client not available');
    return null;
  }
  
  try {
    console.log('🔄 Creating/connecting to database:', databaseId);
    const { database } = await client.databases.createIfNotExists({ 
      id: databaseId
    });
    console.log('✅ Database operation successful');
    return database;
  } catch (error) {
    console.error('❌ Database operation failed:');
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    console.error('Error status:', error.code);
    if (error.body) {
      console.error('Error body:', error.body);
    }
    console.error('Full error object:', error);
    return null;
  }
};

// Get or create container
export const getContainer = async (containerId: string): Promise<Container | null> => {
  if (!client) {
    console.log('❌ Cosmos DB client not available for container:', containerId);
    return null;
  }

  try {
    console.log('🔄 Creating/connecting to container:', containerId);
    const database = await getDatabase();
    if (!database) {
      console.log('❌ Database not available, cannot create container');
      return null;
    }
    
    const { container } = await database.containers.createIfNotExists({
      id: containerId,
      partitionKey: { paths: ['/userId'] }
    });
    console.log('✅ Container operation successful:', containerId);
    return container;
  } catch (error) {
    console.error('❌ Container operation failed for:', containerId);
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    console.error('Error status:', error.code);
    if (error.body) {
      console.error('Error body:', error.body);
    }
    console.error('Full error object:', error);
    return null;
  }
};

// Generate or get user ID (stored in localStorage for anonymity but persistent sessions)
export const getUserId = (): string => {
  let userId = localStorage.getItem('jagajiwa-user-id');
  if (!userId) {
    userId = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    localStorage.setItem('jagajiwa-user-id', userId);
    console.log('✅ Generated new user ID:', userId);
  }
  return userId;
};

// Test Cosmos DB connection
export const testCosmosDBConnection = async (): Promise<boolean> => {
  if (!isCosmosDBConfigured) {
    console.log('❌ Cosmos DB not configured');
    return false;
  }

  try {
    const database = await getDatabase();
    if (database) {
      console.log('✅ Cosmos DB connection test successful');
      return true;
    } else {
      console.log('❌ Cosmos DB connection test failed');
      return false;
    }
  } catch (error) {
    console.error('❌ Cosmos DB connection test failed:', error);
    return false;
  }
};import { DatabaseOperationResult } from '../types/database';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

// Check if Azure OpenAI is configured
if (!isOpenAIConfigured) {
  console.warn('❌ Azure OpenAI not configured, using fallback responses');
  console.warn('Missing:', 
    !config.openAI.endpoint ? 'VITE_AZURE_OPENAI_ENDPOINT' : '', 
    !config.openAI.apiKey ? 'VITE_AZURE_OPENAI_API_KEY' : '',
    !config.openAI.deploymentName ? 'VITE_AZURE_OPENAI_DEPLOYMENT_NAME' : ''
  );
} else {
  console.log('✅ Azure OpenAI configured for direct client access');
}

// Initialize Azure OpenAI client with browser support for HACKATHON DEMO
const openAI = isOpenAIConfigured ? new AzureOpenAI({
  endpoint: config.openAI.endpoint,
  apiKey: config.openAI.apiKey,
  apiVersion: config.openAI.apiVersion,
  dangerouslyAllowBrowser: true // ⚠️ HACKATHON DEMO ONLY
}) : null;

// Enhanced system prompt for Privacy Pal
const SYSTEM_PROMPT = `Anda adalah Privacy Pal, asisten virtual AI yang sangat ramah, penuh empati, dan selalu suportif dari aplikasi Privykids. Nama Anda adalah Privacy Pal.

Misi utama Anda adalah:
1. Mendengarkan dengan penuh perhatian dan pengertian terhadap apa yang dirasakan anak-anak terkait keamanan dan privasi digital.
2. Memberikan dukungan dan edukasi tentang keamanan internet dengan bahasa yang mudah dipahami anak-anak usia 8-12 tahun.
3. Membantu anak-anak memahami konsep privasi digital, password yang aman, dan cara menghindari bahaya di internet.
4. Memberikan informasi umum yang bersifat edukatif terkait keamanan digital dan privasi online.
5. Mendorong anak-anak untuk bermain game edukasi di Privykids seperti Password Fortress dan Share or Shield.

Gaya Komunikasi Anda:
- Bahasa: Selalu gunakan bahasa Indonesia yang sopan, ramah anak, penuh semangat, dan mudah dipahami oleh anak-anak.
- Nada: Antusias, suportif, sabar, dan selalu memberikan pujian ketika anak bertanya atau belajar.
- Panjang Respons: Jaga agar respons Anda singkat dan jelas, idealnya 1-2 kalimat.
- Emoji: Gunakan emoji yang sesuai untuk membuat percakapan lebih menyenangkan.

ATURAN PENTING:
1. Fokus hanya pada topik keamanan internet, privasi digital, password, dan keamanan online.
2. Jika anak bertanya tentang topik di luar keamanan digital, dengan sopan arahkan kembali ke topik keamanan internet.
3. Selalu berikan pujian dan dorongan positif.
4. Gunakan analogi sederhana yang mudah dipahami anak-anak.
5. Dorong anak untuk bertanya lebih banyak tentang keamanan internet.`;

class OpenAIService {
  private conversationHistory: ChatMessage[] = [];

  // Generate chat response using Azure OpenAI DIRECT CLIENT
  async generateResponse(userMessage: string): Promise<DatabaseOperationResult<string>> {
    try {
      // If Azure OpenAI not configured, use fallback
      if (!openAI) {
        const fallbackResponse = this.getFallbackResponse(userMessage);
        return { 
          success: true, 
          data: fallbackResponse,
          fromCache: true 
        };
      }

      console.log('🔄 Calling Azure OpenAI directly from browser...');
      
      // Prepare conversation history with system prompt
      const messages = [
        { role: 'system' as const, content: SYSTEM_PROMPT },
        ...this.conversationHistory.slice(-6), // Keep last 6 messages for context
        { role: 'user' as const, content: userMessage }
      ];

      const response = await openAI.chat.completions.create({
        model: config.openAI.deploymentName,
        messages,
        max_tokens: 300,
        temperature: 0.7,
        top_p: 0.9,
        frequency_penalty: 0.1,
        presence_penalty: 0.1,
      });

      const botResponse = response.choices[0]?.message?.content;
      
      if (!botResponse) {
        throw new Error('No response generated');
      }

      // Update conversation history
      this.conversationHistory.push(
        { role: 'user', content: userMessage, timestamp: new Date() },
        { role: 'assistant', content: botResponse, timestamp: new Date() }
      );

      console.log('✅ Azure OpenAI response generated successfully');
      return { success: true, data: botResponse.trim() };
    } catch (error) {
      console.error('❌ Azure OpenAI Direct Error:', error);
      
      // Fallback response for error cases
      const fallbackResponse = this.getFallbackResponse(userMessage);
      return { 
        success: false, 
        data: fallbackResponse,
        error: error instanceof Error ? error.message : 'Unknown error',
        fromCache: true 
      };
    }
  }

  // Backward compatibility method for existing components
  async sendMessage(message: string): Promise<DatabaseOperationResult<string>> {
    return this.generateResponse(message);
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
    
    // Game related
    if (lowerMessage.includes('game') || lowerMessage.includes('main') || lowerMessage.includes('privykids') || lowerMessage.includes('bermain')) {
      const gameResponses = [
        '🎮 Wah, seru banget! Di Privykids ada Password Fortress yang mengajarkan cara bikin password kuat, dan Share or Shield yang melatih kemampuan deteksi informasi pribadi! Yuk main! 🏆',
        '🎯 Game di Privykids itu edukatif banget! Sambil main, kamu belajar jadi Privacy Guardian yang hebat. Ada quiz juga lho yang bikin kamu makin pintar soal keamanan! 🌟',
        '🏅 Asyik! Main game sambil belajar itu menyenangkan. Di sini kamu bisa dapat badge dan naik level dengan belajar tentang keamanan internet! Kamu amazing! 🚀'
      ];
      return gameResponses[Math.floor(Math.random() * gameResponses.length)];
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
    
    // Default encouraging responses
    const defaultResponses = [
      '😊 Halo! Aku Privacy Pal, teman kamu untuk belajar keamanan internet! Ayo tanya tentang password, privasi, atau keamanan online! 🌈',
      '🛡️ Wah, senang banget bisa ngobrol sama kamu! Aku spesialis keamanan internet untuk anak-anak. Yuk, kita bahas tentang cara aman berinternet! 🌟',
      '🎯 Keren banget kamu mau belajar tentang keamanan online! Aku bisa bantu kamu jadi Privacy Guardian yang hebat. Mau tanya tentang apa nih? 🚀',
      '👋 Hai, Privacy Guardian! Aku di sini buat bantu kamu belajar melindungi diri di internet. Password, privasi, game edukatif - tanya apa aja! 🏆'
    ];
    
    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
  }

  // Get conversation history
  async getConversationHistory(): Promise<DatabaseOperationResult<ChatMessage[]>> {
    return { 
      success: true, 
      data: [...this.conversationHistory] 
    };
  }

  // Check if Azure OpenAI is available
  async isServiceAvailable(): Promise<boolean> {
    return isOpenAIConfigured && openAI !== null;
  }

  // Get service status
  async getServiceStatus(): Promise<{
    available: boolean;
    latency: number;
    error?: string;
  }> {
    const startTime = Date.now();
    const available = await this.isServiceAvailable();
    const latency = Date.now() - startTime;
    
    return { 
      available, 
      latency,
      error: available ? undefined : 'Azure OpenAI not configured or unavailable'
    };
  }

  // Clear conversation
  async clearConversation(): Promise<void> {
    this.conversationHistory = [];
    console.log('🧹 Conversation cleared');
  }

  // Test Azure OpenAI connection
  async testConnection(): Promise<boolean> {
    if (!this.isServiceAvailable()) {
      return false;
    }

    try {
      await this.generateResponse('test');
      return true;
    } catch {
      return false;
    }
  }

  // Cleanup method
  async cleanup(): Promise<void> {
    this.conversationHistory = [];
    console.log('🧹 OpenAI service cleanup completed');
  }
}

// Export singleton instance
export const openAIService = new OpenAIService();

// Export for testing
export { OpenAIService }; 