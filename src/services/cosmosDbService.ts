import { CosmosClient, Database, Container, PartitionKeyDefinition } from '@azure/cosmos';
import { AZURE_CONFIG, logConfigStatus } from '../config/azure';
import { UserProgress } from '../types';
import { 
  UserProgressDocument, 
  AchievementDocument, 
  ChatHistoryDocument,
  DatabaseOperationResult,
  BaseDocument 
} from '../types/database';
import { v4 as uuidv4 } from 'uuid';

interface ContainerConfig {
  id: string;
  partitionKey: PartitionKeyDefinition;
  throughput?: number;
}

class CosmosDbService {
  private client: CosmosClient;
  private database: Database | null = null;
  private containers: Map<string, Container> = new Map();
  private isInitialized = false;
  private initializationPromise: Promise<void> | null = null;
  private userId: string;

  constructor() {
    // Validate configuration on startup
    const validation = logConfigStatus();
    
    if (!validation.canUseCosmosDb) {
      console.warn('🚨 Cosmos DB not available - using offline mode only');
      this.client = null as any;
      return;
    }

    this.client = new CosmosClient({
      endpoint: AZURE_CONFIG.cosmosDb.endpoint,
      key: AZURE_CONFIG.cosmosDb.key,
    });

    this.userId = this.generateUserId();
    console.log('👤 User ID:', this.userId);
  }

  private async initialize(): Promise<void> {
    if (this.isInitialized) return;
    if (this.initializationPromise) return this.initializationPromise;

    this.initializationPromise = this._doInitialize();
    return this.initializationPromise;
  }

