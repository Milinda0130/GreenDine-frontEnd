import React, { useState, useEffect } from 'react';
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
  CheckCircle,
  Loader2
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { orderApiService, OrderDTO } from '../../services/orderApi';
import { reservationApiService, ReservationDTO } from '../../services/reservationApi';

export const LandingPage: React.FC = () => {
  const { user } = useAuth();
  const { wasteAnalyses } = useApp();
  
  // State for real-time data
  const [orders, setOrders] = useState<OrderDTO[]>([]);
  const [reservations, setReservations] = useState<ReservationDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load data from backend APIs
  useEffect(() => {
    loadBackendData();
  }, []);

  const loadBackendData = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Load data in parallel
      const [ordersData, reservationsData] = await Promise.all([
        orderApiService.getAllOrders().catch(err => {
          console.error('Error loading orders:', err);
          return [];
        }),
        reservationApiService.getAllReservations().catch(err => {
          console.error('Error loading reservations:', err);
          return [];
        })
      ]);

      setOrders(ordersData || []);
      setReservations(reservationsData || []);
      
      console.log('Landing page data loaded:', {
        orders: ordersData?.length || 0,
        reservations: reservationsData?.length || 0,
        wasteAnalyses: wasteAnalyses.length
      });
    } catch (err) {
      console.error('Error loading landing page data:', err);
      setError('Failed to load data');
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate real-time statistics
  const calculateStats = () => {
    const totalOrders = orders.length;
    const totalReservations = reservations.length;
    
    // Calculate average waste percentage
    const avgWastePercentage = wasteAnalyses.length > 0 
      ? wasteAnalyses.reduce((sum, analysis) => sum + analysis.wastePercentage, 0) / wasteAnalyses.length 
      : 0;
    
    // Calculate total revenue
    const totalRevenue = orders.reduce((sum, order) => sum + (order.total || 0), 0);
    
    // Calculate orders this month
    const thisMonth = new Date();
    const ordersThisMonth = orders.filter(order => {
      if (!order.timestamp) return false;
      const orderDate = new Date(order.timestamp);
      return orderDate.getMonth() === thisMonth.getMonth() && 
             orderDate.getFullYear() === thisMonth.getFullYear();
    }).length;

    return {
      totalOrders,
      totalReservations,
      avgWastePercentage,
      totalRevenue,
      ordersThisMonth
    };
  };

  const stats = calculateStats();

    // Dynamic stats for the hero section
  const heroStats = [
    { 
      value: `${stats.totalOrders}`, 
      label: 'Total Orders Processed',
      icon: ShoppingCart
    },
    { 
      value: `${stats.totalReservations}`, 
      label: 'Reservations Made',
      icon: Calendar
    },
    { 
      value: `${stats.avgWastePercentage.toFixed(1)}%`, 
      label: 'Average Food Waste',
      icon: TrendingDown
    }
  ];

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
      icon: BarChart3,
      title: 'Analytics Dashboard',
      description: 'Get insights into sales, inventory, and sustainability metrics'
    }
  ];

  if (user) {
    return (
      <div className="bg-gray-50">
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
              {isLoading ? (
                <div className="flex justify-center items-center py-8">
                  <Loader2 className="h-8 w-8 text-green-600 animate-spin" />
                  <span className="ml-2 text-gray-600">Loading your data...</span>
                </div>
              ) : error ? (
                <div className="text-center py-8">
                  <p className="text-gray-600">Unable to load data at the moment</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600">{stats.ordersThisMonth}</div>
                    <div className="text-gray-600">Orders This Month</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600">{stats.avgWastePercentage.toFixed(1)}%</div>
                    <div className="text-gray-600">Average Waste</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600">{wasteAnalyses.length}</div>
                    <div className="text-gray-600">Scans Completed</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600">{stats.totalReservations}</div>
                    <div className="text-gray-600">Reservations Made</div>
                  </div>
                </div>
              )}
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

            {/* Dynamic Stats */}
            {isLoading ? (
              <div className="flex justify-center items-center py-8">
                <Loader2 className="h-8 w-8 text-white animate-spin" />
                <span className="ml-2 text-green-100">Loading live data...</span>
              </div>
            ) : error ? (
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 max-w-4xl mx-auto">
                {/* Fallback stats when data can't be loaded */}
                <div className="text-center">
                  <div className="text-3xl md:text-4xl font-bold mb-2">150+</div>
                  <div className="text-green-100">Orders Processed</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl md:text-4xl font-bold mb-2">85%</div>
                  <div className="text-green-100">Waste Reduction</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl md:text-4xl font-bold mb-2">95%</div>
                  <div className="text-green-100">Customer Satisfaction</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl md:text-4xl font-bold mb-2">60%</div>
                  <div className="text-green-100">Cost Savings</div>
                </div>
              </div>
                         ) : (
               <div className="flex justify-center">
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl">
                   {heroStats.map((stat, index) => {
                     const Icon = stat.icon;
                     return (
                       <div key={index} className="text-center">
                         <div className="flex items-center justify-center mb-2">
                           <Icon className="h-6 w-6 text-green-300 mr-2" />
                           <div className="text-3xl md:text-4xl font-bold">{stat.value}</div>
                         </div>
                         <div className="text-green-100 text-sm">{stat.label}</div>
                       </div>
                     );
                   })}
                 </div>
               </div>
             )}
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