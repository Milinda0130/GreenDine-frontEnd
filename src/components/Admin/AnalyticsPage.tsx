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
  Cell,
  AreaChart,
  Area,
  ComposedChart,
  Legend
} from 'recharts';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Users, 
  Package, 
  Calendar, 
  PieChart as PieChartIcon, 
  Activity, 
  Target, 
  Award,
  Clock,
  ShoppingCart,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Filter,
  Download,
  RefreshCw,
  Loader2
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { orderApiService, OrderDTO } from '../../services/orderApi';
import { reservationApiService, ReservationDTO } from '../../services/reservationApi';
import { inventoryApiService, InventoryDTO } from '../../services/inventoryApi';

// Color palette for charts
const COLORS = ['#10B981', '#3B82F6', '#8B5CF6', '#F59E0B', '#EF4444', '#06B6D4'];

export const AnalyticsPage: React.FC = () => {
  const { wasteAnalyses } = useApp();
  const [selectedPeriod, setSelectedPeriod] = useState('30d');
  const [selectedMetric, setSelectedMetric] = useState('revenue');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Backend data states
  const [orders, setOrders] = useState<OrderDTO[]>([]);
  const [reservations, setReservations] = useState<ReservationDTO[]>([]);
  const [inventory, setInventory] = useState<InventoryDTO[]>([]);
  const [isDataLoading, setIsDataLoading] = useState(true);

  // Load data from backend APIs
  useEffect(() => {
    loadBackendData();
  }, []);

  const loadBackendData = async () => {
    setIsDataLoading(true);
    setError(null);
    
    try {
      // Load all data in parallel
      const [ordersData, reservationsData, inventoryData] = await Promise.all([
        orderApiService.getAllOrders().catch(err => {
          console.error('Error loading orders:', err);
          return [];
        }),
        reservationApiService.getAllReservations().catch(err => {
          console.error('Error loading reservations:', err);
          return [];
        }),
        inventoryApiService.getAllInventories().catch(err => {
          console.error('Error loading inventory:', err);
          return [];
        })
      ]);

      // Add sample order data if backend is empty
      const sampleOrders = ordersData && ordersData.length > 0 ? ordersData : [
        {
          id: 1,
          customerId: 1,
          customerName: 'John Customer',
          total: 45.99,
          status: 'DELIVERED',
          timestamp: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
          type: 'DINE_IN',
          tableNumber: 5,
          notes: 'Sample order',
          orderItems: [
            { id: 1, orderId: 1, menuItemId: 1, name: 'Organic Garden Salad', image: '', price: 16.99, quantity: 1 },
            { id: 2, orderId: 1, menuItemId: 2, name: 'Sustainable Salmon', image: '', price: 28.99, quantity: 1 }
          ]
        },
        {
          id: 2,
          customerId: 2,
          customerName: 'Sarah Smith',
          total: 32.98,
          status: 'PREPARING',
          timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          type: 'TAKEAWAY',
          notes: 'Sample order',
          orderItems: [
            { id: 3, orderId: 2, menuItemId: 3, name: 'Plant-Based Burger', image: '', price: 19.99, quantity: 1 },
            { id: 4, orderId: 2, menuItemId: 4, name: 'Seasonal Soup', image: '', price: 12.99, quantity: 1 }
          ]
        },
        {
          id: 3,
          customerId: 3,
          customerName: 'Mike Johnson',
          total: 67.97,
          status: 'READY',
          timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
          type: 'DINE_IN',
          tableNumber: 8,
          notes: 'Sample order',
          orderItems: [
            { id: 5, orderId: 3, menuItemId: 2, name: 'Sustainable Salmon', image: '', price: 28.99, quantity: 2 },
            { id: 6, orderId: 3, menuItemId: 5, name: 'Eco-Friendly Smoothie', image: '', price: 8.99, quantity: 1 }
          ]
        }
      ];
      
      setOrders(sampleOrders);
      
      // Add sample reservation data if backend is empty
      const sampleReservations = reservationsData && reservationsData.length > 0 ? reservationsData : [
        {
          id: 1,
          name: 'John Customer',
          phone: '+1234567890',
          date: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 6 days ago
          numberOfGuests: 4,
          time: '19:00',
          status: 'CONFIRMED',
          notes: 'Sample reservation'
        },
        {
          id: 2,
          name: 'Sarah Smith',
          phone: '+1234567891',
          date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 5 days ago
          numberOfGuests: 2,
          time: '20:00',
          status: 'PENDING',
          notes: 'Sample reservation'
        },
        {
          id: 3,
          name: 'Mike Johnson',
          phone: '+1234567892',
          date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 4 days ago
          numberOfGuests: 6,
          time: '18:30',
          status: 'CONFIRMED',
          notes: 'Sample reservation'
        },
        {
          id: 4,
          name: 'Emily Davis',
          phone: '+1234567893',
          date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 3 days ago
          numberOfGuests: 3,
          time: '19:30',
          status: 'CONFIRMED',
          notes: 'Sample reservation'
        },
        {
          id: 5,
          name: 'David Wilson',
          phone: '+1234567894',
          date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 2 days ago
          numberOfGuests: 4,
          time: '20:30',
          status: 'CANCELLED',
          notes: 'Sample reservation'
        }
      ];
      
      setReservations(sampleReservations);
      setInventory(inventoryData || []);
      
      console.log('Backend data loaded:', {
        orders: ordersData?.length || 0,
        reservations: reservationsData?.length || 0,
        inventory: inventoryData?.length || 0
      });
      
      // Debug reservation data structure
      if (reservationsData && reservationsData.length > 0) {
        console.log('Sample reservation from backend:', reservationsData[0]);
        console.log('Reservation date type:', typeof reservationsData[0].date);
        console.log('Reservation date value:', reservationsData[0].date);
      }
    } catch (err) {
      console.error('Error loading backend data:', err);
      setError('Failed to load analytics data from backend');
    } finally {
      setIsDataLoading(false);
    }
  };

  // Calculate date ranges based on selected period
  const getDateRange = () => {
    const now = new Date();
    const startDate = new Date();
    
    switch (selectedPeriod) {
      case '7d':
        startDate.setDate(now.getDate() - 7);
        break;
      case '30d':
        startDate.setDate(now.getDate() - 30);
        break;
      case '90d':
        startDate.setDate(now.getDate() - 90);
        break;
      case '1y':
        startDate.setFullYear(now.getFullYear() - 1);
        break;
      default:
        startDate.setDate(now.getDate() - 30);
    }
    
    return { startDate, endDate: now };
  };

  const { startDate, endDate } = getDateRange();

  // Filter data based on selected period
  const filteredOrders = useMemo(() => 
    orders.filter(order => {
      if (!order.timestamp) return false;
      const orderDate = new Date(order.timestamp);
      return orderDate >= startDate && orderDate <= endDate;
    }), [orders, startDate, endDate]);

  const filteredReservations = useMemo(() => 
    reservations.filter(reservation => {
      if (!reservation.date) return false;
      const reservationDate = new Date(reservation.date);
      return reservationDate >= startDate && reservationDate <= endDate;
    }), [reservations, startDate, endDate]);

  const filteredWasteAnalyses = useMemo(() => 
    wasteAnalyses.filter(analysis => {
      const analysisDate = new Date(analysis.timestamp);
      return analysisDate >= startDate && analysisDate <= endDate;
    }), [wasteAnalyses, startDate, endDate]);

  // Debug logging after all filtered data is declared
  console.log('Analytics Debug Info:');
  console.log('Selected period:', selectedPeriod);
  console.log('Date range:', { startDate, endDate });
  console.log('Total orders:', orders.length);
  console.log('Filtered orders:', filteredOrders.length);
  console.log('Total reservations:', reservations.length);
  console.log('Filtered reservations:', filteredReservations.length);
  console.log('Total waste analyses:', wasteAnalyses.length);
  console.log('Filtered waste analyses:', filteredWasteAnalyses.length);

  // Key Performance Indicators
  const kpis = useMemo(() => {
    const totalRevenue = filteredOrders.reduce((sum, order) => sum + (order.total || 0), 0);
    const totalOrders = filteredOrders.length;
    const totalReservations = filteredReservations.length;
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
    const averageWastePercentage = filteredWasteAnalyses.length > 0 
      ? filteredWasteAnalyses.reduce((sum, analysis) => sum + analysis.wastePercentage, 0) / filteredWasteAnalyses.length 
      : 0;
    const totalInventoryValue = inventory.reduce((sum, item) => sum + ((item.currentStock || 0) * (item.price || 0)), 0);
    const lowStockItems = inventory.filter(item => (item.currentStock || 0) <= (item.minStock || 0)).length;
    const outOfStockItems = inventory.filter(item => (item.currentStock || 0) <= 0).length;

    return {
      totalRevenue,
      totalOrders,
      totalReservations,
      averageOrderValue,
      averageWastePercentage,
      totalInventoryValue,
      lowStockItems,
      outOfStockItems
    };
  }, [filteredOrders, filteredReservations, filteredWasteAnalyses, inventory]);

  // Daily revenue data for charts
  const dailyRevenueData = useMemo(() => {
    const dailyData: { [key: string]: { revenue: number; orders: number } } = {};
    
    // Initialize all days in range with 0
    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      dailyData[d.toISOString().split('T')[0]] = { revenue: 0, orders: 0 };
    }
    
    // Add actual revenue data
    filteredOrders.forEach(order => {
      if (order.timestamp) {
        const date = new Date(order.timestamp).toISOString().split('T')[0];
        if (dailyData[date]) {
          dailyData[date].revenue += (order.total || 0);
          dailyData[date].orders += 1;
        }
      }
    });
    
    const result = Object.entries(dailyData).map(([date, data]) => ({
      date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      revenue: data.revenue,
      orders: data.orders
    }));
    
    console.log('Daily revenue data:', result);
    
    // If no data, provide sample data for demonstration
    if (result.every(item => item.revenue === 0 && item.orders === 0)) {
      console.log('No revenue data found, using sample data');
      return [
        { date: 'Jan 1', revenue: 1250, orders: 12 },
        { date: 'Jan 2', revenue: 1890, orders: 18 },
        { date: 'Jan 3', revenue: 1420, orders: 14 },
        { date: 'Jan 4', revenue: 2100, orders: 21 },
        { date: 'Jan 5', revenue: 1680, orders: 16 },
        { date: 'Jan 6', revenue: 1950, orders: 19 },
        { date: 'Jan 7', revenue: 2300, orders: 23 }
      ];
    }
    
    return result;
  }, [filteredOrders, startDate, endDate]);

  // Order status distribution
  const orderStatusData = useMemo(() => {
    const statusCounts = filteredOrders.reduce((acc, order) => {
      const status = order.status || 'PENDING';
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const result = Object.entries(statusCounts).map(([status, count]) => ({
      name: status.charAt(0).toUpperCase() + status.slice(1).toLowerCase(),
      value: count,
      color: COLORS[Object.keys(statusCounts).indexOf(status) % COLORS.length]
    }));
    
    console.log('Order status data:', result);
    
    // If no data, provide sample data for demonstration
    if (result.length === 0) {
      console.log('No order status data found, using sample data');
      return [
        { name: 'Pending', value: 8, color: COLORS[0] },
        { name: 'Preparing', value: 12, color: COLORS[1] },
        { name: 'Ready', value: 6, color: COLORS[2] },
        { name: 'Delivered', value: 15, color: COLORS[3] },
        { name: 'Cancelled', value: 3, color: COLORS[4] }
      ];
    }
    
    return result;
  }, [filteredOrders]);

  // Top selling items (from order items)
  const topSellingItems = useMemo(() => {
    const itemSales: { [key: string]: number } = {};
    
    filteredOrders.forEach(order => {
      if (order.orderItems) {
        order.orderItems.forEach(item => {
          const itemName = item.name || 'Unknown Item';
          itemSales[itemName] = (itemSales[itemName] || 0) + (item.quantity || 1);
        });
      }
    });
    
    return Object.entries(itemSales)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([name, quantity]) => ({ name, quantity }));
  }, [filteredOrders]);

  // Category performance (mock data since backend doesn't have categories)
  const categoryPerformance = useMemo(() => {
    // Since backend doesn't have categories, we'll use sample data
    return [
      { category: 'Main Course', revenue: 4500 },
      { category: 'Beverages', revenue: 2800 },
      { category: 'Appetizers', revenue: 2200 },
      { category: 'Desserts', revenue: 1500 },
      { category: 'Salads', revenue: 1200 }
    ];
  }, []);

  // Reservation trends
  const reservationTrends = useMemo(() => {
    const dailyReservations: { [key: string]: number } = {};
    
    // Initialize all days in range with 0
    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      dailyReservations[d.toISOString().split('T')[0]] = 0;
    }
    
    console.log('Processing reservations for trends:', filteredReservations.length);
    console.log('Sample reservation:', filteredReservations[0]);
    
    filteredReservations.forEach(reservation => {
      if (reservation.date) {
        try {
          // Handle different date formats from backend
          let dateStr: string;
          if (typeof reservation.date === 'string') {
            // If it's already a string, use it directly
            dateStr = reservation.date;
          } else {
            // If it's a Date object, convert to string
            dateStr = new Date(reservation.date).toISOString().split('T')[0];
          }
          
          console.log('Processing reservation date:', reservation.date, '->', dateStr);
          
          if (dailyReservations[dateStr] !== undefined) {
            dailyReservations[dateStr] += 1;
          }
        } catch (dateErr) {
          console.error('Error processing reservation date:', reservation.date, dateErr);
        }
      }
    });
    
    const result = Object.entries(dailyReservations).map(([date, count]) => ({
      date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      reservations: count
    }));
    
    console.log('Reservation trends data:', result);
    console.log('Daily reservations object:', dailyReservations);
    
    // If no data, provide sample data for demonstration
    if (result.every(item => item.reservations === 0)) {
      console.log('No reservation data found, using sample data');
      return [
        { date: 'Jan 1', reservations: 8 },
        { date: 'Jan 2', reservations: 12 },
        { date: 'Jan 3', reservations: 6 },
        { date: 'Jan 4', reservations: 15 },
        { date: 'Jan 5', reservations: 10 },
        { date: 'Jan 6', reservations: 18 },
        { date: 'Jan 7', reservations: 14 }
      ];
    }
    
    return result;
  }, [filteredReservations, startDate, endDate]);

  // Waste analysis trends
  const wasteTrends = useMemo(() => {
    const dailyWaste: { [key: string]: { total: number; count: number } } = {};
    
    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      dailyWaste[d.toISOString().split('T')[0]] = { total: 0, count: 0 };
    }
    
    filteredWasteAnalyses.forEach(analysis => {
      const date = new Date(analysis.timestamp).toISOString().split('T')[0];
      if (dailyWaste[date]) {
        dailyWaste[date].total += analysis.wastePercentage;
        dailyWaste[date].count += 1;
      }
    });
    
    const result = Object.entries(dailyWaste).map(([date, data]) => ({
      date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      averageWaste: data.count > 0 ? data.total / data.count : 0
    }));
    
    console.log('Waste trends data:', result);
    
    // If no data, provide sample data for demonstration
    if (result.every(item => item.averageWaste === 0)) {
      console.log('No waste data found, using sample data');
      return [
        { date: 'Jan 1', averageWaste: 8.5 },
        { date: 'Jan 2', averageWaste: 12.3 },
        { date: 'Jan 3', averageWaste: 5.2 },
        { date: 'Jan 4', averageWaste: 18.7 },
        { date: 'Jan 5', averageWaste: 6.8 },
        { date: 'Jan 6', averageWaste: 9.1 },
        { date: 'Jan 7', averageWaste: 7.4 }
      ];
    }
    
    return result;
  }, [filteredWasteAnalyses, startDate, endDate]);

  // Inventory alerts
  const inventoryAlerts = useMemo(() => {
    const alerts = inventory
      .filter(item => (item.currentStock || 0) <= (item.minStock || 0))
      .sort((a, b) => (a.currentStock || 0) - (b.currentStock || 0))
      .slice(0, 5)
      .map(item => ({
        name: item.name || 'Unknown Item',
        currentStock: item.currentStock || 0,
        minStock: item.minStock || 0,
        unit: item.unit || 'units',
        status: (item.currentStock || 0) === 0 ? 'Out of Stock' : 'Low Stock'
      }));
    
    return alerts;
  }, [inventory]);

  // Peak hours analysis (mock data since backend doesn't have time data)
  const peakHoursData = useMemo(() => {
    return [
      { hour: '12:00', orders: 15 },
      { hour: '13:00', orders: 22 },
      { hour: '14:00', orders: 18 },
      { hour: '15:00', orders: 12 },
      { hour: '16:00', orders: 8 },
      { hour: '17:00', orders: 10 },
      { hour: '18:00', orders: 25 },
      { hour: '19:00', orders: 30 },
      { hour: '20:00', orders: 28 },
      { hour: '21:00', orders: 20 },
      { hour: '22:00', orders: 15 }
    ];
  }, []);

  const handleRefresh = async () => {
    setIsLoading(true);
    await loadBackendData();
    setIsLoading(false);
  };

  // Loading state
  if (isDataLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 text-green-600 animate-spin mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Loading Analytics</h2>
          <p className="text-gray-600">Fetching data from backend services...</p>
        </div>
      </div>
    );
  }

  const handleExport = () => {
    const data = {
      period: selectedPeriod,
      kpis,
      orders: filteredOrders,
      reservations: filteredReservations,
      wasteAnalyses: filteredWasteAnalyses,
      inventory: inventory
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `analytics-${selectedPeriod}-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Loading state
  if (isDataLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 text-green-600 animate-spin mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Loading Analytics</h2>
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
          <h2 className="text-2xl font-bold text-red-600 mb-4">Analytics Error</h2>
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

  try {
    return (
      <div className="p-8 bg-gradient-to-br from-green-50 via-white to-blue-50">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-10">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl shadow-lg">
                  <TrendingUp className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                    Analytics Dashboard
                  </h1>
                  <p className="text-gray-600 text-lg">Comprehensive insights into your restaurant's performance</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <button
                  onClick={handleRefresh}
                  disabled={isLoading}
                  className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-gray-100 to-gray-200 border border-gray-300 rounded-xl hover:from-gray-200 hover:to-gray-300 transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  <RefreshCw className={`h-5 w-5 ${isLoading ? 'animate-spin' : ''}`} />
                  <span className="font-semibold">Refresh</span>
                </button>
                <button
                  onClick={handleExport}
                  className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl font-semibold"
                >
                  <Download className="h-5 w-5" />
                  <span>Export</span>
                </button>
              </div>
            </div>
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

          {/* Key Performance Indicators */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-sm p-6 border border-green-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                  <p className="text-2xl font-bold text-gray-900">RS{kpis.totalRevenue.toFixed(2)}</p>
                
                </div>
            
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6 border border-green-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Orders</p>
                  <p className="text-2xl font-bold text-gray-900">{kpis.totalOrders}</p>
                 
                </div>
                <ShoppingCart className="h-8 w-8 text-blue-600" />
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6 border border-green-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Avg Order Value</p>
                  <p className="text-2xl font-bold text-gray-900">RS{kpis.averageOrderValue.toFixed(2)}</p>
                 
                </div>
                <Target className="h-8 w-8 text-purple-600" />
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6 border border-green-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Waste Reduction</p>
                  <p className="text-2xl font-bold text-gray-900">{kpis.averageWastePercentage.toFixed(1)}%</p>
                 
                </div>
                <Activity className="h-8 w-8 text-orange-600" />
              </div>
            </div>
          </div>

          {/* Main Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Revenue & Orders Chart */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-green-100">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Revenue & Orders Trend</h3>
                <BarChart3 className="h-6 w-6 text-green-600" />
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <ComposedChart data={dailyRevenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip 
                    formatter={(value, name) => [
                      name === 'revenue' ? `RS${value}` : value,
                      name === 'revenue' ? 'Revenue' : 'Orders'
                    ]}
                  />
                  <Legend />
                  <Bar yAxisId="left" dataKey="revenue" fill="#10B981" name="Revenue" />
                  <Line yAxisId="right" type="monotone" dataKey="orders" stroke="#3B82F6" strokeWidth={2} name="Orders" />
                </ComposedChart>
              </ResponsiveContainer>
            </div>

            {/* Order Status Distribution */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-green-100">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Order Status Distribution</h3>
                <PieChartIcon className="h-6 w-6 text-blue-600" />
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={orderStatusData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {orderStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [value, 'Orders']} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Secondary Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Reservation Trends */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-green-100">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Reservation Trends</h3>
                <Calendar className="h-6 w-6 text-purple-600" />
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={reservationTrends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip formatter={(value) => [value, 'Reservations']} />
                  <Area type="monotone" dataKey="reservations" stroke="#8B5CF6" fill="#8B5CF6" fillOpacity={0.3} />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Waste Analysis Trends */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-green-100">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Waste Analysis Trends</h3>
                <Activity className="h-6 w-6 text-orange-600" />
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={wasteTrends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`${value}%`, 'Average Waste']} />
                  <Line type="monotone" dataKey="averageWaste" stroke="#F59E0B" strokeWidth={3} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Detailed Analytics Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            {/* Top Selling Items */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-green-100">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Top Selling Items</h3>
                <Award className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="space-y-4">
                {topSellingItems.slice(0, 5).map((item, index) => (
                  <div key={item.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-bold text-green-600">#{index + 1}</span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{item.name}</p>
                        <p className="text-sm text-gray-500">{item.quantity} orders</p>
                      </div>
                    </div>
                  </div>
                ))}
                {topSellingItems.length === 0 && (
                  <div className="text-center py-4">
                    <p className="text-gray-500">No order data available</p>
                  </div>
                )}
              </div>
            </div>

            {/* Category Performance */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-green-100">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Category Performance</h3>
                <BarChart3 className="h-6 w-6 text-blue-600" />
              </div>
              <div className="space-y-4">
                {categoryPerformance.slice(0, 5).map((category, index) => (
                  <div key={category.category} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">{category.category}</span>
                      <span className="text-sm font-bold text-gray-900">RS{category.revenue.toFixed(2)}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-600 h-2 rounded-full transition-all duration-300"
                        style={{ 
                          width: `${(category.revenue / Math.max(...categoryPerformance.map(c => c.revenue))) * 100}%` 
                        }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Peak Hours Analysis */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-green-100">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Peak Hours</h3>
                <Clock className="h-6 w-6 text-purple-600" />
              </div>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={peakHoursData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="hour" />
                  <YAxis />
                  <Tooltip formatter={(value) => [value, 'Orders']} />
                  <Bar dataKey="orders" fill="#8B5CF6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Inventory & Alerts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Inventory Summary */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-green-100">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Inventory Summary</h3>
                <Package className="h-6 w-6 text-blue-600" />
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <p className="text-2xl font-bold text-green-600">{inventory.length}</p>
                  <p className="text-sm text-gray-600">Total Items</p>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <p className="text-2xl font-bold text-blue-600">RS{kpis.totalInventoryValue.toFixed(2)}</p>
                  <p className="text-sm text-gray-600">Total Value</p>
                </div>
                <div className="text-center p-4 bg-yellow-50 rounded-lg">
                  <p className="text-2xl font-bold text-yellow-600">{kpis.lowStockItems}</p>
                  <p className="text-sm text-gray-600">Low Stock</p>
                </div>
                <div className="text-center p-4 bg-red-50 rounded-lg">
                  <p className="text-2xl font-bold text-red-600">{kpis.outOfStockItems}</p>
                  <p className="text-sm text-gray-600">Out of Stock</p>
                </div>
              </div>
            </div>

            {/* Inventory Alerts */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-green-100">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Inventory Alerts</h3>
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              <div className="space-y-3">
                {inventoryAlerts.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      {item.status === 'Out of Stock' ? (
                        <XCircle className="h-5 w-5 text-red-600" />
                      ) : (
                        <AlertTriangle className="h-5 w-5 text-yellow-600" />
                      )}
                      <div>
                        <p className="font-medium text-gray-900">{item.name}</p>
                        <p className="text-sm text-gray-600">
                          {item.currentStock} {item.unit} remaining
                        </p>
                      </div>
                    </div>
                    <span className={`text-sm font-medium px-2 py-1 rounded-full ${
                      item.status === 'Out of Stock' 
                        ? 'bg-red-100 text-red-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {item.status}
                    </span>
                  </div>
                ))}
                
                {inventoryAlerts.length === 0 && (
                  <div className="text-center py-8">
                    <CheckCircle className="mx-auto h-8 w-8 text-green-400 mb-2" />
                    <p className="text-gray-600">All items are well stocked!</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-green-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Recent Activity</h3>
            <div className="space-y-4">
              {filteredOrders.slice(0, 10).map(order => (
                <div key={order.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        Order #{order.id} - {order.customerName}
                      </p>
                      <p className="text-xs text-gray-500">
                        {order.timestamp ? new Date(order.timestamp).toLocaleDateString() : 'No date'} at {order.timestamp ? new Date(order.timestamp).toLocaleTimeString() : 'No time'}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-gray-900">RS{(order.total || 0).toFixed(2)}</p>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      order.status === 'DELIVERED' ? 'bg-green-100 text-green-800' :
                      order.status === 'PREPARING' ? 'bg-yellow-100 text-yellow-800' :
                      order.status === 'PENDING' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {order.status || 'UNKNOWN'}
                    </span>
                  </div>
                </div>
              ))}
              {filteredOrders.length === 0 && (
                <div className="text-center py-8">
                  <ShoppingCart className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                  <p className="text-gray-600">No recent orders found</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  } catch (err) {
    console.error('Analytics page error:', err);
    setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Analytics Error</h2>
          <p className="text-gray-600 mb-4">Something went wrong while loading the analytics dashboard.</p>
          <button
            onClick={() => setError(null)}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }
}; 