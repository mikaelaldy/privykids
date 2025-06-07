export interface UserProgress {
  level: number;
  totalPoints: number;
  badges: string[];
  completedQuizzes: string[];
  completedGames: string[];
  streakDays: number;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  points: number;
}

export interface Quiz {
  id: string;
  title: string;
  description: string;
  level: number;
  questions: QuizQuestion[];
  requiredLevel: number;
  requiredScore: number; // Percentage needed to pass (e.g., 75 for 75%)
}

export interface Game {
  id: string;
  title: string;
  description: string;
  component: string;
  requiredLevel: number;
  maxPoints: number;
}