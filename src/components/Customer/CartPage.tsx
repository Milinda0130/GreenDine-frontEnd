import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Minus, Plus, Trash2, ShoppingCart, ArrowLeft, AlertCircle, CheckCircle, Gift } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { orderApiService, OrderDTO } from '../../services/orderApi';
import { discountService, Discount } from '../../services/discountService';

export const CartPage: React.FC = () => {
  const { cart, updateCartQuantity, removeFromCart, cartTotal, clearCart, placeOrder } = useApp();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [orderType, setOrderType] = useState<'DINE_IN' | 'TAKEAWAY' | 'DELIVERY'>('DINE_IN');
  const [tableNumber, setTableNumber] = useState<number | undefined>(undefined);
  const [notes, setNotes] = useState('');
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [availableDiscounts, setAvailableDiscounts] = useState<Discount[]>([]);
  const [selectedDiscount, setSelectedDiscount] = useState<Discount | null>(null);

  // Load available discounts
  useEffect(() => {
    if (user) {
      discountService.getAvailableDiscounts(user.id).then(setAvailableDiscounts);
    }
  }, [user]);
  
  // Calculate discount
  const safeCartTotal = typeof cartTotal === 'number' && !isNaN(cartTotal) ? cartTotal : 0;
  const discountAmount = selectedDiscount ? (safeCartTotal * selectedDiscount.amount) / 100 : 0;
  const finalTotal = safeCartTotal - discountAmount;

  // Debug cart data
  console.log('Cart data:', cart);
  console.log('Cart total:', cartTotal);
  console.log('Cart total type:', typeof cartTotal);
  console.log('Discount amount:', discountAmount);
  console.log('Final total:', finalTotal);
  console.log('Cart items with prices:', cart.map(item => ({
    name: item.name,
    price: item.price,
    priceType: typeof item.price,
    quantity: item.quantity,
    quantityType: typeof item.quantity,
    total: item.price * item.quantity,
    totalType: typeof (item.price * item.quantity)
  })));

  const handleCheckout = async () => {
    if (cart.length === 0 || !user) return;

    setIsPlacingOrder(true);
    setError(null);

    try {
      console.log('User data:', user);
      console.log('User ID type:', typeof user.id, 'Value:', user.id);
      console.log('Cart data:', cart);
      
      // Validate user ID
      if (!user.id || user.id === '0' || Number(user.id) === 0) {
        throw new Error('Invalid user ID. Please log in again.');
      }
      
      // Create a minimal test order first
      const testOrderData: Omit<OrderDTO, 'id'> = {
        customerId: Number(user.id),
        customerName: user.name,
        total: finalTotal,
        status: 'PENDING',
        timestamp: new Date().toISOString(),
        type: orderType,
        tableNumber: orderType === 'DINE_IN' ? tableNumber : undefined,
        notes: notes.trim() || undefined,
        orderItems: cart.map(item => ({
          orderId: 0, // Will be set by backend when order is created
          menuItemId: Number(item.id),
          name: item.name,
          image: item.image && item.image.startsWith('http') ? item.image : 'https://via.placeholder.com/80x80?text=No+Image',
          price: item.price,
          quantity: item.quantity
        }))
      };

      console.log('Test order data structure:', {
        customerId: testOrderData.customerId,
        customerName: testOrderData.customerName,
        total: testOrderData.total,
        status: testOrderData.status,
        type: testOrderData.type,
        orderItemsCount: testOrderData.orderItems.length
      });

      // Create order data matching backend structure
      const orderData: Omit<OrderDTO, 'id'> = {
        customerId: Number(user.id),
        customerName: user.name,
        total: finalTotal,
        status: 'PENDING',
        timestamp: new Date().toISOString(),
        type: orderType,
        tableNumber: orderType === 'DINE_IN' ? tableNumber : undefined,
        notes: notes.trim() || undefined,
        orderItems: cart.map(item => ({
          menuItemId: Number(item.id),
          name: item.name,
          image: item.image || 'https://via.placeholder.com/80x80?text=No+Image',
          price: item.price,
          quantity: item.quantity
        }))
      };

      console.log('Creating order with backend structure...');

      console.log('Order data being sent:', JSON.stringify(orderData, null, 2));
      
      const createdOrder = await orderApiService.createOrder(orderData);
      console.log('✅ Order created successfully:', createdOrder);
      
      // Use discount if selected
      if (selectedDiscount && createdOrder.id) {
        try {
          await discountService.useDiscount(selectedDiscount.id, createdOrder.id.toString());
          console.log('✅ Discount applied successfully');
        } catch (error) {
          console.error('Failed to use discount:', error);
        }
      }
      
      clearCart();
      navigate('/orders');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to place order. Please try again.');
      console.error('Error placing order:', err);
    } finally {
      setIsPlacingOrder(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <ShoppingCart className="mx-auto h-16 w-16 text-gray-400 mb-4" />
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">Your cart is empty</h2>
            <p className="text-gray-600 mb-6">Add some delicious items from our menu!</p>
            <Link
              to="/menu"
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition-colors"
            >
              Browse Menu
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center mb-8">
          <Link
            to="/menu"
            className="mr-4 p-2 text-gray-600 hover:text-green-600 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
            <p className="text-gray-600">Review your sustainable meal selection</p>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-center gap-2">
            <AlertCircle className="w-4 h-4" />
            {error}
          </div>
        )}

        {/* Debug Info - Remove this after fixing */}
        <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-lg mb-6">
          <h3 className="font-semibold mb-2">Debug Info:</h3>
          <p>Cart Items: {cart.length}</p>
          <p>Cart Total: RS{safeCartTotal.toFixed(2)}</p>
          <p>Cart Total Type: {typeof safeCartTotal}</p>
          <p>Cart Items: {JSON.stringify(cart.map(item => ({ name: item.name, price: item.price, priceType: typeof item.price, quantity: item.quantity, quantityType: typeof item.quantity })))}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-green-100">
              <div className="divide-y divide-gray-200">
                {cart.length === 0 ? (
                  <div className="p-8 text-center">
                    <ShoppingCart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Your cart is empty</h3>
                    <p className="text-gray-600 mb-4">Add some delicious items from our menu to get started!</p>
                    <Link
                      to="/menu"
                      className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      Browse Menu
                    </Link>
                  </div>
                ) : (
                  cart.map(item => (
                  <div key={item.id} className="p-6 flex items-center space-x-4">
                                         <img
                       src={item.image && item.image.startsWith('http') ? item.image : 'https://via.placeholder.com/80x80?text=No+Image'}
                       alt={item.name}
                       className="h-16 w-16 object-cover rounded-lg shadow-sm"
                     />
                    
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900">{item.name}</h3>
                      <p className="text-gray-600 text-sm">{item.description}</p>
                      <div className="mt-1">
                        <span className="text-lg font-bold text-green-600">RS{item.price}</span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3 bg-gray-50 rounded-lg p-2">
                      <button
                        onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                        className="p-1 text-gray-400 hover:text-gray-600 hover:bg-white rounded transition-all"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      
                      <span className="text-lg font-semibold text-gray-900 w-8 text-center bg-white rounded px-2 py-1">
                        {item.quantity}
                      </span>
                      
                      <button
                        onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                        className="p-1 text-gray-400 hover:text-gray-600 hover:bg-white rounded transition-all"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="text-right">
                      <div className="text-lg font-bold text-gray-900">
                      RS{(item.price * item.quantity).toFixed(2)}
                      </div>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-red-500 hover:text-red-700 mt-1"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))
                )}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-green-100 p-6 sticky top-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Summary</h2>
              
              {/* Order Type Selection */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Order Type</label>
                <select
                  value={orderType}
                  onChange={(e) => setOrderType(e.target.value as 'DINE_IN' | 'TAKEAWAY' | 'DELIVERY')}
                  className="w-full border border-gray-300 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                >
                  <option value="DINE_IN">Dine In</option>
                  <option value="TAKEAWAY">Takeaway</option>
                  <option value="DELIVERY">Delivery</option>
                </select>
              </div>

              {/* Table Number for Dine In */}
              {orderType === 'DINE_IN' && (
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Table Number</label>
                  <input
                    type="number"
                    value={tableNumber || ''}
                    onChange={(e) => setTableNumber(e.target.value ? Number(e.target.value) : undefined)}
                    placeholder="Enter table number"
                    className="w-full border border-gray-300 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                </div>
              )}

              {/* Special Instructions */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Special Instructions</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Any special requests or dietary requirements..."
                  rows={3}
                  className="w-full border border-gray-300 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>

              {/* Available Discounts */}
              {availableDiscounts.length > 0 && (
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Available Discounts</label>
                  <div className="space-y-2">
                    {availableDiscounts.map(discount => (
                      <div key={discount.id} className="flex items-center space-x-2">
                        <input
                          type="radio"
                          id={discount.id}
                          name="discount"
                          checked={selectedDiscount?.id === discount.id}
                          onChange={() => setSelectedDiscount(discount)}
                          className="text-green-600 focus:ring-green-500"
                        />
                        <label htmlFor={discount.id} className="flex-1 text-sm text-gray-700 cursor-pointer">
                          <div className="flex items-center space-x-2">
                            <Gift className="h-4 w-4 text-green-600" />
                            <span>{discount.amount}% off - {discount.reason}</span>
                          </div>
                          <div className="text-xs text-gray-500">
                            Expires: {discount.expiresDate.toLocaleDateString()}
                          </div>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Price Breakdown */}
              <div className="space-y-2 mb-6">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Subtotal</span>
                  <span>RS{safeCartTotal.toFixed(2)}</span>
                </div>
                {selectedDiscount && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span>Discount ({selectedDiscount.amount}%)</span>
                    <span>-RS{discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Tax (10%)</span>
                  <span>RS{(finalTotal * 0.1).toFixed(2)}</span>
                </div>
                <div className="border-t pt-2">
                  <div className="flex justify-between text-lg font-bold text-gray-900">
                    <span>Total</span>
                    <span>RS{(finalTotal * 1.1).toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                onClick={handleCheckout}
                disabled={isPlacingOrder || cart.length === 0}
                className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-300 ${
                  isPlacingOrder || cart.length === 0
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-green-600 hover:bg-green-700 text-white transform hover:scale-105 shadow-lg'
                }`}
              >
                {isPlacingOrder ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Placing Order...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center space-x-2">
                    <CheckCircle className="h-4 w-4" />
                    <span>Place Order</span>
                  </div>
                )}
              </button>

              <p className="text-xs text-gray-500 mt-2 text-center">
                By placing this order, you agree to our terms and conditions
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};