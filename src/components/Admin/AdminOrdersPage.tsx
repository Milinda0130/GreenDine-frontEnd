import React, { useState, useEffect } from 'react';
import { Clock, Check, X, Eye, RefreshCw, Loader2, AlertTriangle } from 'lucide-react';
import { orderApiService, OrderDTO } from '../../services/orderApi';

export const AdminOrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<OrderDTO[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<OrderDTO | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Load orders from backend on component mount
  useEffect(() => {
    loadOrdersFromBackend();
  }, []);

  const loadOrdersFromBackend = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await orderApiService.getAllOrders();
      setOrders(data);
      console.log('✅ Orders loaded successfully from backend:', data.length, 'orders');
    } catch (err) {
      console.error('Error loading orders:', err);
      setError('Failed to load orders from backend. Please check if your backend service is running.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadOrdersFromBackend();
    setIsRefreshing(false);
  };

  const handleStatusUpdate = async (orderId: number, newStatus: string) => {
    try {
      await orderApiService.updateOrderStatus(orderId, newStatus);
      await loadOrdersFromBackend(); // Reload to get updated data
    } catch (err) {
      console.error('Error updating order status:', err);
      setError('Failed to update order status');
    }
  };

  const filteredOrders = orders.filter(order => 
    selectedStatus === 'all' || order.status === selectedStatus
  );

  const getStatusColor = (status: OrderDTO['status']) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'PREPARING':
        return 'bg-blue-100 text-blue-800';
      case 'READY':
        return 'bg-green-100 text-green-800';
      case 'DELIVERED':
        return 'bg-gray-100 text-gray-800';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: OrderDTO['status']) => {
    switch (status) {
      case 'PENDING':
        return <Clock className="h-4 w-4" />;
      case 'PREPARING':
        return <Clock className="h-4 w-4" />;
      case 'READY':
      case 'DELIVERED':
        return <Check className="h-4 w-4" />;
      case 'CANCELLED':
        return <X className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 text-green-600 animate-spin mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Loading Orders</h2>
          <p className="text-gray-600">Fetching orders from backend...</p>
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
          <h2 className="text-2xl font-bold text-red-600 mb-4">Orders Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => {
              setError(null);
              loadOrdersFromBackend();
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
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Management</h1>
              <p className="text-gray-600">Monitor and update order statuses in real-time</p>
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

        {/* Filter */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-wrap gap-2">
            {['all', 'PENDING', 'PREPARING', 'READY', 'DELIVERED', 'CANCELLED'].map(status => (
              <button
                key={status}
                onClick={() => setSelectedStatus(status)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedStatus === status
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
                {status === 'all' && (
                  <span className="ml-1">({orders.length})</span>
                )}
                {status !== 'all' && (
                  <span className="ml-1">
                    ({orders.filter(o => o.status === status).length})
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Orders Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredOrders.map(order => (
            <div key={order.id} className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Order #{order.id?.toString().slice(-4) || 'N/A'}
                  </h3>
                  <p className="text-gray-600">{order.customerName}</p>
                  <p className="text-sm text-gray-500">
                    {order.timestamp ? new Date(order.timestamp).toLocaleString() : 'No timestamp'}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedOrder(order)}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <Eye className="h-5 w-5" />
                </button>
              </div>

              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-2">
                  {order.orderItems?.length || 0} item(s) • RS{order.total.toFixed(2)}
                </p>
                <div className="space-y-1">
                  {order.orderItems?.slice(0, 2).map(item => (
                    <p key={item.id} className="text-xs text-gray-500">
                      {item.quantity}x {item.name}
                    </p>
                  ))}
                  {order.orderItems && order.orderItems.length > 2 && (
                    <p className="text-xs text-gray-400">
                      +{order.orderItems.length - 2} more items
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between mb-4">
                <div className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                  {getStatusIcon(order.status)}
                  <span className="capitalize">{order.status}</span>
                </div>
              </div>

              <div className="space-y-2">
                {order.status === 'PENDING' && (
                  <button
                    onClick={() => handleStatusUpdate(order.id!, 'PREPARING')}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-3 rounded text-sm font-medium transition-colors"
                  >
                    Start Preparing
                  </button>
                )}
                
                {order.status === 'PREPARING' && (
                  <button
                    onClick={() => handleStatusUpdate(order.id!, 'READY')}
                    className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-3 rounded text-sm font-medium transition-colors"
                  >
                    Mark Ready
                  </button>
                )}
                
                {order.status === 'READY' && (
                  <button
                    onClick={() => handleStatusUpdate(order.id!, 'DELIVERED')}
                    className="w-full bg-gray-600 hover:bg-gray-700 text-white py-2 px-3 rounded text-sm font-medium transition-colors"
                  >
                    Mark Delivered
                  </button>
                )}

                {['PENDING', 'PREPARING'].includes(order.status) && (
                  <button
                    onClick={() => handleStatusUpdate(order.id!, 'CANCELLED')}
                    className="px-3 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded text-sm font-medium transition-colors"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {filteredOrders.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Clock className="mx-auto h-12 w-12" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No orders found</h3>
            <p className="text-gray-600">
              {selectedStatus === 'all' 
                ? 'No orders have been placed yet.' 
                : `No ${selectedStatus} orders found.`}
            </p>
          </div>
        )}

        {/* Order Detail Modal */}
        {selectedOrder && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-96 overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-gray-900">
                    Order #{selectedOrder.id?.toString().slice(-4) || 'N/A'}
                  </h2>
                  <button
                    onClick={() => setSelectedOrder(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium text-gray-900">Customer Information</h3>
                    <p className="text-gray-600">{selectedOrder.customerName}</p>
                    <p className="text-sm text-gray-500">
                      Ordered on {selectedOrder.timestamp ? new Date(selectedOrder.timestamp).toLocaleString() : 'No timestamp'}
                    </p>
                  </div>

                  <div>
                    <h3 className="font-medium text-gray-900">Order Details</h3>
                    <div className="mt-2 space-y-2">
                      {selectedOrder.orderItems?.map(item => (
                        <div key={item.id} className="flex justify-between items-center">
                          <span className="text-gray-700">
                            {item.quantity}x {item.name}
                          </span>
                          <span className="font-medium">
                            RS{(item.price * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      ))}
                      <div className="border-t pt-2 flex justify-between items-center font-bold">
                        <span>Total</span>
                        <span>RS{selectedOrder.total.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-medium text-gray-900">Status</h3>
                    <div className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedOrder.status)}`}>
                      {getStatusIcon(selectedOrder.status)}
                      <span className="capitalize">{selectedOrder.status}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};