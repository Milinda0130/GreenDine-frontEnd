import React, { useState, useEffect, useMemo } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { 
  DollarSign, 
  ShoppingCart, 
  Users, 
  TrendingDown, 
  Calendar,
  Package,
  AlertTriangle,
  Award,
  RefreshCw,
  Loader2
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { orderApiService, OrderDTO } from '../../services/orderApi';
import { reservationApiService, ReservationDTO } from '../../services/reservationApi';
import { inventoryApiService, InventoryDTO } from '../../services/inventoryApi';

// Color palette for charts
const COLORS = ['#10B981', '#3B82F6', '#8B5CF6', '#F59E0B', '#EF4444', '#06B6D4'];

export const AdminDashboard: React.FC = () => {
  const { wasteAnalyses } = useApp();
  
  // Backend data states
  const [orders, setOrders] = useState<OrderDTO[]>([]);
  const [reservations, setReservations] = useState<ReservationDTO[]>([]);
  const [inventory, setInventory] = useState<InventoryDTO[]>([]);
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [backendStatus, setBackendStatus] = useState({
    orders: false,
    reservations: false,
    inventory: false
  });

  // Load data from backend APIs
  useEffect(() => {
    loadBackendData();
  }, []);

  const loadBackendData = async () => {
    setIsDataLoading(true);
    setError(null);
    
    try {
      // Load all data in parallel
      console.log('🔄 Starting to load data from backend APIs...');
      
      const [ordersData, reservationsData, inventoryData] = await Promise.all([
        orderApiService.getAllOrders().catch(err => {
          console.error('❌ Error loading orders:', err);
          console.log('💡 Make sure your orders backend is running on port 8083');
          return [];
        }),
        reservationApiService.getAllReservations().catch(err => {
          console.error('❌ Error loading reservations:', err);
          console.log('💡 Make sure your reservations backend is running on port 8081');
          return [];
        }),
        inventoryApiService.getAllInventories().catch(err => {
          console.error('❌ Error loading inventory:', err);
          console.log('💡 Make sure your inventory backend is running on port 8082');
          return [];
        })
      ]);
      
      console.log('✅ API calls completed');

      // Set the data from backend (or empty arrays if no data)
      // If backend returns empty data, use sample data for demonstration
      const finalOrders = ordersData && ordersData.length > 0 ? ordersData : [];
      const finalReservations = reservationsData && reservationsData.length > 0 ? reservationsData : [];
      const finalInventory = inventoryData && inventoryData.length > 0 ? inventoryData : [];
      
      setOrders(finalOrders);
      setReservations(finalReservations);
      setInventory(finalInventory);
      
      // Update backend status
      setBackendStatus({
        orders: ordersData !== undefined,
        reservations: reservationsData !== undefined,
        inventory: inventoryData !== undefined
      });
      
      console.log('Backend data loaded for dashboard:', {
        orders: ordersData?.length || 0,
        reservations: reservationsData?.length || 0,
        inventory: inventoryData?.length || 0
      });
      
      // Debug: Log the actual data
      console.log('Orders data:', ordersData);
      console.log('Reservations data:', reservationsData);
      console.log('Inventory data:', inventoryData);
    } catch (err) {
      console.error('Error loading backend data:', err);
      setError('Failed to load dashboard data from backend');
    } finally {
      setIsDataLoading(false);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadBackendData();
    setIsRefreshing(false);
  };

  // Calculate metrics from backend data
  const todayOrders = useMemo(() => {
    const today = new Date();
    return orders.filter(order => {
      if (!order.timestamp) return false;
      const orderDate = new Date(order.timestamp);
      return orderDate.toDateString() === today.toDateString();
    });
  }, [orders]);

  const todayReservations = useMemo(() => {
    const today = new Date();
    return reservations.filter(reservation => {
      if (!reservation.date) return false;
      const reservationDate = new Date(reservation.date);
      return reservationDate.toDateString() === today.toDateString();
    });
  }, [reservations]);

  const lowStockItems = useMemo(() => {
    return inventory.filter(item => (item.currentStock || 0) <= (item.minStock || 0));
  }, [inventory]);

  const totalRevenue = useMemo(() => {
    return orders.reduce((sum, order) => sum + (order.total || 0), 0);
  }, [orders]);

  const averageOrderValue = useMemo(() => {
    return orders.length > 0 ? totalRevenue / orders.length : 0;
  }, [orders, totalRevenue]);

  // Calculate average waste percentage from waste analyses
  const averageWastePercentage = useMemo(() => {
    return wasteAnalyses.length > 0 
      ? wasteAnalyses.reduce((sum, analysis) => sum + analysis.wastePercentage, 0) / wasteAnalyses.length 
      : 8.5; // Default value if no waste data
  }, [wasteAnalyses]);

  // Generate weekly sales data from backend orders
  const salesData = useMemo(() => {
    const weeklyData: { [key: string]: { sales: number; orders: number } } = {};
    const today = new Date();
    
    // Initialize last 7 days
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dayKey = date.toLocaleDateString('en-US', { weekday: 'short' });
      weeklyData[dayKey] = { sales: 0, orders: 0 };
    }
    
    // Add actual order data
    orders.forEach(order => {
      if (order.timestamp) {
        const orderDate = new Date(order.timestamp);
        const dayKey = orderDate.toLocaleDateString('en-US', { weekday: 'short' });
        if (weeklyData[dayKey]) {
          weeklyData[dayKey].sales += (order.total || 0);
          weeklyData[dayKey].orders += 1;
        }
      }
    });
    
    return Object.entries(weeklyData).map(([name, data]) => ({
      name,
      sales: data.sales,
      orders: data.orders
    }));
  }, [orders]);

  // Generate waste trend data from waste analyses
  const wasteData = useMemo(() => {
    const weeklyWaste: { [key: string]: { total: number; count: number } } = {};
    const today = new Date();
    
    // Initialize last 4 weeks
    for (let i = 3; i >= 0; i--) {
      const weekStart = new Date(today);
      weekStart.setDate(weekStart.getDate() - (i * 7));
      const weekKey = `Week ${4 - i}`;
      weeklyWaste[weekKey] = { total: 0, count: 0 };
    }
    
    // Add actual waste data
    wasteAnalyses.forEach(analysis => {
      const analysisDate = new Date(analysis.timestamp);
      const weekDiff = Math.floor((today.getTime() - analysisDate.getTime()) / (7 * 24 * 60 * 60 * 1000));
      if (weekDiff >= 0 && weekDiff <= 3) {
        const weekKey = `Week ${4 - weekDiff}`;
        if (weeklyWaste[weekKey]) {
          weeklyWaste[weekKey].total += analysis.wastePercentage;
          weeklyWaste[weekKey].count += 1;
        }
      }
    });
    
    return Object.entries(weeklyWaste).map(([name, data]) => ({
      name,
      waste: data.count > 0 ? data.total / data.count : 0
    }));
  }, [wasteAnalyses]);

  // Generate category data from order items
  const categoryData = useMemo(() => {
    const categorySales: { [key: string]: number } = {};
    
    orders.forEach(order => {
      if (order.orderItems) {
        order.orderItems.forEach(item => {
          // Since backend doesn't have categories, we'll use sample categories
          const category = item.name.includes('Salad') ? 'Salads' :
                          item.name.includes('Burger') ? 'Main Course' :
                          item.name.includes('Smoothie') ? 'Beverages' :
                          item.name.includes('Soup') ? 'Soups' : 'Main Course';
          
          categorySales[category] = (categorySales[category] || 0) + (item.price * item.quantity);
        });
      }
    });
    
    const totalSales = Object.values(categorySales).reduce((sum, sales) => sum + sales, 0);
    
    return Object.entries(categorySales).map(([name, sales], index) => ({
      name,
      value: totalSales > 0 ? (sales / totalSales) * 100 : 0,
      color: COLORS[index % COLORS.length]
    }));
  }, [orders]);

  // Loading state
  if (isDataLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 text-green-600 animate-spin mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Loading Dashboard</h2>
          <p className="text-gray-600">Fetching data from backend services...</p>
        </div>
      </div>
    );
  }

  // Error handling
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="h-12 w-12 text-red-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-red-600 mb-4">Dashboard Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => {
              setError(null);
              loadBackendData();
            }}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Restaurant Dashboard</h1>
              <p className="text-gray-600">Overview of your restaurant's performance and operations</p>
              
              {/* Backend Status Indicator */}
              <div className="flex items-center space-x-4 mt-2">
                <span className="text-sm text-gray-500">Backend Status:</span>
                <div className="flex space-x-2">
                  <div className={`flex items-center space-x-1 ${backendStatus.orders ? 'text-green-600' : 'text-red-600'}`}>
                    <div className={`w-2 h-2 rounded-full ${backendStatus.orders ? 'bg-green-500' : 'bg-red-500'}`}></div>
                    <span className="text-xs">Orders</span>
                  </div>
                  <div className={`flex items-center space-x-1 ${backendStatus.reservations ? 'text-green-600' : 'text-red-600'}`}>
                    <div className={`w-2 h-2 rounded-full ${backendStatus.reservations ? 'bg-green-500' : 'bg-red-500'}`}></div>
                    <span className="text-xs">Reservations</span>
                  </div>
                  <div className={`flex items-center space-x-1 ${backendStatus.inventory ? 'text-green-600' : 'text-red-600'}`}>
                    <div className={`w-2 h-2 rounded-full ${backendStatus.inventory ? 'bg-green-500' : 'bg-red-500'}`}></div>
                    <span className="text-xs">Inventory</span>
                  </div>
                </div>
              </div>
            </div>
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900">RS{totalRevenue.toFixed(0)}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <ShoppingCart className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Today's Orders</p>
                <p className="text-2xl font-bold text-gray-900">{todayOrders.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <Calendar className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Today's Reservations</p>
                <p className="text-2xl font-bold text-gray-900">{todayReservations.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Avg. Food Waste</p>
                <p className="text-2xl font-bold text-gray-900">{averageWastePercentage.toFixed(1)}%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Sales Chart */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Weekly Sales</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value, name) => [
                  name === 'sales' ? `RS${value}` : value,
                  name === 'sales' ? 'Sales' : 'Orders'
                ]} />
                <Bar dataKey="sales" fill="#10B981" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Waste Trend Chart */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Food Waste Trend</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={wasteData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => [`${value}%`, 'Waste Percentage']} />
                <Line type="monotone" dataKey="waste" stroke="#EF4444" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Category Distribution */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Sales by Category</h2>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Recent Orders */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Orders</h2>
            <div className="space-y-3">
              {orders.slice(0, 5).map(order => (
                <div key={order.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">#{order.id?.toString().slice(-4) || 'N/A'}</p>
                    <p className="text-sm text-gray-600">{order.customerName}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900">RS{order.total.toFixed(2)}</p>
                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                                      order.status === 'DELIVERED' ? 'bg-green-100 text-green-800' :
                order.status === 'PREPARING' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
              {orders.length === 0 && (
                <div className="text-center py-8">
                  <ShoppingCart className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                  <p className="text-gray-600">No orders found</p>
                  <p className="text-sm text-gray-400 mt-1">Start by creating some orders in the Order Management section</p>
                </div>
              )}
            </div>
          </div>

          {/* Inventory Alerts */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Inventory Alerts</h2>
            <div className="space-y-3">
              {lowStockItems.map(item => (
                <div key={item.id} className="flex items-center p-3 bg-red-50 rounded-lg">
                  <AlertTriangle className="h-5 w-5 text-red-600 mr-3" />
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{item.name}</p>
                    <p className="text-sm text-gray-600">
                      {item.currentStock} {item.unit} remaining
                    </p>
                  </div>
                </div>
              ))}
              
              {lowStockItems.length === 0 && (
                <div className="text-center py-8">
                  <Package className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                  <p className="text-gray-600">All items are well stocked!</p>
                  <p className="text-sm text-gray-400 mt-1">Add inventory items in the Inventory Management section</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};