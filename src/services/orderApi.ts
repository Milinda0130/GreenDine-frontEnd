const API_BASE_URL = '/api'; // Using Vite proxy to avoid CORS

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
      console.log('🚀 Creating order with data:', JSON.stringify(order, null, 2));
      console.log('📋 Request headers:', this.getAuthHeaders());
      
      const response = await fetch(`${API_BASE_URL}/orders`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(order),
      });

      console.log('📡 Response status:', response.status);
      console.log('📡 Response status text:', response.statusText);
      console.log('📡 Response headers:', Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Order creation failed:', response.status, response.statusText);
        console.error('❌ Error response body:', errorText);
        console.error('📤 Request body that was sent:', JSON.stringify(order, null, 2));
        
        // Try to parse error as JSON for better error messages
        try {
          const errorJson = JSON.parse(errorText);
          console.error('❌ Parsed error:', errorJson);
          throw new Error(`Failed to create order: ${response.status} ${response.statusText} - ${errorJson.message || errorJson.error || errorText}`);
        } catch (parseError) {
          throw new Error(`Failed to create order: ${response.status} ${response.statusText} - ${errorText}`);
        }
      }

      const result = await response.json();
      console.log('✅ Order created successfully:', result);
      return result;
    } catch (error) {
      console.error('❌ CORS or network error in createOrder:', error);
      throw error;
    }
  }

  // Debug function to test backend connection
  async testBackendConnection(): Promise<boolean> {
    try {
      console.log('🔍 Testing backend connection...');
      const response = await fetch(`${API_BASE_URL}/orders`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });
      
      console.log('📡 Backend test response status:', response.status);
      
      if (response.ok) {
        console.log('✅ Backend connection successful');
        return true;
      } else {
        console.log('❌ Backend connection failed:', response.status, response.statusText);
        return false;
      }
    } catch (error) {
      console.error('❌ Backend connection error:', error);
      return false;
    }
  }

  // Test function to create a simple order
  async testCreateOrder(): Promise<OrderDTO> {
    const testOrder = {
      customerId: 1,
      customerName: "Test Customer",
      total: 25.99,
      status: 'PENDING' as const,
      timestamp: new Date().toISOString(),
      type: 'DINE_IN' as const,
      tableNumber: 1,
      notes: "Test order from frontend",
      orderItems: [
        {
          menuItemId: 1,
          name: "Test Item",
          image: "https://via.placeholder.com/80x80?text=Test",
          price: 25.99,
          quantity: 1
        }
      ]
    };

    console.log('🧪 Testing order creation with data:', testOrder);
    return this.createOrder(testOrder);
  }

  // Test function to create a minimal order (without orderItems)
  async testCreateMinimalOrder(): Promise<OrderDTO> {
    const minimalOrder = {
      customerId: 1,
      customerName: "Test Customer",
      total: 25.99,
      status: 'PENDING' as const,
      timestamp: new Date().toISOString(),
      type: 'DINE_IN' as const,
      tableNumber: 1,
      notes: "Minimal test order",
      orderItems: [] // Empty array instead of missing property
    };

    console.log('🧪 Testing minimal order creation with data:', minimalOrder);
    return this.createOrder(minimalOrder);
  }

  // Test function to send the simplest possible order
  async testSimplestOrder(): Promise<OrderDTO> {
    const simplestOrder = {
      customerId: 1,
      customerName: "Simple Test",
      total: 10.00,
      status: 'PENDING' as const,
      timestamp: new Date().toISOString(),
      type: 'DINE_IN' as const,
      orderItems: [
        {
          menuItemId: 1,
          name: "Simple Item",
          image: "test.jpg",
          price: 10.00,
          quantity: 1
        }
      ]
    };

    console.log('🧪 Testing simplest possible order:', simplestOrder);
    return this.createOrder(simplestOrder);
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

  // Test function to check if backend endpoint exists
  async testEndpointExists(): Promise<boolean> {
    try {
      console.log('🔍 Testing if /orders endpoint exists...');
      const response = await fetch(`${API_BASE_URL}/orders`, {
        method: 'OPTIONS',
        headers: this.getAuthHeaders(),
      });
      
      console.log('📡 OPTIONS response status:', response.status);
      console.log('📡 OPTIONS response headers:', Object.fromEntries(response.headers.entries()));
      
      return response.status !== 404;
    } catch (error) {
      console.error('❌ Endpoint test failed:', error);
      return false;
    }
  }

  // Test function to identify orderItems issue
  async testOrderItemsIssue(): Promise<OrderDTO> {
    const testCases = [
      {
        name: "Order with single item - minimal data",
        order: {
          customerId: 1,
          customerName: "Test Customer",
          total: 10.00,
          status: 'PENDING' as const,
          timestamp: new Date().toISOString(),
          type: 'DINE_IN' as const,
          orderItems: [
            {
              menuItemId: 1,
              name: "Test Item",
              image: "test.jpg",
              price: 10.00,
              quantity: 1
            }
          ]
        }
      },
      {
        name: "Order with single item - no image",
        order: {
          customerId: 1,
          customerName: "Test Customer",
          total: 10.00,
          status: 'PENDING' as const,
          timestamp: new Date().toISOString(),
          type: 'DINE_IN' as const,
          orderItems: [
            {
              menuItemId: 1,
              name: "Test Item",
              image: "",
              price: 10.00,
              quantity: 1
            }
          ]
        }
      },
      {
        name: "Order with single item - null image",
        order: {
          customerId: 1,
          customerName: "Test Customer",
          total: 10.00,
          status: 'PENDING' as const,
          timestamp: new Date().toISOString(),
          type: 'DINE_IN' as const,
          orderItems: [
            {
              menuItemId: 1,
              name: "Test Item",
              image: null as any,
              price: 10.00,
              quantity: 1
            }
          ]
        }
      },
             {
         name: "Order with single item - without image field",
         order: {
           customerId: 1,
           customerName: "Test Customer",
           total: 10.00,
           status: 'PENDING' as const,
           timestamp: new Date().toISOString(),
           type: 'DINE_IN' as const,
           orderItems: [
             {
               menuItemId: 1,
               name: "Test Item",
               image: "", // Add empty image field to satisfy TypeScript
               price: 10.00,
               quantity: 1
             }
           ]
         }
       }
    ];

    for (const testCase of testCases) {
      try {
        console.log(`🧪 Testing: ${testCase.name}`);
        const result = await this.createOrder(testCase.order);
        console.log(`✅ ${testCase.name} - Success:`, result);
        return result;
      } catch (error) {
        console.error(`❌ ${testCase.name} - Failed:`, error);
        // Continue to next test case
      }
    }

    throw new Error('All orderItems test cases failed');
  }
}

export const orderApiService = new OrderApiService();
