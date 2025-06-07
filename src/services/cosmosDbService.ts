import { DatabaseOperationResult } from '../types/database';
import { UserProgress } from '../types';
import { getContainer, getUserId } from './cosmosdb';

// Check if Cosmos DB is available
const isCosmosDBAvailable = async (): Promise<boolean> => {
  try {
    const container = await getContainer('test');
    return container !== null;
  } catch {
    return false;
  }
};

class CosmosDbService {
  private userId: string;

  constructor() {
    this.userId = getUserId();
    console.log('📱 Using hybrid cloud-first storage with localStorage fallback');
  }

  // User Progress Storage
  async getUserProgress(): Promise<DatabaseOperationResult<UserProgress>> {
    try {
      const container = await getContainer('user-progress');
      if (!container) throw new Error('Cosmos DB not available');
      
      const userId = this.userId;
      const { resources } = await container.items
        .query({
          query: 'SELECT * FROM c WHERE c.userId = @userId AND c.type = @type ORDER BY c.lastUpdated DESC',
          parameters: [
            { name: '@userId', value: userId },
            { name: '@type', value: 'progress' }
          ]
        })
        .fetchAll();
      
      if (resources.length > 0) {
        console.log('✅ User progress loaded from Cosmos DB');
        return { 
          success: true, 
          data: resources[0].progress 
        };
      } else {
        // Return default progress if not found
        const defaultProgress = this.getDefaultProgress();
        return { 
          success: true, 
          data: defaultProgress 
        };
      }
    } catch {
      console.log('⚠️ Cosmos DB unavailable, using localStorage fallback');
      return { 
        success: true, 
        data: this.getUserProgressFromLocal(), 
        fromCache: true 
      };
    }
  }

  async updateUserProgress(progress: UserProgress): Promise<DatabaseOperationResult<void>> {
    try {
      const container = await getContainer('user-progress');
      if (!container) throw new Error('Cosmos DB not available');
      
      const userId = this.userId;
      const document = {
        id: `${userId}_${Date.now()}`,
        userId,
        progress,
        lastUpdated: new Date().toISOString(),
        type: 'progress'
      };
      
      await container.items.create(document);
      console.log('✅ User progress saved to Cosmos DB');
      
      // Also save to localStorage as backup
      this.saveUserProgressToLocal(progress);
      return { success: true };
    } catch {
      console.log('⚠️ Cosmos DB unavailable, using localStorage fallback');
      
      // Fallback to localStorage
      this.saveUserProgressToLocal(progress);
      return { 
        success: true, 
        fromCache: true 
      };
    }
  }

  // Chat History Storage
  async saveChatHistory(messages: unknown[], sessionId?: string): Promise<DatabaseOperationResult<void>> {
    try {
      const container = await getContainer('chat-history');
      if (!container) throw new Error('Cosmos DB not available');
      
      const userId = this.userId;
      const document = {
        id: `${userId}_${sessionId || 'default'}_${Date.now()}`,
        userId,
        sessionId: sessionId || 'default',
        messages,
        timestamp: new Date().toISOString(),
        type: 'chat'
      };
      
      await container.items.create(document);
      console.log('✅ Chat history saved to Cosmos DB');
      return { success: true };
    } catch {
      console.log('⚠️ Cosmos DB unavailable, using localStorage fallback');
      
      // Fallback to localStorage
      const chatHistory = {
        sessionId: sessionId || 'default',
        messages,
        timestamp: new Date().toISOString(),
        userId: this.userId
      };
      
      localStorage.setItem('privykids-chat-history', JSON.stringify(chatHistory));
      return { 
        success: true, 
        fromCache: true 
      };
    }
  }

  // Achievement Storage
  async saveAchievement(achievementId: string, progressValue: number = 100): Promise<DatabaseOperationResult<void>> {
    try {
      const container = await getContainer('achievements');
      if (!container) throw new Error('Cosmos DB not available');
      
      const userId = this.userId;
      const document = {
        id: `${userId}_${achievementId}`,
        userId,
        achievementId,
        progress: progressValue,
        unlockedAt: new Date().toISOString(),
        type: 'achievement'
      };
      
      await container.items.create(document);
      console.log('✅ Achievement saved to Cosmos DB');
      return { success: true };
    } catch {
      console.log('⚠️ Cosmos DB unavailable, using localStorage fallback');
      
      // Fallback to localStorage
      const achievements = this.getAchievementsFromLocal();
      achievements[achievementId] = {
        id: achievementId,
        progress: progressValue,
        unlockedAt: new Date().toISOString(),
        userId: this.userId
      };
      
      localStorage.setItem('privykids-achievements', JSON.stringify(achievements));
      return { 
        success: true, 
        fromCache: true 
      };
    }
  }

