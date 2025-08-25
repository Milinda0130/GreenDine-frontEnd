import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  User, 
  ShoppingCart, 
  LogOut, 
  Calendar, 
  BarChart3, 
  Package,
  Utensils,
  Camera,
  Award
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';

export const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const { cart } = useApp();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!user) {
    return (
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center space-x-2">
              <Utensils className="h-8 w-8 text-green-600" />
              <span className="text-xl font-bold text-gray-900">Green Dine</span>
            </Link>
            <div className="flex items-center space-x-4">
              <Link
                to="/login"
                className="text-gray-700 hover:text-green-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Login
              </Link>
              <Link
                to="/SignupData"
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </header>
    );
  }

  const customerNav = [
    { name: 'Menu', href: '/menu', icon: Utensils },
    { name: 'Reservations', href: '/reservations', icon: Calendar },
    { name: 'Orders', href: '/orders', icon: Package },
    { name: 'Waste Scanner', href: '/waste-scanner', icon: Camera },
    { name: 'Rewards', href: '/rewards', icon: Award }
  ];

  const adminNav = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: BarChart3 },
    { name: 'Menu Management', href: '/admin/menu', icon: Utensils },
    { name: 'Orders', href: '/admin/orders', icon: Package },
    { name: 'Reservations', href: '/admin/reservations', icon: Calendar },
    { name: 'Inventory', href: '/admin/inventory', icon: Package },
    { name: 'Analytics', href: '/admin/analytics', icon: BarChart3 }
  ];

  const navigation = user.role === 'admin' ? adminNav : customerNav;

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <Utensils className="h-8 w-8 text-green-600" /> 
            <span className="text-xl font-bold text-gray-900">Green Dine</span>
          </Link>

          <nav className="hidden md:flex space-x-8">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className="flex items-center space-x-1 text-gray-700 hover:text-green-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center space-x-4">
           
            <Link
              to="/SignupData"
              className="hidden sm:inline-block bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Sign Up
            </Link>
            {user.role === 'customer' && (
              <Link
                to="/cart"
                className="relative p-2 text-gray-600 hover:text-green-600 transition-colors"
              >
                <ShoppingCart className="h-6 w-6" />
                {cart.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-green-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cart.reduce((total, item) => total + item.quantity, 0)}
                  </span>
                )}
              </Link>
            )}

            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <User className="h-5 w-5 text-gray-400" />
                <div className="text-sm">
                  <div className="font-medium text-gray-700">{user.name}</div>
                  <div className="text-gray-500 capitalize">{user.role}</div>
                </div>
              </div>
              {user.role === 'customer' && user.points !== undefined && (
                <div className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                  {user.points} pts
                </div>
              )}
            </div>

            <button
              onClick={handleLogout}
              className="p-2 text-gray-600 hover:text-red-600 transition-colors"
              title="Logout"
            >
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile navigation */}
      <div className="md:hidden border-t border-gray-200">
        <nav className="px-4 py-2 space-y-1">
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                to={item.href}
                className="flex items-center space-x-2 text-gray-700 hover:text-green-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                <Icon className="h-4 w-4" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
};