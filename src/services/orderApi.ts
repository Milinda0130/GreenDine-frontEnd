const API_BASE_URL = 'http://localhost:8083'; // Order Service

export interface OrderItemDTO {
  id?: number;
  orderId?: number;
  menuItemId: number;
  name: string;
  image: string;
  price: number;
  quantity: number;
}

export interface OrderDTO {
  id?: number;
  customerId: number;
  customerName: string;
  total: number;
  status: 'PENDING' | 'PREPARING' | 'READY' | 'DELIVERED' | 'CANCELLED';
  timestamp: string;
  type: 'DINE_IN' | 'TAKEAWAY' | 'DELIVERY';
  tableNumber?: number;
  notes?: string;
  orderItems: OrderItemDTO[];
}

class OrderApiService {
  private getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem('jwtToken');
    return {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    };
  }

  async createOrder(order: Omit<OrderDTO, 'id'>): Promise<OrderDTO> {
    try {
      console.log('Creating order with data:', JSON.stringify(order, null, 2));
      console.log('Request headers:', this.getAuthHeaders());
      
      const response = await fetch(`${API_BASE_URL}/orders`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(order),
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Order creation failed: ${response.status} ${response.statusText}`);
        console.error('Error response body:', errorText);
        console.error('Request body that was sent:', JSON.stringify(order, null, 2));
        throw new Error(`Failed to create order: ${response.status} ${response.statusText} - ${errorText}`);
      }

      const result = await response.json();
      console.log('Order created successfully:', result);
      return result;
    } catch (error) {
      console.error('Error in createOrder:', error);
      throw error;
    }
  }

  async getOrderById(id: number): Promise<OrderDTO> {
    const response = await fetch(`${API_BASE_URL}/orders/${id}`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch order');
    }

    return response.json();
  }

  async getAllOrders(): Promise<OrderDTO[]> {
    const response = await fetch(`${API_BASE_URL}/orders`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Failed to fetch orders: ${response.status} ${response.statusText}`, errorText);
      throw new Error(`Failed to fetch orders: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  async getOrdersByCustomerId(customerId: number): Promise<OrderDTO[]> {
    const response = await fetch(`${API_BASE_URL}/orders/customer/${customerId}`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch customer orders');
    }

    return response.json();
  }

  async getOrdersByStatus(status: string): Promise<OrderDTO[]> {
    const response = await fetch(`${API_BASE_URL}/orders/status/${status}`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch orders by status');
    }

    return response.json();
  }

  async getOrdersByType(type: string): Promise<OrderDTO[]> {
    const response = await fetch(`${API_BASE_URL}/orders/type/${type}`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch orders by type');
    }

    return response.json();
  }

  async getOrdersByTableNumber(tableNumber: number): Promise<OrderDTO[]> {
    const response = await fetch(`${API_BASE_URL}/orders/table/${tableNumber}`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch orders by table');
    }

    return response.json();
  }

  async getTodaysOrders(): Promise<OrderDTO[]> {
    const response = await fetch(`${API_BASE_URL}/orders/today`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch today\'s orders');
    }

    return response.json();
  }

  async getPendingOrders(): Promise<OrderDTO[]> {
    const response = await fetch(`${API_BASE_URL}/orders/pending`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch pending orders');
    }

    return response.json();
  }

  async updateOrder(id: number, order: OrderDTO): Promise<OrderDTO> {
    const response = await fetch(`${API_BASE_URL}/orders/${id}`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(order),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Failed to update order ${id}: ${response.status} ${response.statusText}`, errorText);
      throw new Error(`Failed to update order: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  async updateOrderStatus(id: number, status: string): Promise<OrderDTO> {
    const response = await fetch(`${API_BASE_URL}/orders/${id}/status`, {
      method: 'PATCH',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(status),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || 'Failed to update order status');
    }

    return response.json();
  }

  async deleteOrder(id: number): Promise<string> {
    const response = await fetch(`${API_BASE_URL}/orders/${id}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Failed to delete order ${id}: ${response.status} ${response.statusText}`, errorText);
      throw new Error(`Failed to delete order: ${response.status} ${response.statusText}`);
    }

    return response.text();
  }

  async calculateOrderTotal(id: number): Promise<number> {
    const response = await fetch(`${API_BASE_URL}/orders/${id}/total`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to calculate order total');
    }

    return response.json();
  }

  async getOrderCountByStatus(status: string): Promise<number> {
    const response = await fetch(`${API_BASE_URL}/orders/count/status/${status}`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to get order count by status');
    }

    return response.json();
  }

  async getTotalRevenueByDateRange(startDate: string, endDate: string): Promise<number> {
    const response = await fetch(`${API_BASE_URL}/orders/revenue?startDate=${startDate}&endDate=${endDate}`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to get total revenue');
    }

    return response.json();
  }
}

export const orderApiService = new OrderApiService();