  private async _doInitialize(): Promise<void> {
    if (!this.client) {
      throw new Error('Cosmos DB client not available');
    }

    try {
      console.log('🔧 Initializing Cosmos DB...');

      // Create or get database
      const { database } = await this.client.databases.createIfNotExists({
        id: AZURE_CONFIG.cosmosDb.databaseId,
        throughput: 400 // Shared throughput for cost optimization
      });
      this.database = database;
      console.log('✅ Database ready:', AZURE_CONFIG.cosmosDb.databaseId);

      // Define container configurations
      const containerConfigs: ContainerConfig[] = [
        {
          id: AZURE_CONFIG.cosmosDb.containers.userProgress,
          partitionKey: { paths: ['/userId'] }
        },
        {
          id: AZURE_CONFIG.cosmosDb.containers.achievements,
          partitionKey: { paths: ['/userId'] }
        },
        {
          id: AZURE_CONFIG.cosmosDb.containers.chatHistory,
          partitionKey: { paths: ['/userId'] }
        }
      ];

      // Create containers
      for (const config of containerConfigs) {
        try {
          const { container } = await database.containers.createIfNotExists({
            id: config.id,
            partitionKey: config.partitionKey,
            throughput: config.throughput
          });
          
          this.containers.set(config.id, container);
          console.log('✅ Container ready:', config.id);
        } catch (error) {
          console.error(`❌ Failed to create container ${config.id}:`, error);
          throw error;
        }
      }

      this.isInitialized = true;
      console.log('🎉 Cosmos DB initialization complete!');
    } catch (error) {
      console.error('💥 Cosmos DB initialization failed:', error);
      this.isInitialized = false;
      this.initializationPromise = null;
      throw error;
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

  private getContainer(containerName: string): Container {
    const container = this.containers.get(containerName);
    if (!container) {
      throw new Error(`Container ${containerName} not initialized`);
    }
    return container;
  }

  // User Progress Operations
  async getUserProgress(): Promise<DatabaseOperationResult<UserProgress>> {
    try {
      await this.initialize();
      
      const container = this.getContainer(AZURE_CONFIG.cosmosDb.containers.userProgress);
      const query = `SELECT * FROM c WHERE c.userId = @userId ORDER BY c.updatedAt DESC`;
      
      const { resources } = await container.items.query({
        query,
        parameters: [{ name: '@userId', value: this.userId }]
      }).fetchAll();
      
      if (resources.length > 0) {
        const doc = resources[0] as UserProgressDocument;
        const progress: UserProgress = {
          level: doc.level,
          totalPoints: doc.totalPoints,
          badges: doc.badges,
          completedQuizzes: doc.completedQuizzes,
          completedGames: doc.completedGames,
          streakDays: doc.streakDays
        };
        
        console.log('📊 User progress loaded from Cosmos DB');
        return { success: true, data: progress };
      } else {
        // Return default progress for new users
        const defaultProgress: UserProgress = {
          level: 1,
          totalPoints: 0,
          badges: [],
          completedQuizzes: [],
          completedGames: [],
          streakDays: 1
        };
        
        console.log('🆕 New user - returning default progress');
        return { success: true, data: defaultProgress };
      }
    } catch (error) {
      console.error('❌ Error getting user progress from Cosmos DB:', error);
      
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
    try {
      await this.initialize();
      
      const container = this.getContainer(AZURE_CONFIG.cosmosDb.containers.userProgress);
      const now = new Date();
      
      // Try to find existing document
      const query = `SELECT * FROM c WHERE c.userId = @userId ORDER BY c.updatedAt DESC`;
      const { resources } = await container.items.query({
        query,
        parameters: [{ name: '@userId', value: this.userId }]
      }).fetchAll();
      
      if (resources.length > 0) {
        // Update existing document
        const existingDoc = resources[0] as UserProgressDocument;
        const updatedDoc: UserProgressDocument = {
          ...existingDoc,
          ...progress,
          updatedAt: now,
          version: existingDoc.version + 1
        };
        
        await container.item(existingDoc.id, this.userId).replace(updatedDoc);
        console.log('📝 User progress updated in Cosmos DB');
      } else {
        // Create new document
        const newDoc: UserProgressDocument = {
          id: uuidv4(),
          partitionKey: this.userId,
          userId: this.userId,
          ...progress,
          createdAt: now,
          updatedAt: now,
          version: 1,
          lastLoginDate: now,
          preferences: {
            theme: 'light',
            notifications: true,
            language: 'en'
          }
        };
        
        await container.items.create(newDoc);
        console.log('🆕 New user progress created in Cosmos DB');
      }
      
      // Also save to localStorage as backup
      this.setFallbackProgress(progress);
      
      return { success: true };
    } catch (error) {
      console.error('❌ Error updating user progress in Cosmos DB:', error);
      
      // Fallback to localStorage
      this.setFallbackProgress(progress);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error',
        fromCache: true 
      };
    }
  }

  // Chat History Operations
  async saveChatHistory(messages: any[], sessionId?: string): Promise<DatabaseOperationResult<void>> {
    try {
      await this.initialize();
      
      const container = this.getContainer(AZURE_CONFIG.cosmosDb.containers.chatHistory);
      const now = new Date();
      const currentSessionId = sessionId || uuidv4();
      
      const chatDoc: ChatHistoryDocument = {
        id: uuidv4(),
        partitionKey: this.userId,
        userId: this.userId,
        sessionId: currentSessionId,
        messages: messages.map(msg => ({
          ...msg,
          timestamp: msg.timestamp || now
        })),
        lastMessageAt: now,
        createdAt: now,
        updatedAt: now,
        version: 1
      };
      
      await container.items.create(chatDoc);
      console.log('💬 Chat history saved to Cosmos DB');
      
      return { success: true };
    } catch (error) {
      console.error('❌ Error saving chat history:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  // Achievement Operations
  async saveAchievement(achievementId: string, progress: number = 100): Promise<DatabaseOperationResult<void>> {
    try {
      await this.initialize();
      
      const container = this.getContainer(AZURE_CONFIG.cosmosDb.containers.achievements);
      const now = new Date();
      
      const achievementDoc: AchievementDocument = {
        id: uuidv4(),
        partitionKey: this.userId,
        userId: this.userId,
        achievementId,
        unlockedAt: now,
        progress,
        isCompleted: progress >= 100,
        createdAt: now,
        updatedAt: now,
        version: 1
      };
      
      await container.items.create(achievementDoc);
      console.log('🏆 Achievement saved to Cosmos DB:', achievementId);
      
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
    try {
      if (!this.client) return false;
      
      await this.initialize();
      
      // Perform a simple read operation to test connectivity
      const container = this.getContainer(AZURE_CONFIG.cosmosDb.containers.userProgress);
      await container.items.query('SELECT VALUE COUNT(1) FROM c WHERE c.userId = @userId', {
        parameters: [{ name: '@userId', value: this.userId }]
      }).fetchAll();
      
      console.log('✅ Cosmos DB service is available');
      return true;
    } catch (error) {
      console.warn('⚠️ Cosmos DB service unavailable:', error);
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

  // Cleanup method
  async cleanup(): Promise<void> {
    try {
      // Perform any necessary cleanup
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