export interface BaseDocument {
  id: string;
  partitionKey: string;
  createdAt: Date;
  updatedAt: Date;
  version: number;
}

export interface UserProgressDocument extends BaseDocument {
  userId: string;
  level: number;
  totalPoints: number;
  badges: string[];
  completedQuizzes: string[];
  completedGames: string[];
  streakDays: number;
  lastLoginDate: Date;
  preferences: {
    theme: 'light' | 'dark';
    notifications: boolean;
    language: string;
  };
}

export interface AchievementDocument extends BaseDocument {
  userId: string;
  achievementId: string;
  unlockedAt: Date;
  progress: number;
  isCompleted: boolean;
}

export interface ChatHistoryDocument extends BaseDocument {
  userId: string;
  sessionId: string;
  messages: {
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
  }[];
  lastMessageAt: Date;
}

export interface DatabaseOperationResult<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  fromCache?: boolean;
} 