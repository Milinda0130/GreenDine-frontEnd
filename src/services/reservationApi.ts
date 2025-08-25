const API_BASE_URL = 'http://localhost:8081'; // Reservation Service

export interface ReservationDTO {
  id?: number;
  name: string;
  phone: string;
  date: string; // LocalDate from backend comes as string
  numberOfGuests: number;
  time: string;
  tableNumber?: number;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';
  notes?: string;
}

class ReservationApiService {
  private getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem('jwtToken');
    return {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    };
  }

  async getAllReservations(): Promise<ReservationDTO[]> {
    const response = await fetch(`${API_BASE_URL}/reservation/all`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Failed to fetch reservations: ${response.status} ${response.statusText}`, errorText);
      throw new Error(`Failed to fetch reservations: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  async getReservationById(id: number): Promise<ReservationDTO> {
    const response = await fetch(`${API_BASE_URL}/reservation/${id}`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Failed to fetch reservation ${id}: ${response.status} ${response.statusText}`, errorText);
      throw new Error(`Failed to fetch reservation: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  async saveReservation(reservation: Omit<ReservationDTO, 'id'>): Promise<ReservationDTO> {
    const response = await fetch(`${API_BASE_URL}/reservation/save`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(reservation),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Failed to save reservation: ${response.status} ${response.statusText}`, errorText);
      throw new Error(`Failed to save reservation: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  async updateReservation(id: number, reservation: ReservationDTO): Promise<string> {
    const response = await fetch(`${API_BASE_URL}/reservation/update/${id}`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(reservation),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Failed to update reservation ${id}: ${response.status} ${response.statusText}`, errorText);
      throw new Error(`Failed to update reservation: ${response.status} ${response.statusText}`);
    }

    return response.text();
  }

  async deleteReservation(id: number): Promise<string> {
    const response = await fetch(`${API_BASE_URL}/reservation/delete/${id}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Failed to delete reservation ${id}: ${response.status} ${response.statusText}`, errorText);
      throw new Error(`Failed to delete reservation: ${response.status} ${response.statusText}`);
    }

    return response.text();
  }

  async updateReservationStatus(id: number, status: ReservationDTO['status']): Promise<string> {
    const response = await fetch(`${API_BASE_URL}/reservation/status/${id}?status=${status}`, {
      method: 'PATCH',
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Failed to update reservation status ${id}: ${response.status} ${response.statusText}`, errorText);
      throw new Error(`Failed to update reservation status: ${response.status} ${response.statusText}`);
    }

    return response.text();
  }

  async getReservationsByStatus(status: ReservationDTO['status']): Promise<ReservationDTO[]> {
    const response = await fetch(`${API_BASE_URL}/reservation/status/${status}`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Failed to fetch reservations by status ${status}: ${response.status} ${response.statusText}`, errorText);
      throw new Error(`Failed to fetch reservations by status: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  async getReservationsByDate(date: string): Promise<ReservationDTO[]> {
    const response = await fetch(`${API_BASE_URL}/reservation/date/${date}`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Failed to fetch reservations by date ${date}: ${response.status} ${response.statusText}`, errorText);
      throw new Error(`Failed to fetch reservations by date: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  async searchReservationsByName(name: string): Promise<ReservationDTO[]> {
    const response = await fetch(`${API_BASE_URL}/reservation/search?name=${encodeURIComponent(name)}`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Failed to search reservations by name ${name}: ${response.status} ${response.statusText}`, errorText);
      throw new Error(`Failed to search reservations by name: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  // Get reservations for a specific customer (by name/phone)
  async getCustomerReservations(customerName: string, customerPhone?: string): Promise<ReservationDTO[]> {
    try {
      // First try to search by name
      const byName = await this.searchReservationsByName(customerName);
      
      // If phone is provided, filter by phone as well
      if (customerPhone) {
        return byName.filter(reservation => 
          reservation.phone === customerPhone || 
          reservation.name.toLowerCase().includes(customerName.toLowerCase())
        );
      }
      
      return byName;
    } catch (error) {
      console.error('Error fetching customer reservations:', error);
      throw error;
    }
  }

  // Get today's reservations
  async getTodayReservations(): Promise<ReservationDTO[]> {
    const today = new Date().toISOString().split('T')[0];
    return this.getReservationsByDate(today);
  }

  // Get upcoming reservations (future dates)
  async getUpcomingReservations(): Promise<ReservationDTO[]> {
    try {
      const allReservations = await this.getAllReservations();
      const today = new Date().toISOString().split('T')[0];
      
      return allReservations.filter(reservation => 
        reservation.date >= today && 
        reservation.status !== 'CANCELLED' &&
        reservation.status !== 'COMPLETED'
      );
    } catch (error) {
      console.error('Error fetching upcoming reservations:', error);
      throw error;
    }
  }
}

export const reservationApiService = new ReservationApiService();
