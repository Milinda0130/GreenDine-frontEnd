import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Utensils, 
  Leaf, 
  BarChart3, 
  Camera, 
  Calendar, 
  ShoppingCart,
  Award,
  Users,
  TrendingDown,
  CheckCircle
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const LandingPage: React.FC = () => {
  const { user } = useAuth();

  const features = [
    {
      icon: ShoppingCart,
      title: 'Smart Ordering',
      description: 'Browse our sustainable menu and place orders with real-time tracking'
    },
    {
      icon: Calendar,
      title: 'Easy Reservations',
      description: 'Book tables seamlessly with our intelligent reservation system'
    },
    {
      icon: Camera,
      title: 'AI Waste Detection',
      description: 'Upload photos of your finished plates to track and reduce food waste'
    },
    {
      icon: Award,
      title: 'Rewards Program',
      description: 'Earn points for sustainable dining habits and low food waste'
    },
    {
      icon: BarChart3,
      title: 'Analytics Dashboard',
      description: 'Get insights into sales, inventory, and sustainability metrics'
    },
    {
      icon: TrendingDown,
      title: 'Waste Reduction',
      description: 'AI-powered solutions to minimize food waste and environmental impact'
    }
  ];

  const stats = [
    { value: '85%', label: 'Reduction in Food Waste' },
    { value: '2x', label: 'Faster Order Processing' },
    { value: '95%', label: 'Customer Satisfaction' },
    { value: '60%', label: 'Inventory Optimization' }
  ];

  if (user) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Welcome Section */}
        <div className="bg-gradient-to-br from-green-600 to-green-700 text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Welcome back, {user.name}!
            </h1>
            <p className="text-xl text-green-100 mb-8">
              {user.role === 'admin' 
                ? 'Manage your restaurant operations and track sustainability metrics'
                : 'Enjoy sustainable dining with AI-powered waste tracking'}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {user.role === 'customer' ? (
                <>
                  <Link
                    to="/menu"
                    className="bg-white text-green-600 hover:bg-green-50 px-8 py-3 rounded-lg font-semibold transition-colors"
                  >
                    Browse Menu
                  </Link>
                  <Link
                    to="/reservations"
                    className="bg-green-500 hover:bg-green-400 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
                  >
                    Make Reservation
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    to="/admin/dashboard"
                    className="bg-white text-green-600 hover:bg-green-50 px-8 py-3 rounded-lg font-semibold transition-colors"
                  >
                    View Dashboard
                  </Link>
                  <Link
                    to="/admin/orders"
                    className="bg-green-500 hover:bg-green-400 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
                  >
                    Manage Orders
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Quick Stats for Users */}
        {user.role === 'customer' && (
          <div className="py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Your Impact</h2>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">{user.points || 0}</div>
                  <div className="text-gray-600">Reward Points</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">3</div>
                  <div className="text-gray-600">Orders This Month</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">8.2%</div>
                  <div className="text-gray-600">Average Waste</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">12</div>
                  <div className="text-gray-600">Scans Completed</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-green-16 to-green-700 text-white overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-100"
          style={{
              backgroundImage: 'url(/src/components/Home/ezgif-27aea680095643.gif)'          }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-r from-black to-blue-700/40"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <div className="mb-8">
              <Utensils className="h-16 w-16 text-white mx-auto mb-4" />
              <h1 className="text-5xl md:text-6xl font-bold mb-6">
                Green Dine
              </h1>
              
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link
                to="/SignupData"
                className="bg-white text-green-600 hover:bg-green-50 px-8 py-3 rounded-lg font-semibold transition-colors"
              >
                Get Started
              </Link>
              <Link
                to="/login"
                className="bg-green-500 hover:bg-green-400 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
              >
                Sign In
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 max-w-4xl mx-auto">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl md:text-4xl font-bold mb-2">{stat.value}</div>
                  <div className="text-green-100">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-24 bg-gradient-to-br from-gray-50 to-green-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Revolutionary Restaurant Technology
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Streamline operations, reduce waste, and enhance customer experience with our AI-powered platform
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="bg-white rounded-xl shadow-sm p-8 hover:shadow-lg transition-all duration-300 transform hover:scale-105 border border-green-100">
                  <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center mb-6">
                    <Icon className="h-6 w-6 text-green-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-8">
                Transforming Restaurant Operations
              </h2>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <CheckCircle className="h-6 w-6 text-green-600 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Smart Menu Management</h3>
                    <p className="text-gray-600">Dynamic pricing and real-time availability updates</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <CheckCircle className="h-6 w-6 text-green-600 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Predictive Analytics</h3>
                    <p className="text-gray-600">AI-driven insights for inventory and demand forecasting</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <CheckCircle className="h-6 w-6 text-green-600 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Sustainability Focus</h3>
                    <p className="text-gray-600">Reduce waste and environmental impact with smart technology</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <CheckCircle className="h-6 w-6 text-green-600 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Customer Engagement</h3>
                    <p className="text-gray-600">Reward system that encourages sustainable dining habits</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-8">
              <div className="grid grid-cols-2 gap-8">
                <div className="text-center">
                  <Leaf className="h-12 w-12 text-green-600 mx-auto mb-4" />
                  <div className="text-2xl font-bold text-gray-900">Eco-Friendly</div>
                  <div className="text-gray-600">Sustainable operations</div>
                </div>
                <div className="text-center">
                  <BarChart3 className="h-12 w-12 text-green-600 mx-auto mb-4" />
                  <div className="text-2xl font-bold text-gray-900">Data-Driven</div>
                  <div className="text-gray-600">Smart analytics</div>
                </div>
                <div className="text-center">
                  <Users className="h-12 w-12 text-green-600 mx-auto mb-4" />
                  <div className="text-2xl font-bold text-gray-900">User-Friendly</div>
                  <div className="text-gray-600">Intuitive interface</div>
                </div>
                <div className="text-center">
                  <TrendingDown className="h-12 w-12 text-green-600 mx-auto mb-4" />
                  <div className="text-2xl font-bold text-gray-900">Cost Effective</div>
                  <div className="text-gray-600">Reduce operational costs</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="relative py-24 bg-black text-white overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-100"
          style={{
            backgroundImage: 'url(/src/components/Home/hh.gif)'
          }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-r from-black to-blue-700/40"></div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-4">
            Ready to Transform Your Restaurant?
          </h2>
          <p className="text-xl text-green-100 mb-8">
            Join the sustainable dining revolution with Green Dine's AI-powered platform
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="bg-white text-green-600 hover:bg-green-50 px-8 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              Start Free Trial
            </Link>
            <Link
              to="/login"
              className="bg-green-500 hover:bg-green-400 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              Schedule Demo
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};