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
    
    if (lowerMessage.includes('password') || lowerMessage.includes('kata sandi')) {
      return '🔐 Halo! Kata sandi yang kuat itu penting banget lho! Pastikan kata sandimu unik dan jangan dibagi sama siapa-siapa ya! 😊';
    } else if (lowerMessage.includes('pribadi') || lowerMessage.includes('personal')) {
      return '🛡️ Wah, pertanyaan tentang privasi nih! Ingat ya, jangan pernah kasih tau informasi pribadi kayak nama lengkap, alamat, atau nomor telepon ke orang yang nggak kamu kenal di internet! 🌟';
    } else if (lowerMessage.includes('aman') || lowerMessage.includes('safety')) {
      return '⭐ Bagus banget kamu mau belajar tentang keamanan internet! Selalu minta izin orang tua sebelum download atau install aplikasi baru ya! 🎉';
    } else {
      return '😊 Halo! Aku Privacy Pal, teman kamu untuk belajar keamanan internet! Ayo tanya tentang password, privasi, atau keamanan online! 🌈';
    }
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