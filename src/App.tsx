import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AppProvider } from './context/AppContext';
import { Layout } from './components/Layout/Layout';

import { LandingPage } from './components/Home/LandingPage';
import { LoginForm } from './components/Auth/LoginForm';
import { Signup  } from './components/Auth/Signup';
import { MenuPage } from './components/Customer/MenuPage';
import { CartPage } from './components/Customer/CartPage';
import { WasteScannerPage } from './components/Customer/WasteScannerPage';
import { ReservationsPage } from './components/Customer/ReservationsPage';
import OrdersPage from './components/Customer/OrdersPage';

import { AdminDashboard } from './components/Admin/AdminDashboard';
import { AdminOrdersPage } from './components/Admin/AdminOrdersPage';
import OrderManagementPage from './components/Admin/OrderManagementPage';
import MenuManagementPage from './components/Admin/MenuManagementPage';
import { ReservationManagementPage } from './components/Admin/ReservationManagementPage';
import { InventoryManagementPage } from './components/Admin/InventoryManagementPage';
import { AnalyticsPage } from './components/Admin/AnalyticsPage';

// Protected Route component
const ProtectedRoute: React.FC<{
  children: React.ReactNode;
  requiredRole?: 'customer' | 'admin'
}> = ({ children, requiredRole }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/" />;
  }

  return <>{children}</>;
};

const AppContent: React.FC = () => {
  const { isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/SignupData" element={<Signup />} />
       

        {/* Customer Routes */}
        <Route
          path="/menu"
          element={
            <ProtectedRoute requiredRole="customer">
              <MenuPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/cart"
          element={
            <ProtectedRoute requiredRole="customer">
              <CartPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/waste-scanner"
          element={
            <ProtectedRoute requiredRole="customer">
              <WasteScannerPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/reservations"
          element={
            <ProtectedRoute requiredRole="customer">
              <ReservationsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/orders"
          element={
            <ProtectedRoute requiredRole="customer">
              <OrdersPage />
            </ProtectedRoute>
          }
        />


        {/* Admin Routes */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/orders"
          element={
            <ProtectedRoute requiredRole="admin">
              <OrderManagementPage />
            </ProtectedRoute>
          }
        />

        {/* Admin Management Routes */}
        <Route
          path="/admin/menu"
          element={
            <ProtectedRoute requiredRole="admin">
              <MenuManagementPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/reservations"
          element={
            <ProtectedRoute requiredRole="admin">
              <ReservationManagementPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/inventory"
          element={
            <ProtectedRoute requiredRole="admin">
              <InventoryManagementPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/analytics"
          element={
            <ProtectedRoute requiredRole="admin">
              <AnalyticsPage />
            </ProtectedRoute>
          }
        />

        {/* Catch all route */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Layout>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppProvider>
          <AppContent />
        </AppProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;