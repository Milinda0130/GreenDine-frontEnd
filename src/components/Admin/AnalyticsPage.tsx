import React, { useState } from 'react';
import { BarChart3, TrendingUp, TrendingDown, DollarSign, Users, Package, Calendar, PieChart, Activity, Target, Award } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const AnalyticsPage: React.FC = () => {
  const { orders, reservations, menuItems, inventory, wasteAnalyses } = useApp();
  const [selectedPeriod, setSelectedPeriod] = useState('7d');

  // Calculate analytics data
  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
  const totalOrders = orders.length;
  const totalReservations = reservations.length;
  const totalWasteAnalyses = wasteAnalyses.length;

  // Recent orders (last 30 days)
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const recentOrders = orders.filter(order => order.timestamp > thirtyDaysAgo);
  const recentRevenue = recentOrders.reduce((sum, order) => sum + order.total, 0);

  // Order status distribution
  const orderStatusCounts = orders.reduce((acc, order) => {
    acc[order.status] = (acc[order.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Top selling items
  const itemSales = orders.reduce((acc, order) => {
    order.items.forEach(item => {
      acc[item.name] = (acc[item.name] || 0) + item.quantity;
    });
    return acc;
  }, {} as Record<string, number>);

  const topSellingItems = Object.entries(itemSales)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5);

  // Reservation status distribution
  const reservationStatusCounts = reservations.reduce((acc, reservation) => {
    acc[reservation.status] = (acc[reservation.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Waste analysis stats
  const averageWastePercentage = wasteAnalyses.length > 0 
    ? wasteAnalyses.reduce((sum, analysis) => sum + analysis.wastePercentage, 0) / wasteAnalyses.length 
    : 0;

  const totalPointsAwarded = wasteAnalyses.reduce((sum, analysis) => sum + analysis.pointsEarned, 0);

  // Inventory value
  const totalInventoryValue = inventory.reduce((sum, item) => sum + (item.currentStock * item.cost), 0);

  // Monthly revenue (mock data for demonstration)
  const monthlyRevenue = [
    { month: 'Jan', revenue: 12500 },
    { month: 'Feb', revenue: 14200 },
    { month: 'Mar', revenue: 13800 },
    { month: 'Apr', revenue: 15600 },
    { month: 'May', revenue: 16200 },
    { month: 'Jun', revenue: 17800 },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'preparing':
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Analytics Dashboard</h1>
          <p className="text-gray-600">Comprehensive insights into your restaurant's performance</p>
        </div>

        {/* Period Selector */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8 border border-green-100">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Time Period</h2>
            <div className="flex space-x-2">
              {[
                { value: '7d', label: '7 Days' },
                { value: '30d', label: '30 Days' },
                { value: '90d', label: '90 Days' },
                { value: '1y', label: '1 Year' }
              ].map(period => (
                <button
                  key={period.value}
                  onClick={() => setSelectedPeriod(period.value)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedPeriod === period.value
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {period.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-green-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900">${totalRevenue.toFixed(2)}</p>
                <p className="text-sm text-green-600 flex items-center mt-1">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  +12.5% from last month
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-green-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Orders</p>
                <p className="text-2xl font-bold text-gray-900">{totalOrders}</p>
                <p className="text-sm text-green-600 flex items-center mt-1">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  +8.2% from last month
                </p>
              </div>
              <Package className="h-8 w-8 text-blue-600" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-green-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Reservations</p>
                <p className="text-2xl font-bold text-gray-900">{reservations.filter(r => r.status === 'confirmed').length}</p>
                <p className="text-sm text-green-600 flex items-center mt-1">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  +15.3% from last month
                </p>
              </div>
              <Users className="h-8 w-8 text-purple-600" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-green-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Waste Reduction</p>
                <p className="text-2xl font-bold text-gray-900">{averageWastePercentage.toFixed(1)}%</p>
                <p className="text-sm text-green-600 flex items-center mt-1">
                  <TrendingDown className="h-4 w-4 mr-1" />
                  -5.2% from last month
                </p>
              </div>
              <Target className="h-8 w-8 text-orange-600" />
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Revenue Chart */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-green-100">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Monthly Revenue</h3>
              <BarChart3 className="h-6 w-6 text-green-600" />
            </div>
            <div className="space-y-4">
              {monthlyRevenue.map((item, index) => (
                <div key={item.month} className="flex items-center space-x-4">
                  <div className="w-12 text-sm font-medium text-gray-600">{item.month}</div>
                  <div className="flex-1">
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div 
                        className="bg-green-600 h-3 rounded-full transition-all duration-300"
                        style={{ 
                          width: `${(item.revenue / Math.max(...monthlyRevenue.map(m => m.revenue))) * 100}%` 
                        }}
                      ></div>
                    </div>
                  </div>
                  <div className="w-20 text-sm font-medium text-gray-900">${item.revenue.toLocaleString()}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Status Distribution */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-green-100">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Order Status</h3>
              <PieChart className="h-6 w-6 text-blue-600" />
            </div>
            <div className="space-y-3">
              {Object.entries(orderStatusCounts).map(([status, count]) => (
                <div key={status} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${getStatusColor(status).split(' ')[0]}`}></div>
                    <span className="text-sm font-medium text-gray-700 capitalize">{status}</span>
                  </div>
                  <span className="text-sm font-bold text-gray-900">{count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top Selling Items */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8 border border-green-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Top Selling Items</h3>
            <Award className="h-6 w-6 text-yellow-600" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {topSellingItems.map(([itemName, quantity], index) => (
              <div key={itemName} className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">{itemName}</p>
                    <p className="text-sm text-gray-500">{quantity} orders</p>
                  </div>
                  <div className="text-2xl font-bold text-green-600">#{index + 1}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Detailed Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Reservation Analytics */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-green-100">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Reservations</h3>
              <Calendar className="h-6 w-6 text-purple-600" />
            </div>
            <div className="space-y-4">
              {Object.entries(reservationStatusCounts).map(([status, count]) => (
                <div key={status} className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700 capitalize">{status}</span>
                  <span className="text-sm font-bold text-gray-900">{count}</span>
                </div>
              ))}
            </div>
            <div className="mt-6 pt-4 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Average guests per reservation</span>
                <span className="text-sm font-bold text-gray-900">
                  {reservations.length > 0 
                    ? (reservations.reduce((sum, r) => sum + r.guests, 0) / reservations.length).toFixed(1)
                    : '0'
                  }
                </span>
              </div>
            </div>
          </div>

          {/* Waste Analytics */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-green-100">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Waste Analysis</h3>
              <Activity className="h-6 w-6 text-orange-600" />
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Total analyses</span>
                <span className="text-sm font-bold text-gray-900">{totalWasteAnalyses}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Average waste %</span>
                <span className="text-sm font-bold text-gray-900">{averageWastePercentage.toFixed(1)}%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Points awarded</span>
                <span className="text-sm font-bold text-gray-900">{totalPointsAwarded}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">AI confidence</span>
                <span className="text-sm font-bold text-gray-900">
                  {wasteAnalyses.length > 0 
                    ? (wasteAnalyses.reduce((sum, a) => sum + a.aiConfidence, 0) / wasteAnalyses.length).toFixed(1) + '%'
                    : '0%'
                  }
                </span>
              </div>
            </div>
          </div>

          {/* Inventory Analytics */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-green-100">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Inventory</h3>
              <Package className="h-6 w-6 text-blue-600" />
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Total items</span>
                <span className="text-sm font-bold text-gray-900">{inventory.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Total value</span>
                <span className="text-sm font-bold text-gray-900">${totalInventoryValue.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Low stock items</span>
                <span className="text-sm font-bold text-gray-900">
                  {inventory.filter(item => item.currentStock <= item.minStock).length}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Out of stock</span>
                <span className="text-sm font-bold text-gray-900">
                  {inventory.filter(item => item.currentStock <= 0).length}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="mt-8 bg-white rounded-xl shadow-sm p-6 border border-green-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Recent Activity</h3>
          <div className="space-y-4">
            {orders.slice(0, 5).map(order => (
              <div key={order.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      Order #{order.id.slice(-6)} - {order.customerName}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(order.timestamp).toLocaleDateString()} at {new Date(order.timestamp).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-gray-900">${order.total.toFixed(2)}</p>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}; 