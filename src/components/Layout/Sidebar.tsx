import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import {
  Home,
  Utensils,
  Calendar,
  Package,
  Camera,
  BarChart3,
  TrendingUp,
  Settings,
  Menu,
  X,
  Sparkles,
  LogOut,
  User,
  Award,
  ShoppingCart
} from 'lucide-react';

interface SidebarProps {
  onCollapseChange?: (collapsed: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onCollapseChange }) => {
  const { user, logout } = useAuth();
  const { cart } = useApp();
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const handleCollapseToggle = () => {
    const newCollapsed = !isCollapsed;
    setIsCollapsed(newCollapsed);
    onCollapseChange?.(newCollapsed);
  };

  // For non-authenticated users, show a simple header
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
                className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
              >
                Login
              </Link>
              <Link
                to="/SignupData"
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium"
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
    { name: 'Home', href: '/', icon: Home },
    { name: 'Menu', href: '/menu', icon: Utensils },
    { name: 'Cart', href: '/cart', icon: ShoppingCart },
    { name: 'Reservations', href: '/reservations', icon: Calendar },
    { name: 'Orders', href: '/orders', icon: Package },
    { name: 'Waste Scanner', href: '/waste-scanner', icon: Camera }
  ];

  const adminNav = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: BarChart3 },
    { name: 'Menu Management', href: '/admin/menu', icon: Utensils },
    { name: 'Orders', href: '/admin/orders', icon: Package },
    { name: 'Reservations', href: '/admin/reservations', icon: Calendar },
    { name: 'Inventory', href: '/admin/inventory', icon: Package },
    { name: 'Analytics', href: '/admin/analytics', icon: TrendingUp },
    { name: 'Settings', href: '/admin/settings', icon: Settings }
  ];

  const navigation = user.role === 'admin' ? adminNav : customerNav;

  const isActive = (href: string) => {
    if (href === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(href);
  };

  return (
    <>
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="p-2.5 bg-white rounded-xl shadow-xl border border-gray-200 hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
        >
          {isMobileOpen ? <X className="h-5 w-5 text-gray-700" /> : <Menu className="h-5 w-5 text-gray-700" />}
        </button>
      </div>

      {/* Sidebar */}
      <div className={`
        fixed top-0 left-0 h-full bg-white/95 backdrop-blur-md shadow-xl border-r border-gray-200/50 z-40 transition-all duration-300 ease-in-out
        ${isCollapsed ? 'w-16' : 'w-64'}
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Logo */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200/50 bg-gradient-to-r from-green-50/50 to-blue-50/50">
          {!isCollapsed && (
            <Link to="/" className="flex items-center space-x-2 group">
              <div className="relative">
                <Utensils className="h-7 w-7 text-green-600 group-hover:scale-110 transition-transform duration-200" />
                <div className="absolute -inset-1 bg-green-200 rounded-full blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
              </div>
              <div>
                <span className="text-lg font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">Green Dine</span>
                <div className="flex items-center space-x-1">
                  <Sparkles className="h-2.5 w-2.5 text-yellow-500" />
                  <span className="text-xs text-gray-500">Sustainable</span>
                </div>
              </div>
            </Link>
          )}
          {isCollapsed && (
            <Link to="/" className="flex justify-center group">
              <div className="relative">
                <Utensils className="h-7 w-7 text-green-600 group-hover:scale-110 transition-transform duration-200" />
                <div className="absolute -inset-1 bg-green-200 rounded-full blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
              </div>
            </Link>
          )}
          <button
            onClick={handleCollapseToggle}
            className="hidden lg:block p-1.5 rounded-lg hover:bg-gray-100 hover:shadow-md transition-all duration-200 transform hover:scale-105"
          >
            <Menu className="h-4 w-4 text-gray-600" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {navigation.map((item, index) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`
                  group flex items-center space-x-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 transform hover:scale-102
                  ${active 
                    ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg' 
                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                  }
                `}
                onClick={() => setIsMobileOpen(false)}
              >
                <div className={`relative ${active ? 'text-white' : 'text-gray-500 group-hover:text-gray-700'}`}>
                  <Icon className="h-5 w-5" />
                  {active && (
                    <div className="absolute -inset-1 bg-white rounded-full blur-sm opacity-20"></div>
                  )}
                  {/* Cart badge */}
                  {item.name === 'Cart' && cart.length > 0 && (
                    <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {cart.length}
                    </div>
                  )}
                </div>
                {!isCollapsed && (
                  <span className="flex-1">{item.name}</span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* User Profile Section */}
        {!isCollapsed && (
          <div className="p-4 border-t border-gray-200/50">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center">
                <User className="h-4 w-4 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {user.name || user.email}
                </p>
                <p className="text-xs text-gray-500 capitalize">
                  {user.role}
                </p>
              </div>
            </div>
            <button
              onClick={logout}
              className="w-full flex items-center justify-center space-x-2 px-3 py-2 text-sm font-medium text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </button>
          </div>
        )}

        {/* Collapsed User Profile */}
        {isCollapsed && (
          <div className="p-4 border-t border-gray-200/50">
            <button
              onClick={logout}
              className="w-full flex justify-center p-2 text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
              title="Logout"
            >
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        )}
      </div>

      {/* Mobile overlay */}
      {isMobileOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setIsMobileOpen(false)}
        />
      )}
    </>
  );
};
