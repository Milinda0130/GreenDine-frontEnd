const API_BASE_URL = 'http://localhost:8083'; // Menu Service (same as Order Service)

export interface MenuItemDTO {
  id?: number;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  available: boolean;
  dietary: string[];
  ingredients: string[];
}

class MenuApiService {
  private getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem('jwtToken');
    return {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    };
  }

  async getAllMenuItems(): Promise<MenuItemDTO[]> {
    const response = await fetch(`${API_BASE_URL}/menu-items`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Failed to fetch menu items: ${response.status} ${response.statusText}`, errorText);
      throw new Error(`Failed to fetch menu items: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  async getMenuItemById(id: number): Promise<MenuItemDTO> {
    const response = await fetch(`${API_BASE_URL}/menu-items/${id}`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch menu item');
    }

    return response.json();
  }

  async createMenuItem(menuItem: Omit<MenuItemDTO, 'id'>): Promise<MenuItemDTO> {
    const response = await fetch(`${API_BASE_URL}/menu-items`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(menuItem),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || 'Failed to create menu item');
    }

    return response.json();
  }

  async updateMenuItem(id: number, menuItem: MenuItemDTO): Promise<MenuItemDTO> {
    const response = await fetch(`${API_BASE_URL}/menu-items/${id}`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(menuItem),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Failed to update menu item ${id}: ${response.status} ${response.statusText}`, errorText);
      throw new Error(`Failed to update menu item: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  async deleteMenuItem(id: number): Promise<string> {
    const response = await fetch(`${API_BASE_URL}/menu-items/${id}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Failed to delete menu item ${id}: ${response.status} ${response.statusText}`, errorText);
      throw new Error(`Failed to delete menu item: ${response.status} ${response.statusText}`);
    }

    return response.text();
  }

  async getMenuItemsByCategory(category: string): Promise<MenuItemDTO[]> {
    const response = await fetch(`${API_BASE_URL}/menu-items/category/${category}`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch menu items by category');
    }

    return response.json();
  }

  async getAvailableMenuItems(): Promise<MenuItemDTO[]> {
    const response = await fetch(`${API_BASE_URL}/menu-items/available`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch available menu items');
    }

    return response.json();
  }

  async searchMenuItemsByName(name: string): Promise<MenuItemDTO[]> {
    const response = await fetch(`${API_BASE_URL}/menu-items/search?name=${encodeURIComponent(name)}`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to search menu items');
    }

    return response.json();
  }
}

export const menuApiService = new MenuApiService();
