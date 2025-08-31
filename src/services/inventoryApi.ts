const API_BASE_URL = '/api'; // Using Vite proxy to avoid CORS

export interface InventoryDTO {
  id?: number;
  name: string;
  currentStock: number;
  minStock: number;
  unit: string;
  price: number;
  supplier: string;
  lastUpdate?: string;
}

class InventoryApiService {
  private getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem('jwtToken');
    return {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    };
  }

  async getAllInventories(): Promise<InventoryDTO[]> {
    const response = await fetch(`${API_BASE_URL}/inventory/all`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Failed to fetch inventories: ${response.status} ${response.statusText}`, errorText);
      throw new Error(`Failed to fetch inventories: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  async getInventoryById(id: number): Promise<InventoryDTO> {
    const response = await fetch(`${API_BASE_URL}/inventory/${id}`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch inventory');
    }

    return response.json();
  }

  async createInventory(inventory: Omit<InventoryDTO, 'id'>): Promise<InventoryDTO> {
    const response = await fetch(`${API_BASE_URL}/inventory/create`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(inventory),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || 'Failed to create inventory');
    }

    return response.json();
  }

  async updateInventory(id: number, inventory: InventoryDTO): Promise<string> {
    const response = await fetch(`${API_BASE_URL}/inventory/${id}`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(inventory),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Failed to update inventory ${id}: ${response.status} ${response.statusText}`, errorText);
      throw new Error(`Failed to update inventory: ${response.status} ${response.statusText}`);
    }

    return response.text();
  }

  async deleteInventory(id: number): Promise<string> {
    const response = await fetch(`${API_BASE_URL}/inventory/${id}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Failed to delete inventory ${id}: ${response.status} ${response.statusText}`, errorText);
      throw new Error(`Failed to delete inventory: ${response.status} ${response.statusText}`);
    }

    return response.text();
  }
}

export const inventoryApiService = new InventoryApiService();
