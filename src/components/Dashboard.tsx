import React from 'react';
import { Star, Trophy, ChevronRight, Award, Target, TrendingUp } from 'lucide-react';
import { UserProgress, Achievement } from '../types';

interface DashboardProps {
  userProgress: UserProgress;
  achievements: Achievement[];
  setCurrentView: (view: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ userProgress, achievements, setCurrentView }) => {
  const unlockedAchievements = achievements.filter(a => a.unlocked);
  const nextLevel = userProgress.level + 1;
  const pointsNeeded = nextLevel * 100 - userProgress.totalPoints;

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-8 text-white shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold mb-2">Welcome back, Privacy Cadet! 🚀</h2>
            <p className="text-blue-100 text-lg">Ready for another adventure in digital safety?</p>
          </div>
          <div className="text-center">
            <div className="bg-white/20 rounded-full p-4 mb-2">
              <Trophy className="h-12 w-12" />
            </div>
            <p className="text-sm font-semibold">Level {userProgress.level}</p>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-lg border-l-4 border-blue-500">
          <div className="flex items-center gap-4">
            <div className="bg-blue-100 p-3 rounded-full">
              <Star className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-800">{userProgress.totalPoints}</h3>
              <p className="text-gray-600 font-medium">Total Points</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg border-l-4 border-green-500">
          <div className="flex items-center gap-4">
            <div className="bg-green-100 p-3 rounded-full">
              <Award className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-800">{unlockedAchievements.length}</h3>
              <p className="text-gray-600 font-medium">Badges Earned</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg border-l-4 border-orange-500">
          <div className="flex items-center gap-4">
            <div className="bg-orange-100 p-3 rounded-full">
              <TrendingUp className="h-6 w-6 text-orange-600" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-800">{userProgress.streakDays}</h3>
              <p className="text-gray-600 font-medium">Day Streak</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-2 gap-6">
        <button
          onClick={() => setCurrentView('quizzes')}
          className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 text-left group"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="bg-blue-100 p-3 rounded-full group-hover:bg-blue-200 transition-colors">
              <Target className="h-6 w-6 text-blue-600" />
            </div>
            <ChevronRight className="h-6 w-6 text-gray-400 group-hover:text-blue-600 transition-colors" />
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">Knowledge Missions</h3>
          <p className="text-gray-600">Test your privacy knowledge and earn points!</p>
          <div className="mt-4 text-sm text-blue-600 font-semibold">
            {userProgress.completedQuizzes.length} missions completed
          </div>
        </button>

        <button
          onClick={() => setCurrentView('games')}
          className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 text-left group"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="bg-purple-100 p-3 rounded-full group-hover:bg-purple-200 transition-colors">
              <Award className="h-6 w-6 text-purple-600" />
            </div>
            <ChevronRight className="h-6 w-6 text-gray-400 group-hover:text-purple-600 transition-colors" />
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">Safety Simulators</h3>
          <p className="text-gray-600">Play fun games while learning digital safety!</p>
          <div className="mt-4 text-sm text-purple-600 font-semibold">
            {userProgress.completedGames.length} games completed
          </div>
        </button>
      </div>

      {/* Progress to Next Level */}
      <div className="bg-white rounded-2xl p-6 shadow-lg">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Progress to Level {nextLevel}</h3>
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <div className="bg-gray-200 rounded-full h-4 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-blue-500 to-purple-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.min((userProgress.totalPoints % 100) / 100 * 100, 100)}%` }}
              ></div>
            </div>
          </div>
          <span className="text-sm font-semibold text-gray-600">
            {pointsNeeded > 0 ? `${pointsNeeded} points to go!` : 'Level up available!'}
          </span>
        </div>
      </div>

      {/* Recent Achievements */}
      {unlockedAchievements.length > 0 && (
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Your Achievements 🏆</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {unlockedAchievements.slice(0, 4).map((achievement) => (
              <div key={achievement.id} className="text-center">
                <div className="text-4xl mb-2">{achievement.icon}</div>
                <h4 className="font-semibold text-sm text-gray-800">{achievement.name}</h4>
                <p className="text-xs text-gray-600">{achievement.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;