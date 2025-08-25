import React, { useState } from 'react';
import { Award, Gift, Star, Trophy, Zap, Leaf, Target, Crown } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';

export const RewardsPage: React.FC = () => {
  const { user } = useAuth();
  const { wasteAnalyses } = useApp();
  const [selectedReward, setSelectedReward] = useState<any>(null);

  const userPoints = user?.points || 0;
  const userAnalyses = wasteAnalyses.filter(analysis => analysis.customerId === user?.id);
  const totalPointsEarned = userAnalyses.reduce((sum, analysis) => sum + analysis.pointsEarned, 0);
  const averageWaste = userAnalyses.length > 0 
    ? userAnalyses.reduce((sum, analysis) => sum + analysis.wastePercentage, 0) / userAnalyses.length
    : 0;

  const achievements = [
    {
      id: 1,
      title: 'Eco Warrior',
      description: 'Complete 10 waste scans',
      icon: Leaf,
      progress: Math.min(userAnalyses.length, 10),
      target: 10,
      completed: userAnalyses.length >= 10,
      points: 50
    },
    {
      id: 2,
      title: 'Zero Waste Hero',
      description: 'Achieve less than 5% waste in 5 meals',
      icon: Trophy,
      progress: userAnalyses.filter(a => a.wastePercentage < 5).length,
      target: 5,
      completed: userAnalyses.filter(a => a.wastePercentage < 5).length >= 5,
      points: 100
    },
    {
      id: 3,
      title: 'Sustainability Champion',
      description: 'Maintain average waste below 10%',
      icon: Crown,
      progress: averageWaste < 10 ? 1 : 0,
      target: 1,
      completed: averageWaste < 10 && userAnalyses.length >= 5,
      points: 75
    },
    {
      id: 4,
      title: 'Green Streak',
      description: 'Complete 3 consecutive low-waste meals',
      icon: Zap,
      progress: 2, // Mock progress
      target: 3,
      completed: false,
      points: 30
    }
  ];

  const rewards = [
    {
      id: 1,
      title: '10% Off Next Order',
      description: 'Get 10% discount on your next meal',
      points: 100,
      category: 'discount',
      image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400',
      available: userPoints >= 100
    },
    {
      id: 2,
      title: 'Free Appetizer',
      description: 'Complimentary appetizer of your choice',
      points: 150,
      category: 'food',
      image: 'https://images.pexels.com/photos/539451/pexels-photo-539451.jpeg?auto=compress&cs=tinysrgb&w=400',
      available: userPoints >= 150
    },
    {
      id: 3,
      title: 'Free Eco-Smoothie',
      description: 'Complimentary organic smoothie',
      points: 80,
      category: 'beverage',
      image: 'https://images.pexels.com/photos/775032/pexels-photo-775032.jpeg?auto=compress&cs=tinysrgb&w=400',
      available: userPoints >= 80
    },
    {
      id: 4,
      title: '20% Off Next Order',
      description: 'Get 20% discount on your next meal',
      points: 200,
      category: 'discount',
      image: 'https://images.pexels.com/photos/1267320/pexels-photo-1267320.jpeg?auto=compress&cs=tinysrgb&w=400',
      available: userPoints >= 200
    },
    {
      id: 5,
      title: 'Free Dessert',
      description: 'Complimentary dessert of your choice',
      points: 120,
      category: 'food',
      image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400',
      available: userPoints >= 120
    },
    {
      id: 6,
      title: 'VIP Table Reservation',
      description: 'Priority booking for premium tables',
      points: 300,
      category: 'experience',
      image: 'https://images.pexels.com/photos/1581384/pexels-photo-1581384.jpeg?auto=compress&cs=tinysrgb&w=400',
      available: userPoints >= 300
    }
  ];

  const tiers = [
    { name: 'Green Starter', min: 0, max: 99, color: 'bg-gray-400', benefits: ['Basic rewards', 'Waste tracking'] },
    { name: 'Eco Explorer', min: 100, max: 299, color: 'bg-green-400', benefits: ['10% discounts', 'Free appetizers', 'Priority support'] },
    { name: 'Sustainability Pro', min: 300, max: 599, color: 'bg-blue-400', benefits: ['15% discounts', 'Free meals', 'VIP reservations'] },
    { name: 'Green Champion', min: 600, max: 999, color: 'bg-purple-400', benefits: ['20% discounts', 'Exclusive events', 'Personal eco-advisor'] },
    { name: 'Eco Legend', min: 1000, max: Infinity, color: 'bg-yellow-400', benefits: ['25% discounts', 'Free monthly meal', 'Beta features'] }
  ];

  const currentTier = tiers.find(tier => userPoints >= tier.min && userPoints <= tier.max) || tiers[0];
  const nextTier = tiers.find(tier => tier.min > userPoints);
  const progressToNext = nextTier ? ((userPoints - currentTier.min) / (nextTier.min - currentTier.min)) * 100 : 100;

  const redeemReward = (reward: any) => {
    if (reward.available) {
      setSelectedReward(reward);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-green-50">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-yellow-500 to-green-600 text-white py-16">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{
            backgroundImage: 'url(https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=1200)'
          }}
        ></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Award className="h-16 w-16 text-white mx-auto mb-4" />
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Rewards & Achievements</h1>
          <p className="text-xl text-yellow-100 max-w-2xl mx-auto">
            Earn points for sustainable dining and unlock amazing rewards!
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Points Overview */}
        <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-2xl text-white p-8 mb-12 shadow-xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">{userPoints}</div>
              <div className="text-green-100">Available Points</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">{totalPointsEarned}</div>
              <div className="text-green-100">Total Earned</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">{averageWaste.toFixed(1)}%</div>
              <div className="text-green-100">Average Waste</div>
            </div>
          </div>
        </div>

        {/* Tier Progress */}
        <div className="bg-white rounded-xl shadow-sm p-8 mb-12 border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Tier Progress</h2>
          
          <div className="flex items-center space-x-4 mb-6">
            <div className={`w-12 h-12 rounded-full ${currentTier.color} flex items-center justify-center`}>
              <Crown className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900">{currentTier.name}</h3>
              <p className="text-gray-600">
                {nextTier ? `${nextTier.min - userPoints} points to ${nextTier.name}` : 'Maximum tier reached!'}
              </p>
            </div>
          </div>

          {nextTier && (
            <div className="mb-6">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>{currentTier.min} pts</span>
                <span>{nextTier.min} pts</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className={`h-3 rounded-full ${currentTier.color}`}
                  style={{ width: `${progressToNext}%` }}
                ></div>
              </div>
            </div>
          )}

          <div>
            <h4 className="font-semibold text-gray-900 mb-2">Current Benefits:</h4>
            <div className="flex flex-wrap gap-2">
              {currentTier.benefits.map((benefit, index) => (
                <span key={index} className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                  {benefit}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Achievements */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Achievements</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {achievements.map(achievement => {
              const Icon = achievement.icon;
              const progressPercentage = (achievement.progress / achievement.target) * 100;
              
              return (
                <div key={achievement.id} className={`bg-white rounded-xl shadow-sm p-6 border-2 transition-all ${
                  achievement.completed 
                    ? 'border-green-200 bg-green-50' 
                    : 'border-gray-100 hover:border-green-200'
                }`}>
                  <div className="flex items-start space-x-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      achievement.completed ? 'bg-green-600' : 'bg-gray-400'
                    }`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-gray-900">{achievement.title}</h3>
                        {achievement.completed && (
                          <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                            +{achievement.points} pts
                          </span>
                        )}
                      </div>
                      <p className="text-gray-600 text-sm mb-3">{achievement.description}</p>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Progress</span>
                          <span className="font-medium">
                            {achievement.progress}/{achievement.target}
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full transition-all ${
                              achievement.completed ? 'bg-green-600' : 'bg-blue-400'
                            }`}
                            style={{ width: `${Math.min(progressPercentage, 100)}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Available Rewards */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Available Rewards</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rewards.map(reward => (
              <div key={reward.id} className={`bg-white rounded-xl shadow-sm overflow-hidden border transition-all ${
                reward.available 
                  ? 'border-green-200 hover:shadow-md cursor-pointer' 
                  : 'border-gray-200 opacity-60'
              }`}>
                <div className="relative">
                  <img
                    src={reward.image}
                    alt={reward.title}
                    className="w-full h-48 object-cover"
                  />
                  {!reward.available && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                      <div className="text-white text-center">
                        <Target className="h-8 w-8 mx-auto mb-2" />
                        <p className="text-sm">Need {reward.points - userPoints} more points</p>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{reward.title}</h3>
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 text-yellow-500" />
                      <span className="font-bold text-gray-900">{reward.points}</span>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 text-sm mb-4">{reward.description}</p>
                  
                  <button
                    onClick={() => redeemReward(reward)}
                    disabled={!reward.available}
                    className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
                      reward.available
                        ? 'bg-green-600 hover:bg-green-700 text-white'
                        : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    {reward.available ? 'Redeem Now' : 'Not Available'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Reward Redemption Modal */}
        {selectedReward && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl max-w-md w-full">
              <div className="p-6">
                <div className="text-center mb-6">
                  <Gift className="h-16 w-16 text-green-600 mx-auto mb-4" />
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Redeem Reward</h2>
                  <p className="text-gray-600">Are you sure you want to redeem this reward?</p>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <h3 className="font-semibold text-gray-900 mb-1">{selectedReward.title}</h3>
                  <p className="text-gray-600 text-sm mb-2">{selectedReward.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Cost:</span>
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 text-yellow-500" />
                      <span className="font-bold">{selectedReward.points} points</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex space-x-3">
                  <button
                    onClick={() => setSelectedReward(null)}
                    className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      // Here you would handle the actual redemption
                      setSelectedReward(null);
                    }}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg transition-colors"
                  >
                    Confirm Redemption
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};