  // Get achievements
  async getAchievements(): Promise<DatabaseOperationResult<Record<string, unknown>>> {
    try {
      const container = await getContainer('achievements');
      if (!container) throw new Error('Cosmos DB not available');
      
      const userId = this.userId;
      const { resources } = await container.items
        .query({
          query: 'SELECT * FROM c WHERE c.userId = @userId AND c.type = @type',
          parameters: [
            { name: '@userId', value: userId },
            { name: '@type', value: 'achievement' }
          ]
        })
        .fetchAll();
      
      const achievements: Record<string, unknown> = {};
      resources.forEach(item => {
        achievements[item.achievementId] = {
          id: item.achievementId,
          progress: item.progress,
          unlockedAt: item.unlockedAt
        };
      });
      
      console.log('✅ Achievements loaded from Cosmos DB');
      return { success: true, data: achievements };
    } catch {
      console.log('⚠️ Cosmos DB unavailable, using localStorage fallback');
      return { 
        success: true, 
        data: this.getAchievementsFromLocal(), 
        fromCache: true 
      };
    }
  }

  // Fallback functions for localStorage
  private getDefaultProgress(): UserProgress {
    return {
      level: 1,
      totalPoints: 0,
      badges: [],
      completedQuizzes: [],
      completedGames: [],
      streakDays: 1
    };
  }

  private getUserProgressFromLocal(): UserProgress {
    const stored = localStorage.getItem('privykids-progress');
    return stored ? JSON.parse(stored) : this.getDefaultProgress();
  }

  private saveUserProgressToLocal(progress: UserProgress): void {
    localStorage.setItem('privykids-progress', JSON.stringify(progress));
    localStorage.setItem('privykids-progress-timestamp', new Date().toISOString());
    console.log('💾 Progress saved to localStorage backup');
  }

  private getAchievementsFromLocal(): Record<string, unknown> {
    const stored = localStorage.getItem('privykids-achievements');
    return stored ? JSON.parse(stored) : {};
  }

  // Health check methods
  async isServiceAvailable(): Promise<boolean> {
    return await isCosmosDBAvailable();
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
      
      return { 
        available, 
        latency,
        error: available ? undefined : 'Cosmos DB not available, using localStorage fallback'
      };
    } catch (error) {
      const latency = Date.now() - startTime;
      return { 
        available: false, 
        latency,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  // Get all stored data (for debugging)
  async getAllStoredData(): Promise<{
    userId: string;
    progress: UserProgress | null;
    chatHistory: unknown;
    achievements: unknown;
    timestamp: string | null;
    source: 'cosmos' | 'localStorage';
  }> {
    try {
      // Try Cosmos DB first
      const cosmosAvailable = await this.isServiceAvailable();
      
      if (cosmosAvailable) {
        const progressResult = await this.getUserProgress();
        const achievementsResult = await this.getAchievements();
        
        return {
          userId: this.userId,
          progress: progressResult.data || null,
          chatHistory: null, // Would need separate query
          achievements: achievementsResult.data || {},
          timestamp: new Date().toISOString(),
          source: 'cosmos'
        };
      } else {
        throw new Error('Cosmos DB not available');
      }
    } catch {
      // Fallback to localStorage
      return {
        userId: this.userId,
        progress: JSON.parse(localStorage.getItem('privykids-progress') || 'null'),
        chatHistory: JSON.parse(localStorage.getItem('privykids-chat-history') || 'null'),
        achievements: JSON.parse(localStorage.getItem('privykids-achievements') || '{}'),
        timestamp: localStorage.getItem('privykids-progress-timestamp'),
        source: 'localStorage'
      };
    }
  }

  // Clear all data (for testing)
  async clearAllData(): Promise<void> {
    try {
      // Clear localStorage
      localStorage.removeItem('privykids-progress');
      localStorage.removeItem('privykids-chat-history');
      localStorage.removeItem('privykids-achievements');
      localStorage.removeItem('privykids-progress-timestamp');
      // Don't remove user-id to maintain user identity
      
      console.log('🧹 All progress data cleared from localStorage');
      
      // Note: Cosmos DB data would need separate deletion logic
      // For hackathon purposes, localStorage clearing is sufficient
    } catch (error) {
      console.error('❌ Error clearing data:', error);
    }
  }

  // Test connection
  async testConnection(): Promise<boolean> {
    try {
      return await this.isServiceAvailable();
    } catch {
      return false;
    }
  }

  // Cleanup method
  async cleanup(): Promise<void> {
    try {
      console.log('🧹 CosmosDb service cleanup completed (hybrid storage)');
    } catch (error) {
      console.error('❌ Error during cleanup:', error);
    }
  }
}

// Export singleton instance
export const cosmosDbService = new CosmosDbService();

// Export for testing
export { CosmosDbService }; 