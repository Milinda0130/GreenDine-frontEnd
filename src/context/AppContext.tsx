import React, { createContext, useContext, useState, ReactNode } from 'react';
import { MenuItem, CartItem, Order, Reservation, InventoryItem, WasteAnalysis } from '../types';

interface AppContextType {
  // Cart
  cart: CartItem[];
  addToCart: (item: MenuItem) => void;
  removeFromCart: (itemId: string) => void;
  updateCartQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  cartTotal: number;
  
  // Orders
  orders: Order[];
  placeOrder: (orderData: Omit<Order, 'id' | 'timestamp'>) => string;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
  
  // Reservations
  reservations: Reservation[];
  makeReservation: (reservationData: Omit<Reservation, 'id'>) => string;
  updateReservationStatus: (reservationId: string, status: Reservation['status']) => void;
  
  // Menu
  menuItems: MenuItem[];
  updateMenuItem: (item: MenuItem) => void;
  addMenuItem: (item: Omit<MenuItem, 'id'>) => void;
  deleteMenuItem: (itemId: string) => void;
  
  // Inventory
  inventory: InventoryItem[];
  updateInventoryItem: (item: InventoryItem) => void;
  
  // Waste Analysis
  wasteAnalyses: WasteAnalysis[];
  submitWasteAnalysis: (analysis: Omit<WasteAnalysis, 'id' | 'timestamp'>) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Mock data
const initialMenuItems: MenuItem[] = [
  {
    id: '1',
    name: 'Organic Garden Salad',
    description: 'Fresh mixed greens with seasonal vegetables, nuts, and organic vinaigrette',
    price: 16.99,
    category: 'Salads',
    image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400',
    dietary: ['vegetarian', 'vegan', 'gluten-free'],
    available: true,
    ingredients: ['Mixed greens', 'Tomatoes', 'Cucumbers', 'Walnuts', 'Olive oil']
  },
  {
    id: '2',
    name: 'Sustainable Salmon',
    description: 'Pan-seared Atlantic salmon with quinoa and steamed vegetables',
    price: 28.99,
    category: 'Main Course',
    image: 'https://images.pexels.com/photos/725991/pexels-photo-725991.jpeg?auto=compress&cs=tinysrgb&w=400',
    dietary: ['gluten-free'],
    available: true,
    ingredients: ['Salmon', 'Quinoa', 'Broccoli', 'Carrots', 'Lemon']
  },
  {
    id: '3',
    name: 'Plant-Based Burger',
    description: 'House-made patty with avocado, lettuce, tomato on a whole grain bun',
    price: 19.99,
    category: 'Main Course',
    image: 'https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg?auto=compress&cs=tinysrgb&w=400',
    dietary: ['vegetarian', 'vegan'],
    available: true,
    ingredients: ['Plant protein', 'Avocado', 'Lettuce', 'Tomato', 'Whole grain bun']
  },
  {
    id: '4',
    name: 'Seasonal Soup',
    description: 'Chef\'s daily selection made with locally sourced ingredients',
    price: 12.99,
    category: 'Soups',
    image: 'https://images.pexels.com/photos/539451/pexels-photo-539451.jpeg?auto=compress&cs=tinysrgb&w=400',
    dietary: ['vegetarian'],
    available: true,
    ingredients: ['Seasonal vegetables', 'Vegetable broth', 'Herbs', 'Spices']
  },
  {
    id: '5',
    name: 'Eco-Friendly Smoothie',
    description: 'Organic fruits and vegetables blended with plant-based milk',
    price: 8.99,
    category: 'Beverages',
    image: 'https://images.pexels.com/photos/775032/pexels-photo-775032.jpeg?auto=compress&cs=tinysrgb&w=400',
    dietary: ['vegetarian', 'vegan', 'gluten-free'],
    available: true,
    ingredients: ['Spinach', 'Banana', 'Mango', 'Almond milk', 'Chia seeds']
  },
  {
    id: '6',
    name: 'Artisan Pizza',
    description: 'Wood-fired pizza with organic toppings and house-made dough',
    price: 22.99,
    category: 'Main Course',
    image: 'https://images.pexels.com/photos/315755/pexels-photo-315755.jpeg?auto=compress&cs=tinysrgb&w=400',
    dietary: ['vegetarian'],
    available: true,
    ingredients: ['Pizza dough', 'Tomato sauce', 'Mozzarella', 'Basil', 'Olive oil']
  }
];

const initialOrders: Order[] = [
  {
    id: '1',
    customerId: '1',
    customerName: 'John Customer',
    items: [{ ...initialMenuItems[0], quantity: 1 }, { ...initialMenuItems[4], quantity: 2 }],
    total: 34.97,
            status: 'PREPARING',
    timestamp: new Date(Date.now() - 30 * 60 * 1000),
    type: 'DINE_IN',
    tableNumber: 5
  },
  {
    id: '2',
    customerId: '2',
    customerName: 'Sarah Smith',
    items: [{ ...initialMenuItems[1], quantity: 1 }, { ...initialMenuItems[3], quantity: 1 }],
    total: 41.98,
            status: 'DELIVERED',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
          type: 'TAKEAWAY'
  },
  {
    id: '3',
    customerId: '3',
    customerName: 'Mike Johnson',
    items: [{ ...initialMenuItems[2], quantity: 2 }, { ...initialMenuItems[5], quantity: 1 }],
    total: 62.97,
            status: 'READY',
    timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
    type: 'DINE_IN',
    tableNumber: 8
  },
  {
    id: '4',
    customerId: '4',
    customerName: 'Emily Davis',
    items: [{ ...initialMenuItems[0], quantity: 1 }, { ...initialMenuItems[5], quantity: 1 }],
    total: 39.98,
    status: 'PENDING',
    timestamp: new Date(Date.now() - 15 * 60 * 1000),
    type: 'DELIVERY'
  },
  {
    id: '5',
    customerId: '5',
    customerName: 'David Wilson',
    items: [{ ...initialMenuItems[1], quantity: 1 }, { ...initialMenuItems[4], quantity: 3 }],
    total: 55.96,
    status: 'CANCELLED',
    timestamp: new Date(Date.now() - 45 * 60 * 1000),
    type: 'DINE_IN',
    tableNumber: 12
  }
];

const initialReservations: Reservation[] = [
  {
    id: '1',
    customerId: '1',
    customerName: 'John Customer',
    customerPhone: '+1234567890',
    date: new Date(Date.now() + 24 * 60 * 60 * 1000),
    time: '19:00',
    guests: 4,
    status: 'confirmed',
    tableNumber: 12
  },
  {
    id: '2',
    customerId: '2',
    customerName: 'Sarah Smith',
    customerPhone: '+1234567891',
    date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
    time: '20:00',
    guests: 2,
    status: 'pending',
    tableNumber: 5
  },
  {
    id: '3',
    customerId: '3',
    customerName: 'Mike Johnson',
    customerPhone: '+1234567892',
    date: new Date(Date.now() - 24 * 60 * 60 * 1000),
    time: '18:30',
    guests: 6,
    status: 'completed',
    tableNumber: 8
  },
  {
    id: '4',
    customerId: '4',
    customerName: 'Emily Davis',
    customerPhone: '+1234567893',
    date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    time: '19:30',
    guests: 3,
    status: 'confirmed',
    tableNumber: 15
  },
  {
    id: '5',
    customerId: '5',
    customerName: 'David Wilson',
    customerPhone: '+1234567894',
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    time: '20:30',
    guests: 4,
    status: 'cancelled',
    tableNumber: 10
  }
];

const initialInventory: InventoryItem[] = [
  {
    id: '1',
    name: 'Organic Mixed Greens',
    currentStock: 15,
    minStock: 10,
    unit: 'kg',
    cost: 8.50,
    supplier: 'Local Farms Co.',
    lastUpdated: new Date()
  },
  {
    id: '2',
    name: 'Atlantic Salmon',
    currentStock: 8,
    minStock: 12,
    unit: 'kg',
    cost: 24.99,
    supplier: 'Sustainable Seafood Inc.',
    lastUpdated: new Date()
  },
  {
    id: '3',
    name: 'Plant Protein Patties',
    currentStock: 25,
    minStock: 15,
    unit: 'pieces',
    cost: 3.20,
    supplier: 'Green Foods Ltd.',
    lastUpdated: new Date()
  }
];

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [reservations, setReservations] = useState<Reservation[]>(initialReservations);
  const [menuItems, setMenuItems] = useState<MenuItem[]>(initialMenuItems);
  const [inventory, setInventory] = useState<InventoryItem[]>(initialInventory);
  const [wasteAnalyses, setWasteAnalyses] = useState<WasteAnalysis[]>([
    {
      id: '1',
      customerId: '1',
      orderId: '1',
      imageUrl: 'https://via.placeholder.com/300x200?text=Waste+Analysis+1',
      wastePercentage: 8.5,
      aiConfidence: 92.3,
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      feedback: 'Great job! Very little waste detected.'
    },
    {
      id: '2',
      customerId: '2',
      orderId: '2',
      imageUrl: 'https://via.placeholder.com/300x200?text=Waste+Analysis+2',
      wastePercentage: 12.3,
      aiConfidence: 89.7,
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
      feedback: 'Moderate waste detected. Consider smaller portions.'
    },
    {
      id: '3',
      customerId: '3',
      orderId: '3',
      imageUrl: 'https://via.placeholder.com/300x200?text=Waste+Analysis+3',
      wastePercentage: 5.2,
      aiConfidence: 95.1,
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
      feedback: 'Excellent! Minimal waste detected.'
    },
    {
      id: '4',
      customerId: '4',
      orderId: '4',
      imageUrl: 'https://via.placeholder.com/300x200?text=Waste+Analysis+4',
      wastePercentage: 18.7,
      aiConfidence: 87.4,
      timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000),
      feedback: 'High waste detected. Please consider food waste reduction.'
    },
    {
      id: '5',
      customerId: '5',
      orderId: '5',
      imageUrl: 'https://via.placeholder.com/300x200?text=Waste+Analysis+5',
      wastePercentage: 6.8,
      aiConfidence: 93.2,
      timestamp: new Date(Date.now() - 10 * 60 * 60 * 1000),
      feedback: 'Good job! Low waste detected.'
    }
  ]);

  // Cart functions
  const addToCart = (item: MenuItem) => {
    setCart(prev => {
      const existingItem = prev.find(cartItem => cartItem.id === item.id);
      if (existingItem) {
        return prev.map(cartItem =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const removeFromCart = (itemId: string) => {
    setCart(prev => prev.filter(item => item.id !== itemId));
  };

  const updateCartQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    setCart(prev =>
      prev.map(item =>
        item.id === itemId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartTotal = cart.reduce((total, item) => {
    const price = typeof item.price === 'string' ? parseFloat(item.price) : item.price;
    const quantity = typeof item.quantity === 'string' ? parseInt(item.quantity) : item.quantity;
    const itemTotal = price * quantity;
    console.log(`Cart item: ${item.name}, Price: RS${price}, Quantity: ${quantity}, Total: RS${itemTotal}`);
    return total + itemTotal;
  }, 0);

  // Order functions
  const placeOrder = (orderData: Omit<Order, 'id' | 'timestamp'>): string => {
    const newOrder: Order = {
      ...orderData,
      id: Date.now().toString(),
      timestamp: new Date()
    };
    setOrders(prev => [newOrder, ...prev]);
    clearCart();
    return newOrder.id;
  };

  const updateOrderStatus = (orderId: string, status: Order['status']) => {
    setOrders(prev =>
      prev.map(order =>
        order.id === orderId ? { ...order, status } : order
      )
    );
  };

  // Reservation functions
  const makeReservation = (reservationData: Omit<Reservation, 'id'>): string => {
    const newReservation: Reservation = {
      ...reservationData,
      id: Date.now().toString()
    };
    setReservations(prev => [newReservation, ...prev]);
    return newReservation.id;
  };

  const updateReservationStatus = (reservationId: string, status: Reservation['status']) => {
    setReservations(prev =>
      prev.map(reservation =>
        reservation.id === reservationId ? { ...reservation, status } : reservation
      )
    );
  };

  // Menu functions
  const updateMenuItem = (item: MenuItem) => {
    setMenuItems(prev =>
      prev.map(menuItem =>
        menuItem.id === item.id ? item : menuItem
      )
    );
  };

  const addMenuItem = (item: Omit<MenuItem, 'id'>) => {
    const newItem: MenuItem = {
      ...item,
      id: Date.now().toString()
    };
    setMenuItems(prev => [...prev, newItem]);
  };

  const deleteMenuItem = (itemId: string) => {
    setMenuItems(prev => prev.filter(item => item.id !== itemId));
  };

  // Inventory functions
  const updateInventoryItem = (item: InventoryItem) => {
    setInventory(prev =>
      prev.map(inventoryItem =>
        inventoryItem.id === item.id ? item : inventoryItem
      )
    );
  };

  // Waste analysis functions
  const submitWasteAnalysis = (analysis: Omit<WasteAnalysis, 'id' | 'timestamp'>) => {
    const newAnalysis: WasteAnalysis = {
      ...analysis,
      id: Date.now().toString(),
      timestamp: new Date()
    };
    setWasteAnalyses(prev => [newAnalysis, ...prev]);
  };

  return (
    <AppContext.Provider value={{
      cart,
      addToCart,
      removeFromCart,
      updateCartQuantity,
      clearCart,
      cartTotal,
      orders,
      placeOrder,
      updateOrderStatus,
      reservations,
      makeReservation,
      updateReservationStatus,
      menuItems,
      updateMenuItem,
      addMenuItem,
      deleteMenuItem,
      inventory,
      updateInventoryItem,
      wasteAnalyses,
      submitWasteAnalysis
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};