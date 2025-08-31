import React, { useState, useEffect } from 'react';
import { 
  Calendar, Clock, Users, Plus, CheckCircle, XCircle, AlertCircle, Edit, Trash2,
  RefreshCw, Search, Filter, Eye, CalendarDays, TrendingUp, UserCheck, Bell,
  MapPin, Phone, User, CalendarCheck, CalendarX
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { reservationApiService, ReservationDTO } from '../../services/reservationApi';

export const ReservationsPage: React.FC = () => {
  const { user } = useAuth();
  const [reservations, setReservations] = useState<ReservationDTO[]>([]);
  const [userReservations, setUserReservations] = useState<ReservationDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [editingReservation, setEditingReservation] = useState<ReservationDTO | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    date: '',
    time: '',
    numberOfGuests: 2,
    notes: ''
  });

  // Load reservations on component mount
  useEffect(() => {
    loadReservations();
  }, [user]);

  const loadReservations = async () => {
    try {
      setLoading(true);
      setError(null);
      
      if (user) {
        try {
          // Load customer-specific reservations by searching by name
          const customerReservations = await reservationApiService.searchReservationsByName(user.name);
          setUserReservations(customerReservations);
          setSuccess(`Found ${customerReservations.length} reservations for you`);
        } catch (searchErr) {
          console.log('Search by name failed, trying to get all reservations and filter...');
          // Fallback: get all reservations and filter by name
          const allReservations = await reservationApiService.getAllReservations();
          const filteredReservations = allReservations.filter(reservation => 
            reservation.name.toLowerCase().includes(user.name.toLowerCase())
          );
          setUserReservations(filteredReservations);
          setSuccess(`Found ${filteredReservations.length} reservations for you`);
        }
      } else {
        // Load all reservations (for demo purposes)
        const allReservations = await reservationApiService.getAllReservations();
        setReservations(allReservations);
        setUserReservations(allReservations);
      }
    } catch (err) {
      console.error('Error loading reservations:', err);
      setError(err instanceof Error ? err.message : 'Failed to load reservations. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Filter reservations based on selected criteria
  const filteredReservations = userReservations.filter(reservation => {
    const matchesStatus = selectedStatus === 'all' || reservation.status === selectedStatus;
    const matchesDate = !selectedDate || reservation.date === selectedDate;
    const matchesSearch = !searchTerm || 
      reservation.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reservation.phone.includes(searchTerm) ||
      reservation.notes?.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesStatus && matchesDate && matchesSearch;
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setError('Please log in to make a reservation');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      // Ensure date is in YYYY-MM-DD format for backend
      const formattedDate = formData.date ? new Date(formData.date).toISOString().split('T')[0] : '';
      
      const reservationData: Omit<ReservationDTO, 'id'> = {
        name: formData.name,
        phone: formData.phone,
        date: formattedDate,
        time: formData.time,
        numberOfGuests: formData.numberOfGuests,
        status: 'PENDING',
        notes: formData.notes
      };

      console.log('Creating reservation with data:', reservationData);

      if (editingReservation && editingReservation.id) {
        await reservationApiService.updateReservation(editingReservation.id, {
          ...reservationData,
          id: editingReservation.id
        });
        setSuccess('Reservation updated successfully!');
      } else {
        await reservationApiService.createReservation(reservationData);
        setSuccess('Reservation created successfully! We will confirm your booking soon.');
      }

      // Reload reservations
      await loadReservations();
      
      // Reset form
      setFormData({ 
        name: user?.name || '', 
        phone: user?.phone || '', 
        date: '', 
        time: '', 
        numberOfGuests: 2, 
        notes: '' 
      });
      setShowBookingForm(false);
      setEditingReservation(null);
    } catch (err) {
      console.error('Error saving reservation:', err);
      setError(err instanceof Error ? err.message : 'Failed to save reservation. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to cancel this reservation?')) return;
    
    try {
      setIsLoading(true);
      setError(null);
      await reservationApiService.deleteReservation(id);
      setSuccess('Reservation cancelled successfully!');
      await loadReservations();
    } catch (err) {
      console.error('Error cancelling reservation:', err);
      setError('Failed to cancel reservation. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (reservation: ReservationDTO) => {
    setEditingReservation(reservation);
    setFormData({
      name: reservation.name,
      phone: reservation.phone,
      date: reservation.date,
      time: reservation.time,
      numberOfGuests: reservation.numberOfGuests,
      notes: reservation.notes || ''
    });
    setShowBookingForm(true);
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'confirmed':
        return <CheckCircle className="h-4 w-4" />;
      case 'pending':
        return <AlertCircle className="h-4 w-4" />;
      case 'cancelled':
        return <XCircle className="h-4 w-4" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  const timeSlots = [
    '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
    '17:00', '17:30', '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00'
  ];

  // Analytics for customer
  const getCustomerAnalytics = () => {
    const total = userReservations.length;
    const confirmed = userReservations.filter(r => r.status === 'CONFIRMED').length;
    const pending = userReservations.filter(r => r.status === 'PENDING').length;
    const upcoming = userReservations.filter(r => 
      r.date >= new Date().toISOString().split('T')[0] && 
      r.status !== 'CANCELLED' && 
      r.status !== 'COMPLETED'
    ).length;

    return { total, confirmed, pending, upcoming };
  };

  const analytics = getCustomerAnalytics();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your reservations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-slate-50 via-blue-50/30 to-green-50/30">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-slate-800 via-slate-700 to-slate-600 text-white py-16">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{
            backgroundImage: 'url(https://images.pexels.com/photos/1267320/pexels-photo-1267320.jpeg?auto=compress&cs=tinysrgb&w=1200)'
          }}
        ></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Calendar className="h-16 w-16 text-white mx-auto mb-4" />
          <h1 className="text-4xl md:text-5xl font-bold mb-4">My Reservations</h1>
          <p className="text-xl text-green-100 max-w-2xl mx-auto">
            Manage your dining reservations at Green Dine
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Error and Success Messages */}
        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-300 text-red-700 rounded-lg flex items-center justify-between">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 mr-2" />
              {error}
            </div>
            <button 
              onClick={() => setError(null)}
              className="text-red-500 hover:text-red-700"
            >
              ×
            </button>
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-green-100 border border-green-300 text-green-700 rounded-lg flex items-center justify-between">
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 mr-2" />
              {success}
            </div>
            <button 
              onClick={() => setSuccess(null)}
              className="text-green-500 hover:text-green-700"
            >
              ×
            </button>
          </div>
        )}

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center">
              <Calendar className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Reservations</p>
                <p className="text-2xl font-bold text-gray-900">{analytics.total}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center">
              <CheckCircle className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Confirmed</p>
                <p className="text-2xl font-bold text-gray-900">{analytics.confirmed}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center">
              <AlertCircle className="h-8 w-8 text-yellow-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-gray-900">{analytics.pending}</p>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center">
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Upcoming</p>
                <p className="text-2xl font-bold text-gray-900">{analytics.upcoming}</p>
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
                  placeholder="Search reservations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="border border-gray-300 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-gray-400" />
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="border border-gray-300 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
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
                  className="border border-gray-300 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
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
                onClick={loadReservations}
                disabled={isLoading}
                className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
              >
                <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                <span>Refresh</span>
              </button>
              
              <button
                onClick={() => setShowBookingForm(true)}
                className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-6 py-2 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                <Plus className="h-5 w-5 inline mr-2" />
                New Reservation
              </button>
            </div>
          </div>
        </div>

        {/* Reservations List */}
        <div className="space-y-6">
          {filteredReservations.length === 0 ? (
            <div className="text-center py-16">
              <div 
                className="w-32 h-32 mx-auto mb-6 rounded-full bg-cover bg-center opacity-60"
                style={{
                  backgroundImage: 'url(https://images.pexels.com/photos/1581384/pexels-photo-1581384.jpeg?auto=compress&cs=tinysrgb&w=400)'
                }}
              ></div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {searchTerm || selectedDate || selectedStatus !== 'all' 
                  ? 'No reservations match your filters' 
                  : 'No reservations yet'}
              </h3>
              <p className="text-gray-600 mb-6">
                {searchTerm || selectedDate || selectedStatus !== 'all'
                  ? 'Try adjusting your search criteria'
                  : 'Book your first table to enjoy our sustainable dining experience!'}
              </p>
              {!searchTerm && !selectedDate && selectedStatus === 'all' && (
                <button
                  onClick={() => setShowBookingForm(true)}
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition-colors"
                >
                  Make Your First Reservation
                </button>
              )}
            </div>
          ) : (
            filteredReservations.map(reservation => (
              <div key={reservation.id} className="bg-white rounded-xl shadow-sm border border-green-100 overflow-hidden hover:shadow-md transition-shadow">
                <div className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-4 mb-4">
                        <div className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(reservation.status)}`}>
                          {getStatusIcon(reservation.status)}
                          <span className="capitalize">{reservation.status.toLowerCase()}</span>
                        </div>
                        {reservation.tableNumber && (
                          <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                            <MapPin className="h-3 w-3 inline mr-1" />
                            Table {reservation.tableNumber}
                          </span>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-5 w-5 text-gray-400" />
                          <span className="text-gray-900 font-medium">
                            {new Date(reservation.date).toLocaleDateString('en-US', { 
                              weekday: 'long', 
                              year: 'numeric', 
                              month: 'long', 
                              day: 'numeric' 
                            })}
                          </span>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Clock className="h-5 w-5 text-gray-400" />
                          <span className="text-gray-900 font-medium">{reservation.time}</span>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Users className="h-5 w-5 text-gray-400" />
                          <span className="text-gray-900 font-medium">
                            {reservation.numberOfGuests} {reservation.numberOfGuests === 1 ? 'Guest' : 'Guests'}
                          </span>
                        </div>
                      </div>
                      
                      <div className="mt-4 flex items-center space-x-2">
                        <Phone className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-600">Contact: {reservation.phone}</span>
                      </div>
                      
                      {reservation.notes && (
                        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                          <p className="text-sm text-gray-700">
                            <strong>Notes:</strong> {reservation.notes}
                          </p>
                        </div>
                      )}
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex space-x-2 mt-4 lg:mt-0">
                      {reservation.status === 'PENDING' && (
                        <button
                          onClick={() => handleEdit(reservation)}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg transition-colors flex items-center"
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </button>
                      )}
                      {reservation.status === 'PENDING' && (
                        <button
                          onClick={() => reservation.id && handleDelete(reservation.id)}
                          disabled={isLoading}
                          className="bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white px-3 py-2 rounded-lg transition-colors flex items-center"
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Cancel
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Booking Form Modal */}
        {showBookingForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  {editingReservation ? 'Edit Reservation' : 'Make a Reservation'}
                </h2>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                    <input
                      type="date"
                      required
                      min={new Date().toISOString().split('T')[0]}
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Time</label>
                    <select
                      required
                      value={formData.time}
                      onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    >
                      <option value="">Select time</option>
                      {timeSlots.map(time => (
                        <option key={time} value={time}>{time}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Number of Guests</label>
                    <select
                      value={formData.numberOfGuests}
                      onChange={(e) => setFormData({ ...formData, numberOfGuests: parseInt(e.target.value) })}
                      className="w-full border border-gray-300 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
                        <option key={num} value={num}>{num} {num === 1 ? 'Guest' : 'Guests'}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Special Requests (Optional)</label>
                    <textarea
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      rows={3}
                      className="w-full border border-gray-300 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      placeholder="Any dietary restrictions, special occasions, etc."
                    />
                  </div>
                  
                  <div className="flex space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={() => {
                        setShowBookingForm(false);
                        setEditingReservation(null);
                        setFormData({ 
                          name: user?.name || '', 
                          phone: user?.phone || '', 
                          date: '', 
                          time: '', 
                          numberOfGuests: 2, 
                          notes: '' 
                        });
                      }}
                      className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded-lg transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="flex-1 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white py-2 px-4 rounded-lg transition-colors"
                    >
                      {isLoading ? 'Saving...' : (editingReservation ? 'Update Reservation' : 'Book Table')}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};