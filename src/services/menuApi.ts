const API_BASE_URL = '/api'; // Using Vite proxy to avoid CORS

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
    try {
      const response = await fetch(`${API_BASE_URL}/menu-items`, {
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Failed to fetch menu items: ${response.status} ${response.statusText}`, errorText);
        
        if (response.status === 403) {
          console.log('403 Forbidden - trying without auth headers...');
          // Try without auth headers for public endpoints
          const publicResponse = await fetch(`${API_BASE_URL}/menu-items`, {
            headers: {
              'Content-Type': 'application/json',
            },
          });
          
          if (publicResponse.ok) {
            return publicResponse.json();
          } else {
            throw new Error(`Menu items endpoint requires authentication or is not accessible: ${response.status} ${response.statusText}`);
          }
        }
        
        throw new Error(`Failed to fetch menu items: ${response.status} ${response.statusText}`);
      }

      return response.json();
    } catch (error) {
      console.error('CORS or network error when fetching menu items:', error);
      throw error;
    }
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
    try {
      const response = await fetch(`${API_BASE_URL}/menu-items/available`, {
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        if (response.status === 403) {
          console.log('403 Forbidden - trying without auth headers for available menu items...');
          // Try without auth headers for public endpoints
          const publicResponse = await fetch(`${API_BASE_URL}/menu-items/available`, {
            headers: {
              'Content-Type': 'application/json',
            },
          });
          
          if (publicResponse.ok) {
            return publicResponse.json();
          }
        }
        throw new Error('Failed to fetch available menu items');
      }

      return response.json();
    } catch (error) {
      console.error('Error fetching available menu items:', error);
      throw error;
    }
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
