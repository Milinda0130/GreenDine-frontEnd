import React, { useState, useEffect } from 'react';
import { Package, AlertTriangle, TrendingUp, TrendingDown, Edit, Plus, Save, X, DollarSign, Package2, Trash2, RefreshCw, Download, Upload, Filter } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { InventoryItem } from '../../types';
import { inventoryApiService, InventoryDTO } from '../../services/inventoryApi';

interface InventoryFormData {
  name: string;
  currentStock: number;
  minStock: number;
  unit: string;
  price: number;
  supplier: string;
}

const initialFormData: InventoryFormData = {
  name: '',
  currentStock: 0,
  minStock: 0,
  unit: '',
  price: 0,
  supplier: ''
};

export const InventoryManagementPage: React.FC = () => {
  const { inventory, updateInventoryItem } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  const [formData, setFormData] = useState<InventoryFormData>(initialFormData);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<number | null>(null);
  const [backendInventory, setBackendInventory] = useState<InventoryItem[]>([]);

  const units = ['kg', 'g', 'l', 'ml', 'pieces', 'boxes', 'bags', 'bottles'];
  const categories = ['all', 'Produce', 'Meat', 'Dairy', 'Pantry', 'Beverages', 'Spices', 'Other'];

  // Load inventory from backend on component mount
  useEffect(() => {
    loadInventoryFromBackend();
  }, []);

  const loadInventoryFromBackend = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const inventories = await inventoryApiService.getAllInventories();
      // Convert backend DTOs to frontend format
      const convertedInventories: InventoryItem[] = inventories.map(inv => ({
        id: inv.id?.toString() || '',
        name: inv.name,
        currentStock: inv.currentStock,
        minStock: inv.minStock,
        unit: inv.unit,
        cost: inv.price, // Map price to cost for frontend compatibility
        supplier: inv.supplier,
        lastUpdated: new Date(inv.lastUpdate || Date.now())
      }));
      
      // Update the local state with backend data
      setBackendInventory(convertedInventories);
      console.log('Loaded inventories from backend:', convertedInventories);
      setSuccess(`Successfully loaded ${convertedInventories.length} inventory items from backend`);
    } catch (err) {
      console.error('Error loading inventory:', err);
      
      // Check if it's a CORS error
      if (err instanceof TypeError && err.message.includes('Failed to fetch')) {
        setError('CORS Error: Please ensure your backend is running and CORS is configured. Check the console for details.');
        console.log('🔧 To fix CORS error:');
        console.log('1. Add the CORS_Configuration.java file to your backend project');
        console.log('2. Restart your Spring Boot application');
        console.log('3. Ensure your backend is running on port 8082');
      } else {
        setError('Failed to load inventory from backend');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateInventory = async (inventoryData: Omit<InventoryDTO, 'id'>) => {
    setIsLoading(true);
    setError(null);
    try {
      const newInventory = await inventoryApiService.createInventory(inventoryData);
      setSuccess('Inventory item created successfully!');
      loadInventoryFromBackend(); // Reload the list
      return newInventory;
    } catch (err) {
      setError('Failed to create inventory item');
      console.error('Error creating inventory:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateInventory = async (id: number, inventoryData: InventoryDTO) => {
    setIsLoading(true);
    setError(null);
    try {
      await inventoryApiService.updateInventory(id, inventoryData);
      setSuccess('Inventory item updated successfully!');
      loadInventoryFromBackend(); // Reload the list
    } catch (err) {
      setError('Failed to update inventory item');
      console.error('Error updating inventory:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteInventory = async (id: number) => {
    setIsLoading(true);
    setError(null);
    try {
      await inventoryApiService.deleteInventory(id);
      setSuccess('Inventory item deleted successfully!');
      loadInventoryFromBackend(); // Reload the list
      setShowDeleteConfirm(null);
    } catch (err) {
      setError('Failed to delete inventory item');
      console.error('Error deleting inventory:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const exportInventoryData = () => {
    const csvContent = [
      ['Name', 'Current Stock', 'Min Stock', 'Unit', 'Price', 'Supplier', 'Last Updated'],
      ...currentInventory.map(item => [
        item.name,
        item.currentStock.toString(),
        item.minStock.toString(),
        item.unit,
        item.cost.toString(),
        item.supplier,
        new Date(item.lastUpdated).toLocaleDateString()
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `inventory-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    
    setSuccess('Inventory data exported successfully!');
  };

  const getInventoryAnalytics = () => {
    const totalItems = currentInventory.length;
    const lowStockItems = currentInventory.filter(item => item.currentStock <= item.minStock);
    const outOfStockItems = currentInventory.filter(item => item.currentStock <= 0);
    const totalValue = currentInventory.reduce((sum, item) => sum + (item.currentStock * item.cost), 0);
    const averagePrice = totalItems > 0 ? currentInventory.reduce((sum, item) => sum + item.cost, 0) / totalItems : 0;

    return {
      totalItems,
      lowStockItems: lowStockItems.length,
      outOfStockItems: outOfStockItems.length,
      totalValue,
      averagePrice
    };
  };

  const loadMockData = () => {
    const mockInventory: InventoryItem[] = [
      {
        id: '1',
        name: 'Fresh Tomatoes',
        currentStock: 50,
        minStock: 20,
        unit: 'kg',
        cost: 2.50,
        supplier: 'Fresh Farms Ltd',
        lastUpdated: new Date()
      },
      {
        id: '2',
        name: 'Chicken Breast',
        currentStock: 15,
        minStock: 25,
        unit: 'kg',
        cost: 8.75,
        supplier: 'Quality Meats Co',
        lastUpdated: new Date()
      },
      {
        id: '3',
        name: 'Milk',
        currentStock: 0,
        minStock: 10,
        unit: 'l',
        cost: 1.20,
        supplier: 'Dairy Fresh',
        lastUpdated: new Date()
      },
      {
        id: '4',
        name: 'Rice',
        currentStock: 100,
        minStock: 30,
        unit: 'kg',
        cost: 1.80,
        supplier: 'Grain Suppliers',
        lastUpdated: new Date()
      },
      {
        id: '5',
        name: 'Olive Oil',
        currentStock: 8,
        minStock: 15,
        unit: 'l',
        cost: 12.50,
        supplier: 'Mediterranean Imports',
        lastUpdated: new Date()
      }
    ];
    
    // Update the local state with mock data
    setBackendInventory(mockInventory);
    console.log('Loaded mock inventory data:', mockInventory);
    setSuccess('Loaded mock data for testing. Backend integration pending.');
  };

  const handleOpenModal = (item?: InventoryItem) => {
    if (item) {
      setEditingItem(item);
      setFormData({
        name: item.name,
        currentStock: item.currentStock,
        minStock: item.minStock,
        unit: item.unit,
        price: item.cost,
        supplier: item.supplier
      });
    } else {
      setEditingItem(null);
      setFormData(initialFormData);
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
    setFormData(initialFormData);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const inventoryData: Omit<InventoryDTO, 'id'> = {
        name: formData.name,
        currentStock: formData.currentStock,
        minStock: formData.minStock,
        unit: formData.unit,
        price: formData.price,
        supplier: formData.supplier,
        lastUpdate: new Date().toISOString()
      };

      if (editingItem) {
        // Update existing item
        await handleUpdateInventory(parseInt(editingItem.id), {
          ...inventoryData,
          id: parseInt(editingItem.id)
        });
      } else {
        // Create new item
        await handleCreateInventory(inventoryData);
      }
      
      handleCloseModal();
    } catch (err) {
      // Error is already handled in the API functions
      console.error('Form submission error:', err);
    }
  };

  const getStockStatus = (current: number, min: number) => {
    if (current <= 0) return { status: 'out', color: 'bg-red-100 text-red-800', icon: <AlertTriangle className="h-4 w-4" /> };
    if (current <= min) return { status: 'low', color: 'bg-yellow-100 text-yellow-800', icon: <AlertTriangle className="h-4 w-4" /> };
    return { status: 'good', color: 'bg-green-100 text-green-800', icon: <Package className="h-4 w-4" /> };
  };

  const getStockPercentage = (current: number, min: number) => {
    const percentage = (current / min) * 100;
    return Math.min(percentage, 100);
  };

  // Use backend inventory data if available, otherwise use context data
  const currentInventory = backendInventory.length > 0 ? backendInventory : inventory;
  
  const filteredItems = currentInventory.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.supplier.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const lowStockItems = currentInventory.filter(item => item.currentStock <= item.minStock);
  const outOfStockItems = currentInventory.filter(item => item.currentStock <= 0);
  const totalValue = currentInventory.reduce((sum, item) => sum + (item.currentStock * item.cost), 0);

  return (
    <div className="p-6 bg-gradient-to-br from-green-50 via-white to-blue-50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Inventory Management</h1>
              <p className="text-gray-600">Track stock levels, manage suppliers, and monitor inventory costs</p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={loadInventoryFromBackend}
                disabled={isLoading}
                className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
              >
                <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                <span>Refresh</span>
              </button>
              <button
                onClick={loadMockData}
                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
                title="Load mock data for testing"
              >
                <Package className="h-4 w-4" />
                <span>Load Mock Data</span>
              </button>
            </div>
          </div>
        </div>

        {/* Error and Success Messages */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            <div className="flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2" />
              {error}
            </div>
          </div>
        )}

        {success && (
          <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
            <div className="flex items-center">
              <Package className="h-5 w-5 mr-2" />
              {success}
            </div>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {(() => {
            const analytics = getInventoryAnalytics();
            return (
              <>
                <div className="bg-white rounded-xl shadow-sm p-6 border border-green-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Items</p>
                      <p className="text-2xl font-bold text-gray-900">{analytics.totalItems}</p>
                    </div>
                    <Package className="h-8 w-8 text-green-600" />
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6 border border-green-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Low Stock Items</p>
                      <p className="text-2xl font-bold text-gray-900">{analytics.lowStockItems}</p>
                    </div>
                    <AlertTriangle className="h-8 w-8 text-yellow-600" />
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6 border border-green-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Out of Stock</p>
                      <p className="text-2xl font-bold text-gray-900">{analytics.outOfStockItems}</p>
                    </div>
                    <Package2 className="h-8 w-8 text-red-600" />
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6 border border-green-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Value</p>
                      <p className="text-2xl font-bold text-gray-900">RS{analytics.totalValue.toFixed(2)}</p>
                    </div>
                  </div>
                </div>
              </>
            );
          })()}
        </div>

        {/* Controls */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8 border border-green-100">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search inventory..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
                <Package className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>
              
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category === 'all' ? 'All Categories' : category}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={() => exportInventoryData()}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
                title="Export to CSV"
              >
                <Download className="h-4 w-4" />
                <span className="hidden sm:inline">Export</span>
              </button>
              
              <button
                onClick={() => handleOpenModal()}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg flex items-center space-x-2 transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                <Plus className="h-5 w-5" />
                <span>Add Item</span>
              </button>
            </div>
          </div>
        </div>

        {/* Inventory Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map(item => {
            const stockStatus = getStockStatus(item.currentStock, item.minStock);
            const stockPercentage = getStockPercentage(item.currentStock, item.minStock);
            
            return (
              <div key={item.id} className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition-all duration-300 border border-green-100">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">{item.name}</h3>
                      <p className="text-sm text-gray-500">{item.supplier}</p>
                    </div>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${stockStatus.color}`}>
                      {stockStatus.icon}
                      <span className="ml-1 capitalize">{stockStatus.status}</span>
                    </span>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Current Stock:</span>
                      <span className="text-sm font-medium text-gray-900">
                        {item.currentStock} {item.unit}
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Min Stock:</span>
                      <span className="text-sm font-medium text-gray-900">
                        {item.minStock} {item.unit}
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Unit Price:</span>
                      <span className="text-sm font-medium text-gray-900">
                      RS{item.cost.toFixed(2)}
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Total Value:</span>
                      <span className="text-sm font-medium text-gray-900">
                      RS{(item.currentStock * item.cost).toFixed(2)}
                      </span>
                    </div>
                  </div>
                  
                  {/* Stock Level Bar */}
                  <div className="mt-4">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs text-gray-500">Stock Level</span>
                      <span className="text-xs text-gray-500">{Math.round(stockPercentage)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-300 ${
                          stockStatus.status === 'out' ? 'bg-red-500' :
                          stockStatus.status === 'low' ? 'bg-yellow-500' : 'bg-green-500'
                        }`}
                        style={{ width: `${stockPercentage}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex justify-between items-center text-xs text-gray-500">
                      <span>Last updated: {new Date(item.lastUpdated).toLocaleDateString()}</span>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleOpenModal(item)}
                          className="text-blue-600 hover:text-blue-900 transition-colors"
                          title="Edit"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => setShowDeleteConfirm(parseInt(item.id))}
                          className="text-red-600 hover:text-red-900 transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filteredItems.length === 0 && (
          <div className="text-center py-12">
            <Package className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No inventory items found</h3>
            <p className="text-gray-600">
              {searchTerm ? `No items matching "${searchTerm}"` : 'No inventory items yet'}
            </p>
          </div>
        )}

        {/* Low Stock Alerts */}
        {lowStockItems.length > 0 && (
          <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-xl p-6">
            <div className="flex items-center mb-4">
              <AlertTriangle className="h-6 w-6 text-yellow-600 mr-2" />
              <h3 className="text-lg font-medium text-yellow-800">Low Stock Alerts</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {lowStockItems.slice(0, 6).map(item => (
                <div key={item.id} className="bg-white rounded-lg p-4 border border-yellow-200">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium text-gray-900">{item.name}</h4>
                      <p className="text-sm text-gray-500">{item.supplier}</p>
                    </div>
                    <span className="text-sm font-medium text-red-600">
                      {item.currentStock} {item.unit}
                    </span>
                  </div>
                  <div className="mt-2 text-xs text-gray-500">
                    Min: {item.minStock} {item.unit}
                  </div>
                </div>
              ))}
            </div>
            {lowStockItems.length > 6 && (
              <p className="text-sm text-yellow-700 mt-4">
                And {lowStockItems.length - 6} more items need restocking...
              </p>
            )}
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center">
                  <AlertTriangle className="h-6 w-6 text-red-600 mr-3" />
                  <h2 className="text-xl font-bold text-gray-900">Confirm Delete</h2>
                </div>
              </div>
              <div className="p-6">
                <p className="text-gray-600 mb-6">
                  Are you sure you want to delete this inventory item? This action cannot be undone.
                </p>
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => setShowDeleteConfirm(null)}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleDeleteInventory(showDeleteConfirm)}
                    disabled={isLoading}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white rounded-lg transition-colors"
                  >
                    {isLoading ? 'Deleting...' : 'Delete'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {editingItem ? 'Edit Inventory Item' : 'Add New Item'}
                  </h2>
                  <button
                    onClick={handleCloseModal}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Item Name
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Supplier
                    </label>
                    <input
                      type="text"
                      value={formData.supplier}
                      onChange={(e) => setFormData(prev => ({ ...prev, supplier: e.target.value }))}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Current Stock
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={formData.currentStock}
                      onChange={(e) => setFormData(prev => ({ ...prev, currentStock: parseInt(e.target.value) || 0 }))}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Min Stock Level
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={formData.minStock}
                      onChange={(e) => setFormData(prev => ({ ...prev, minStock: parseInt(e.target.value) || 0 }))}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Unit
                    </label>
                    <select
                      value={formData.unit}
                      onChange={(e) => setFormData(prev => ({ ...prev, unit: e.target.value }))}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      required
                    >
                      <option value="">Select Unit</option>
                      {units.map(unit => (
                        <option key={unit} value={unit}>{unit}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Unit Price (RS)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.price}
                      onChange={(e) => setFormData(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
                      className="w-full border border-gray-300 rounded-lg pl-10 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      required
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg flex items-center space-x-2 transition-colors"
                  >
                    <Save className="h-4 w-4" />
                    <span>{editingItem ? 'Update' : 'Create'} Item</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}; 