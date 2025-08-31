import React, { useState, useEffect } from 'react';
import { 
  Calendar, Clock, Users, Phone, MapPin, CheckCircle, XCircle, AlertCircle, 
  Edit, Trash2, Plus, RefreshCw, Download, Filter, Search, Eye, CalendarDays,
  TrendingUp, TrendingDown, UserCheck, UserX, Bell, Settings
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { reservationApiService, ReservationDTO } from '../../services/reservationApi';

interface ReservationFormData {
  name: string;
  phone: string;
  date: string;
  time: string;
  numberOfGuests: number;
  tableNumber?: number;
  status: ReservationDTO['status'];
  notes?: string;
}

const initialFormData: ReservationFormData = {
  name: '',
  phone: '',
  date: '',
  time: '',
  numberOfGuests: 2,
  tableNumber: undefined,
  status: 'PENDING',
  notes: ''
};

export const ReservationManagementPage: React.FC = () => {
  const { user } = useAuth();
  const [reservations, setReservations] = useState<ReservationDTO[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingReservation, setEditingReservation] = useState<ReservationDTO | null>(null);
  const [formData, setFormData] = useState<ReservationFormData>(initialFormData);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');

  const timeSlots = [
    '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
    '17:00', '17:30', '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00'
  ];

  const tableNumbers = Array.from({ length: 20 }, (_, i) => i + 1);

  // Load reservations from backend on component mount
  useEffect(() => {
    loadReservationsFromBackend();
  }, []);

  const loadReservationsFromBackend = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await reservationApiService.getAllReservations();
      setReservations(data);
      setSuccess(`Successfully loaded ${data.length} reservations from backend`);
      console.log('✅ Connected to backend successfully!');
    } catch (err) {
      console.error('Error loading reservations:', err);
      
      console.error('Error loading reservations:', err);
      setError('Failed to load reservations from backend. Please check if your backend service is running on port 8081.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateReservation = async (reservationData: Omit<ReservationDTO, 'id'>) => {
    setIsLoading(true);
    setError(null);
    try {
              await reservationApiService.createReservation(reservationData);
      setSuccess('Reservation created successfully!');
      loadReservationsFromBackend(); // Reload the list
    } catch (err) {
      setError('Failed to create reservation');
      console.error('Error creating reservation:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateReservation = async (id: number, reservationData: ReservationDTO) => {
    setIsLoading(true);
    setError(null);
    try {
      await reservationApiService.updateReservation(id, reservationData);
      setSuccess('Reservation updated successfully!');
      loadReservationsFromBackend(); // Reload the list
    } catch (err) {
      setError('Failed to update reservation');
      console.error('Error updating reservation:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteReservation = async (id: number) => {
    setIsLoading(true);
    setError(null);
    try {
      await reservationApiService.deleteReservation(id);
      setSuccess('Reservation deleted successfully!');
      loadReservationsFromBackend(); // Reload the list
      setShowDeleteConfirm(null);
    } catch (err) {
      setError('Failed to delete reservation');
      console.error('Error deleting reservation:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusUpdate = async (id: number, status: ReservationDTO['status']) => {
    setIsLoading(true);
    setError(null);
    try {
      await reservationApiService.updateReservationStatus(id, status);
      setSuccess('Reservation status updated successfully!');
      loadReservationsFromBackend(); // Reload the list
    } catch (err) {
      setError('Failed to update reservation status');
      console.error('Error updating status:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenModal = (reservation?: ReservationDTO) => {
    if (reservation) {
      setEditingReservation(reservation);
      setFormData({
        name: reservation.name,
        phone: reservation.phone,
        date: reservation.date,
        time: reservation.time,
        numberOfGuests: reservation.numberOfGuests,
        tableNumber: reservation.tableNumber,
        status: reservation.status,
        notes: reservation.notes || ''
      });
    } else {
      setEditingReservation(null);
      setFormData(initialFormData);
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingReservation(null);
    setFormData(initialFormData);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const reservationData: Omit<ReservationDTO, 'id'> = {
        name: formData.name,
        phone: formData.phone,
        date: formData.date,
        time: formData.time,
        numberOfGuests: formData.numberOfGuests,
        tableNumber: formData.tableNumber,
        status: formData.status,
        notes: formData.notes
      };

      if (editingReservation && editingReservation.id) {
        await handleUpdateReservation(editingReservation.id, {
          ...reservationData,
          id: editingReservation.id
        });
      } else {
        await handleCreateReservation(reservationData);
      }
      
      handleCloseModal();
    } catch (err) {
      // Error is already handled in the API functions
      console.error('Form submission error:', err);
    }
  };

  const getStatusColor = (status: ReservationDTO['status']) => {
    switch (status) {
      case 'CONFIRMED':
        return 'bg-green-100 text-green-800';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800';
      case 'COMPLETED':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: ReservationDTO['status']) => {
    switch (status) {
      case 'CONFIRMED':
        return <CheckCircle className="h-4 w-4" />;
      case 'PENDING':
        return <AlertCircle className="h-4 w-4" />;
      case 'CANCELLED':
        return <XCircle className="h-4 w-4" />;
      case 'COMPLETED':
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  // Filter reservations based on selected criteria
  const filteredReservations = reservations.filter(reservation => {
    const matchesDate = !selectedDate || reservation.date === selectedDate;
    const matchesStatus = selectedStatus === 'all' || reservation.status === selectedStatus;
    const matchesSearch = !searchTerm || 
      reservation.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reservation.phone.includes(searchTerm) ||
      reservation.notes?.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesDate && matchesStatus && matchesSearch;
  });

  // Analytics
  const getReservationAnalytics = () => {
    const totalReservations = reservations.length;
    const todayReservations = reservations.filter(r => 
      r.date === new Date().toISOString().split('T')[0]
    );
    const upcomingReservations = reservations.filter(r => 
      r.date >= new Date().toISOString().split('T')[0] && 
      r.status !== 'CANCELLED' && 
      r.status !== 'COMPLETED'
    );
    const confirmedReservations = reservations.filter(r => r.status === 'CONFIRMED');
    const pendingReservations = reservations.filter(r => r.status === 'PENDING');
    const cancelledReservations = reservations.filter(r => r.status === 'CANCELLED');
    const completedReservations = reservations.filter(r => r.status === 'COMPLETED');

    return {
      total: totalReservations,
      today: todayReservations.length,
      upcoming: upcomingReservations.length,
      confirmed: confirmedReservations.length,
      pending: pendingReservations.length,
      cancelled: cancelledReservations.length,
      completed: completedReservations.length
    };
  };

  const exportReservationsData = () => {
    const csvContent = [
      ['Name', 'Phone', 'Date', 'Time', 'Guests', 'Table', 'Status', 'Notes'],
      ...filteredReservations.map(item => [
        item.name,
        item.phone,
        item.date,
        item.time,
        item.numberOfGuests.toString(),
        item.tableNumber?.toString() || 'Not assigned',
        item.status,
        item.notes || ''
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `reservations-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    
    setSuccess('Reservation data exported successfully!');
  };

  const analytics = getReservationAnalytics();

  return (
    <div className="p-6 bg-gradient-to-br from-green-50 via-white to-blue-50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Reservation Management</h1>
              <p className="text-gray-600">Manage table reservations and seating arrangements</p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={loadReservationsFromBackend}
                disabled={isLoading}
                className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
              >
                <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                <span>Refresh</span>
              </button>
             
            </div>
          </div>
        </div>

        {/* Error and Success Messages */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 mr-2" />
              {error}
            </div>
          </div>
        )}

        {success && (
          <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 mr-2" />
              {success}
            </div>
          </div>
        )}



        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-green-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Reservations</p>
                <p className="text-2xl font-bold text-gray-900">{analytics.total}</p>
              </div>
              <Calendar className="h-8 w-8 text-green-600" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-green-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Today's Reservations</p>
                <p className="text-2xl font-bold text-gray-900">{analytics.today}</p>
              </div>
              <Clock className="h-8 w-8 text-blue-600" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-green-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Upcoming</p>
                <p className="text-2xl font-bold text-gray-900">{analytics.upcoming}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-green-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Confirmed</p>
                <p className="text-2xl font-bold text-gray-900">{analytics.confirmed}</p>
              </div>
              <UserCheck className="h-8 w-8 text-blue-600" />

            </div>
          </div>
        </div>

        {/* Additional Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-yellow-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-gray-900">{analytics.pending}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-red-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Cancelled</p>
                <p className="text-2xl font-bold text-gray-900">{analytics.cancelled}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-blue-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-gray-900">{analytics.completed}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8 border border-green-100">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center space-x-2">
                <Search className="h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by name, phone, or notes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-gray-400" />
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
                {selectedDate && (
                  <button
                    onClick={() => setSelectedDate('')}
                    className="text-sm text-gray-500 hover:text-gray-700"
                  >
                    Clear
                  </button>
                )}
              </div>
              
              <div className="flex items-center space-x-2">
                <Filter className="h-4 w-4 text-gray-400" />
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                >
                  <option value="all">All Status</option>
                  <option value="PENDING">Pending</option>
                  <option value="CONFIRMED">Confirmed</option>
                  <option value="CANCELLED">Cancelled</option>
                  <option value="COMPLETED">Completed</option>
                </select>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={exportReservationsData}
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
                <span>New Reservation</span>
              </button>
            </div>
          </div>
        </div>

        {/* Reservations List */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-green-100">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date & Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Guests
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Table
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredReservations.map(reservation => (
                  <tr key={reservation.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {reservation.name}
                        </div>
                        <div className="text-sm text-gray-500 flex items-center">
                          <Phone className="h-3 w-3 mr-1" />
                          {reservation.phone}
                        </div>
                        {reservation.notes && (
                          <div className="text-xs text-gray-400 mt-1 truncate max-w-xs">
                            {reservation.notes}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {new Date(reservation.date).toLocaleDateString()}
                      </div>
                      <div className="text-sm text-gray-500 flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        {reservation.time}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Users className="h-4 w-4 text-gray-400 mr-2" />
                        <span className="text-sm text-gray-900">{reservation.numberOfGuests}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {reservation.tableNumber ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          <MapPin className="h-3 w-3 mr-1" />
                          Table {reservation.tableNumber}
                        </span>
                      ) : (
                        <span className="text-sm text-gray-500">Not assigned</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(reservation.status)}`}>
                        {getStatusIcon(reservation.status)}
                        <span className="ml-1 capitalize">{reservation.status.toLowerCase()}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleOpenModal(reservation)}
                          className="text-blue-600 hover:text-blue-900 transition-colors"
                          title="Edit"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <select
                          value={reservation.status}
                          onChange={(e) => reservation.id && handleStatusUpdate(reservation.id, e.target.value as ReservationDTO['status'])}
                          className="text-xs border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-green-500"
                        >
                          <option value="PENDING">Pending</option>
                          <option value="CONFIRMED">Confirmed</option>
                          <option value="CANCELLED">Cancelled</option>
                          <option value="COMPLETED">Completed</option>
                        </select>
                        <button
                          onClick={() => reservation.id && setShowDeleteConfirm(reservation.id)}
                          className="text-red-600 hover:text-red-900 transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredReservations.length === 0 && (
            <div className="text-center py-12">
              <Calendar className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No reservations found</h3>
              <p className="text-gray-600">
                {searchTerm || selectedDate || selectedStatus !== 'all' 
                  ? 'No reservations match your filters' 
                  : 'No reservations yet'}
              </p>
            </div>
          )}
        </div>

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center">
                  <AlertCircle className="h-6 w-6 text-red-600 mr-3" />
                  <h2 className="text-xl font-bold text-gray-900">Confirm Delete</h2>
                </div>
              </div>
              <div className="p-6">
                <p className="text-gray-600 mb-6">
                  Are you sure you want to delete this reservation? This action cannot be undone.
                </p>
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => setShowDeleteConfirm(null)}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleDeleteReservation(showDeleteConfirm)}
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
                    {editingReservation ? 'Edit Reservation' : 'New Reservation'}
                  </h2>
                  <button
                    onClick={handleCloseModal}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <XCircle className="h-6 w-6" />
                  </button>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Customer Name
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
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Date
                    </label>
                    <input
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Time
                    </label>
                    <select
                      value={formData.time}
                      onChange={(e) => setFormData(prev => ({ ...prev, time: e.target.value }))}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      required
                    >
                      <option value="">Select Time</option>
                      {timeSlots.map(time => (
                        <option key={time} value={time}>{time}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Number of Guests
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="20"
                      value={formData.numberOfGuests}
                      onChange={(e) => setFormData(prev => ({ ...prev, numberOfGuests: parseInt(e.target.value) }))}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Table Number (Optional)
                    </label>
                    <select
                      value={formData.tableNumber || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, tableNumber: e.target.value ? parseInt(e.target.value) : undefined }))}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    >
                      <option value="">Not assigned</option>
                      {tableNumbers.map(num => (
                        <option key={num} value={num}>Table {num}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {editingReservation && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Status
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as ReservationDTO['status'] }))}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    >
                      <option value="PENDING">Pending</option>
                      <option value="CONFIRMED">Confirmed</option>
                      <option value="CANCELLED">Cancelled</option>
                      <option value="COMPLETED">Completed</option>
                    </select>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Notes (Optional)
                  </label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                    rows={3}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="Special requests, dietary restrictions, etc."
                  />
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
                    disabled={isLoading}
                    className="px-6 py-2 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white rounded-lg transition-colors"
                  >
                    {isLoading ? 'Saving...' : (editingReservation ? 'Update' : 'Create')} Reservation
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