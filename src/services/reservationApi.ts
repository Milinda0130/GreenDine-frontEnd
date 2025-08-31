const API_BASE_URL = '/api'; // Using Vite proxy to avoid CORS

export interface ReservationDTO {
  id?: number;
  name: string;
  phone: string;
  date: string;
  numberOfGuests: number;
  time: string;
  tableNumber?: number;
  status?: string;
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
      throw new Error(`Failed to fetch reservations: ${response.status}`);
    }

    return response.json();
  }

  async getReservationById(id: number): Promise<ReservationDTO> {
    const response = await fetch(`${API_BASE_URL}/reservation/${id}`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch reservation: ${response.status}`);
    }

    return response.json();
  }

  async createReservation(reservation: Omit<ReservationDTO, 'id'>): Promise<ReservationDTO> {
    const response = await fetch(`${API_BASE_URL}/reservation/save`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(reservation),
    });

    if (!response.ok) {
      throw new Error(`Failed to create reservation: ${response.status}`);
    }

    return response.json();
  }

  async updateReservation(id: number, reservation: ReservationDTO): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/reservation/update/${id}`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(reservation),
    });

    if (!response.ok) {
      throw new Error(`Failed to update reservation: ${response.status}`);
    }
  }

  async deleteReservation(id: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/reservation/delete/${id}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Failed to delete reservation: ${response.status}`);
    }
  }

  async updateReservationStatus(id: number, status: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/reservation/status/${id}?status=${status}`, {
      method: 'PATCH',
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Failed to update reservation status: ${response.status}`);
    }
  }

  async getReservationsByStatus(status: string): Promise<ReservationDTO[]> {
    const response = await fetch(`${API_BASE_URL}/reservation/status/${status}`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch reservations by status: ${response.status}`);
    }

    return response.json();
  }

  async getReservationsByDate(date: string): Promise<ReservationDTO[]> {
    const response = await fetch(`${API_BASE_URL}/reservation/date/${date}`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch reservations by date: ${response.status}`);
    }

    return response.json();
  }

  async searchReservationsByName(name: string): Promise<ReservationDTO[]> {
    const response = await fetch(`${API_BASE_URL}/reservation/search?name=${encodeURIComponent(name)}`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Failed to search reservations: ${response.status}`);
    }

    return response.json();
  }
}

export const reservationApiService = new ReservationApiService();
