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
    status: 'preparing',
    timestamp: new Date(Date.now() - 30 * 60 * 1000),
    type: 'dine-in',
    tableNumber: 5
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
  const [wasteAnalyses, setWasteAnalyses] = useState<WasteAnalysis[]>([]);

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

  const cartTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);

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