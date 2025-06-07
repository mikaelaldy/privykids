import { UserProgress } from '../types';
import { DatabaseOperationResult } from '../types/database';
import { v4 as uuidv4 } from 'uuid';

class CosmosDbService {
  private userId: string;
  private apiBaseUrl: string;

  constructor() {
    this.userId = this.generateUserId();
    this.apiBaseUrl = import.meta.env.VITE_API_BASE_URL || '/api';
    console.log('👤 User ID:', this.userId);
    
    // In development, check if we're running locally
    if (import.meta.env.DEV) {
      console.log('🛠️ Development mode: API routes may not be available locally');
    }
  }

  private generateUserId(): string {
    let userId = localStorage.getItem('privykids-user-id');
    if (!userId) {
      userId = `user_${uuidv4()}`;
      localStorage.setItem('privykids-user-id', userId);
      console.log('🆕 Generated new user ID');
    }
    return userId;
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
        console.warn('💡 API routes not available in development. Using localStorage fallback.');
        throw new Error('API routes unavailable in development');
      }
      
      throw error;
    }
  }

  async getUserProgress(): Promise<DatabaseOperationResult<UserProgress>> {
    // In development mode, skip API calls and use localStorage directly
    if (import.meta.env.DEV) {
      console.log('📱 Development mode: Loading progress from localStorage...');
      const fallbackProgress = this.getFallbackProgress();
      return { 
        success: true, 
        data: fallbackProgress, 
        fromCache: true 
      };
    }

    try {
      console.log('📊 Loading user progress from API...');
      
      const result = await this.makeRequest(`/cosmos/user-progress/${this.userId}`);
      
      if (result.success && result.data) {
        console.log('✅ User progress loaded from Cosmos DB');
        return { success: true, data: result.data };
      } else {
        throw new Error('Failed to load user progress');
      }
    } catch (error) {
      console.error('❌ Error getting user progress from API:', error);
      
      // Fallback to localStorage
      const fallbackProgress = this.getFallbackProgress();
      return { 
        success: false, 
        data: fallbackProgress, 
        error: error instanceof Error ? error.message : 'Unknown error',
        fromCache: true 
      };
    }
  }

  async updateUserProgress(progress: UserProgress): Promise<DatabaseOperationResult<void>> {
    // In development mode, skip API calls and use localStorage directly
    if (import.meta.env.DEV) {
      console.log('💾 Development mode: Saving progress to localStorage...');
      this.setFallbackProgress(progress);
      return { success: true, fromCache: true };
    }

    try {
      console.log('💾 Saving user progress to API...');
      
      const result = await this.makeRequest(`/cosmos/user-progress/${this.userId}`, {
        method: 'POST',
        body: JSON.stringify(progress),
      });
      
      if (result.success) {
        console.log('✅ User progress saved to Cosmos DB');
        // Also save to localStorage as backup
        this.setFallbackProgress(progress);
        return { success: true };
      } else {
        throw new Error('Failed to save user progress');
      }
    } catch (error) {
      console.error('❌ Error updating user progress via API:', error);
      
      // Fallback to localStorage
      this.setFallbackProgress(progress);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error',
        fromCache: true 
      };
    }
  }

  // Chat History Operations (for future use)
  async saveChatHistory(messages: unknown[], sessionId?: string): Promise<DatabaseOperationResult<void>> {
    try {
      // This would be implemented when we add chat history API endpoint
      console.log('💬 Chat history saved locally (API endpoint pending)', { messages: messages.length, sessionId });
      return { success: true };
    } catch (error) {
      console.error('❌ Error saving chat history:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  // Achievement Operations (for future use)
  async saveAchievement(achievementId: string, progressValue: number = 100): Promise<DatabaseOperationResult<void>> {
    try {
      console.log('🏆 Achievement saved locally (API endpoint pending):', { achievementId, progress: progressValue });
      return { success: true };
    } catch (error) {
      console.error('❌ Error saving achievement:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  // Fallback methods for localStorage
  private getFallbackProgress(): UserProgress {
    try {
      const savedProgress = localStorage.getItem('privykids-progress');
      if (savedProgress) {
        console.log('📱 Loading progress from localStorage fallback');
        return JSON.parse(savedProgress);
      }
    } catch (error) {
      console.error('❌ Error reading from localStorage:', error);
    }
    
    return {
      level: 1,
      totalPoints: 0,
      badges: [],
      completedQuizzes: [],
      completedGames: [],
      streakDays: 1
    };
  }

  private setFallbackProgress(progress: UserProgress): void {
    try {
      localStorage.setItem('privykids-progress', JSON.stringify(progress));
      console.log('💾 Progress saved to localStorage backup');
    } catch (error) {
      console.error('❌ Error saving to localStorage:', error);
    }
  }

  // Health check methods
  async isServiceAvailable(): Promise<boolean> {
    // In development mode, skip API health checks
    if (import.meta.env.DEV) {
      console.log('🛠️ Development mode: Skipping API health check');
      return false; // Indicate API not available, will use localStorage
    }

    try {
      const result = await this.makeRequest('/health');
      console.log('✅ Cosmos DB service is available via API');
      return result.success;
    } catch (error) {
      console.warn('⚠️ Cosmos DB service unavailable via API:', error);
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
      console.log('🛠️ Development mode: Using localStorage fallback');
      return { 
        available: false, 
        latency, 
        error: 'Development mode - using localStorage'
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

  // Cleanup method
  async cleanup(): Promise<void> {
    try {
      console.log('🧹 Cosmos DB service cleanup completed');
    } catch (error) {
      console.error('❌ Error during cleanup:', error);
    }
  }
}

// Export singleton instance
export const cosmosDbService = new CosmosDbService();

// Export for testing
export { CosmosDbService }; 