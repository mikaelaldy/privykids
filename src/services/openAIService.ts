import { AZURE_CONFIG } from '../config/azure';
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

export interface AssistantRun {
  id: string;
  status: 'queued' | 'in_progress' | 'completed' | 'failed' | 'cancelled' | 'cancelling' | 'requires_action';
  threadId: string;
  assistantId: string;
}

class OpenAIAssistantService {
  private baseUrl: string;
  private apiKey: string;
  private apiVersion: string;
  private assistantId: string | null = null;
  private currentThreadId: string | null = null;
  private requestCount: number = 0;
  private pollingInterval: number = 1000; // 1 second

  constructor() {
    this.baseUrl = AZURE_CONFIG.openAI.endpoint;
    this.apiKey = AZURE_CONFIG.openAI.apiKey;
    this.apiVersion = '2024-05-01-preview'; // Updated to match the assistant API version
  }

  private async makeRequest(endpoint: string, method: 'GET' | 'POST' = 'POST', body?: any) {
    const url = `${this.baseUrl}/openai${endpoint}?api-version=${this.apiVersion}`;
    
    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'api-key': this.apiKey,
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Azure OpenAI API error: ${response.status} - ${errorText}`);
    }

    return response.json();
  }

  async createAssistant(): Promise<string> {
    if (this.assistantId) {
      return this.assistantId;
    }

    try {
      console.log('🤖 Creating Azure OpenAI Assistant...');
      
      const assistant = await this.makeRequest('/assistants', 'POST', {
        model: AZURE_CONFIG.openAI.deploymentName,
        instructions: `You are 'Privacy Pal', a friendly, cheerful, and wise AI mentor for children aged 8-12 years.

Your main mission is to answer questions about security and data privacy in the internet world in a very simple and positive way.

MOST IMPORTANT RULES:
1. TOPIC FOCUS: You may ONLY discuss: password security, personal information (like names, addresses), what should and shouldn't be shared online, and educational games available in this app.
2. REJECT OTHER TOPICS: If a child asks about homework, other games, movies, or any topic outside internet security, you MUST politely refuse. Example refusal: "Wow, that's an exciting question! But I'm an internet security expert, so I can only help with that. Let's ask again about passwords or privacy!"
3. SIMPLE LANGUAGE: Use short, cheerful sentences that are easy for elementary school children to understand. Imagine you're talking to a peer.
4. DON'T BE PREACHY: Be a helpful friend, not a strict teacher. Always provide encouragement at the end of your answers.
5. USE EMOJIS: Make your responses fun and engaging with appropriate emojis.
6. KEEP RESPONSES SHORT: Aim for 2-3 sentences maximum per response.
7. ALWAYS END POSITIVELY: Encourage the child and remind them they're doing great by learning about online safety.

Remember: You're helping kids become "Privacy Guardians" through fun learning!`,
        tools: undefined,
        tool_resources: {},
        temperature: 1,
        top_p: 1
      });

      this.assistantId = assistant.id;
      console.log('✅ Assistant created with ID:', this.assistantId);
      
      // Store assistant ID in localStorage for persistence
      localStorage.setItem('privykids-assistant-id', this.assistantId);
      
      return this.assistantId;
    } catch (error) {
      console.error('❌ Failed to create assistant:', error);
      throw error;
    }
  }

  async getOrCreateThread(): Promise<string> {
    if (this.currentThreadId) {
      return this.currentThreadId;
    }

    try {
      // Check if we have a stored thread ID
      const storedThreadId = localStorage.getItem('privykids-thread-id');
      if (storedThreadId) {
        this.currentThreadId = storedThreadId;
        console.log('📱 Using existing thread:', this.currentThreadId);
        return this.currentThreadId;
      }

      console.log('🧵 Creating new conversation thread...');
      
      const thread = await this.makeRequest('/threads', 'POST', {});
      this.currentThreadId = thread.id;
      
      // Store thread ID in localStorage
      localStorage.setItem('privykids-thread-id', this.currentThreadId);
      
      console.log('✅ Thread created with ID:', this.currentThreadId);
      return this.currentThreadId;
    } catch (error) {
      console.error('❌ Failed to create thread:', error);
      throw error;
    }
  }

  async addMessageToThread(threadId: string, content: string): Promise<void> {
    try {
      await this.makeRequest(`/threads/${threadId}/messages`, 'POST', {
        role: 'user',
        content: content
      });
      console.log('💬 Message added to thread');
    } catch (error) {
      console.error('❌ Failed to add message to thread:', error);
      throw error;
    }
  }

  async runAssistant(threadId: string, assistantId: string): Promise<AssistantRun> {
    try {
      const run = await this.makeRequest(`/threads/${threadId}/runs`, 'POST', {
        assistant_id: assistantId
      });
      console.log('🏃 Assistant run started:', run.id);
      return run;
    } catch (error) {
      console.error('❌ Failed to run assistant:', error);
      throw error;
    }
  }

  async waitForRunCompletion(threadId: string, runId: string): Promise<AssistantRun> {
    const maxWaitTime = 30000; // 30 seconds max
    const startTime = Date.now();

    while (Date.now() - startTime < maxWaitTime) {
      try {
        const run = await this.makeRequest(`/threads/${threadId}/runs/${runId}`, 'GET');
        
        console.log('🔄 Run status:', run.status);

        if (run.status === 'completed') {
          console.log('✅ Assistant run completed');
          return run;
        } else if (run.status === 'failed' || run.status === 'cancelled') {
          throw new Error(`Assistant run ${run.status}: ${run.last_error?.message || 'Unknown error'}`);
        }

        // Wait before checking again
        await new Promise(resolve => setTimeout(resolve, this.pollingInterval));
      } catch (error) {
        console.error('❌ Error checking run status:', error);
        throw error;
      }
    }

    throw new Error('Assistant run timed out');
  }

  async getThreadMessages(threadId: string): Promise<ChatMessage[]> {
    try {
      const response = await this.makeRequest(`/threads/${threadId}/messages`, 'GET');
      
      // Convert OpenAI messages to our format
      const messages: ChatMessage[] = response.data
        .filter((msg: any) => msg.role !== 'system')
        .reverse() // OpenAI returns newest first, we want oldest first
        .map((msg: any) => ({
          role: msg.role,
          content: msg.content[0]?.text?.value || '',
          timestamp: new Date(msg.created_at * 1000)
        }));

      return messages;
    } catch (error) {
      console.error('❌ Failed to get thread messages:', error);
      throw error;
    }
  }

  async generateResponse(userMessage: string): Promise<DatabaseOperationResult<string>> {
    this.requestCount++;
    
    try {
      if (!this.baseUrl || !this.apiKey) {
        throw new Error('Azure OpenAI configuration missing');
      }

      console.log(`🤖 Processing request #${this.requestCount}: "${userMessage}"`);

      // Ensure we have an assistant
      const assistantId = await this.createAssistant();
      
      // Ensure we have a thread
      const threadId = await this.getOrCreateThread();

      // Add user message to thread
      await this.addMessageToThread(threadId, userMessage);

      // Run the assistant
      const run = await this.runAssistant(threadId, assistantId);

      // Wait for completion
      await this.waitForRunCompletion(threadId, run.id);

      // Get the latest messages
      const messages = await this.getThreadMessages(threadId);
      
      // Get the assistant's latest response
      const assistantMessages = messages.filter(msg => msg.role === 'assistant');
      const latestResponse = assistantMessages[assistantMessages.length - 1];

      if (!latestResponse) {
        throw new Error('No response from assistant');
      }

      console.log('✅ Assistant response received');
      
      // Save conversation to Cosmos DB
      try {
        await cosmosDbService.saveChatHistory(messages, threadId);
      } catch (saveError) {
        console.warn('⚠️ Failed to save chat history:', saveError);
      }

      return { 
        success: true, 
        data: latestResponse.content 
      };
      
    } catch (error) {
      console.error('❌ Error in assistant conversation:', error);
      
      // Fallback to simple responses
      const fallbackResponse = this.getFallbackResponse(userMessage);
      return { 
        success: false, 
        data: fallbackResponse, 
        error: error instanceof Error ? error.message : 'Unknown error',
        fromCache: true 
      };
    }
  }

  async startNewConversation(): Promise<void> {
    try {
      console.log('🔄 Starting new conversation...');
      
      // Clear current thread
      this.currentThreadId = null;
      localStorage.removeItem('privykids-thread-id');
      
      // Create new thread
      await this.getOrCreateThread();
      
      console.log('✅ New conversation started');
    } catch (error) {
      console.error('❌ Failed to start new conversation:', error);
    }
  }

  private getFallbackResponse(userMessage: string): string {
    const lowerMessage = userMessage.toLowerCase();

    // Simple keyword-based fallback responses in Indonesian style
    const responses = {
      password: "Halo! 🔐 Password yang kuat itu seperti kunci rumah yang super kuat! Pastikan ada huruf besar, huruf kecil, angka, dan simbol ya. Jangan pakai password yang sama untuk semua akun! Kamu hebat sudah belajar tentang keamanan! 🌟",
      
      'informasi pribadi': "Wah, pertanyaan bagus! 🕵️ Informasi pribadi itu seperti harta karun yang harus dijaga. Nama lengkap, alamat, nomor HP, dan nama sekolah sebaiknya nggak dishare sembarangan ya. Hanya kasih tahu orang yang kamu percaya! Kamu pintar banget bertanya ini! 🛡️",
      
      'media sosial': "Social media memang seru! 📱 Tapi ingat ya: jangan share lokasi asli, jangan terima teman dari orang asing, dan pikir dulu sebelum posting. Ceritakan ke orang dewasa yang kamu percaya kalau ada yang aneh! Kamu keren sudah aware soal ini! 🌟",
      
      'game': "Asyik banget kalau kamu suka main game di Privykids! 🎮 Di sini ada Password Fortress dan Share or Shield yang seru banget. Yuk main sambil belajar keamanan internet! Kamu pasti jadi Privacy Guardian yang hebat! 🏆",
      
      'privasi': "Privacy itu penting banget! 🛡️ Bayangkan kalau informasi tentang kamu itu seperti diary rahasia. Nggak semua orang boleh baca kan? Same thing dengan data di internet! Kamu sudah di jalan yang benar dengan belajar ini! ⭐"
    };

    // Check for keywords
    for (const [keyword, response] of Object.entries(responses)) {
      if (lowerMessage.includes(keyword)) {
        return response;
      }
    }

    // Check if asking about non-security topics (polite rejection)
    const nonSecurityTopics = ['pr', 'sekolah', 'matematika', 'film', 'musik', 'olahraga', 'makanan'];
    for (const topic of nonSecurityTopics) {
      if (lowerMessage.includes(topic)) {
        return "Wah, pertanyaan yang seru! 😊 Tapi aku adalah ahli keamanan internet, jadi aku hanya bisa bantu soal password, privasi, dan keamanan online. Yuk, tanya lagi tentang hal-hal itu! Aku siap membantu! 🛡️✨";
      }
    }

    // Generic encouraging responses
    const genericResponses = [
      "Halo, Privacy Guardian! 🌟 Aku siap membantu kamu belajar tentang keamanan internet! Mau tanya tentang password, informasi pribadi, atau game edukatif di aplikasi ini? Yuk, tanya apa aja! 🛡️",
      
      "Hai! 😊 Keren banget kamu mau belajar tentang keamanan online! Aku bisa bantu kamu jadi Privacy Guardian yang hebat. Mau bahas tentang apa nih? Password? Privasi? Atau game seru di Privykids? 🚀",
      
      "Wah, seneng banget bisa ngobrol sama kamu! 🎯 Aku spesialis keamanan internet untuk anak-anak. Yuk, kita bahas tentang cara aman berinternet! Kamu pasti jadi ahli privasi yang keren! 🏆",
      
      "Halo, teman! 👋 Aku Privacy Pal, dan aku di sini buat bantu kamu jadi jagoan keamanan internet! Mau tanya tentang password yang kuat? Atau cara melindungi data pribadi? Ayo tanya! 🛡️⭐"
    ];

    return genericResponses[Math.floor(Math.random() * genericResponses.length)];
  }

  async isServiceAvailable(): Promise<boolean> {
    try {
      if (!this.baseUrl || !this.apiKey) return false;
      
      // Simple test to check if we can create an assistant
      await this.createAssistant();
      return true;
    } catch {
      return false;
    }
  }

  async getServiceStatus(): Promise<{
    available: boolean;
    latency: number;
    requestCount: number;
    hasAssistant: boolean;
    hasThread: boolean;
    error?: string;
  }> {
    const startTime = Date.now();
    
    try {
      const available = await this.isServiceAvailable();
      const latency = Date.now() - startTime;
      
      return { 
        available, 
        latency, 
        requestCount: this.requestCount,
        hasAssistant: !!this.assistantId,
        hasThread: !!this.currentThreadId
      };
    } catch (error) {
      const latency = Date.now() - startTime;
      return { 
        available: false, 
        latency, 
        requestCount: this.requestCount,
        hasAssistant: false,
        hasThread: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  getRequestCount(): number {
    return this.requestCount;
  }

  resetRequestCount(): void {
    this.requestCount = 0;
  }

  getCurrentThreadId(): string | null {
    return this.currentThreadId;
  }

  getAssistantId(): string | null {
    return this.assistantId;
  }

  // Cleanup method
  async cleanup(): Promise<void> {
    try {
      // Could implement assistant/thread cleanup if needed
      console.log('🧹 OpenAI Assistant service cleanup completed');
    } catch (error) {
      console.error('❌ Error during cleanup:', error);
    }
  }
}

// Export singleton instance
export const openAIService = new OpenAIAssistantService(); 