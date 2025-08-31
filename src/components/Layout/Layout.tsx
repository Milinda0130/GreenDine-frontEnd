import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Footer } from './Footer';
import { useAuth } from '../../context/AuthContext';

interface LayoutProps {
  children: React.ReactNode;
  showFooter?: boolean;
}

export const Layout: React.FC<LayoutProps> = ({ children, showFooter = true }) => {
  const { user } = useAuth();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // For non-authenticated users (login, signup, landing), don't show sidebar
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Sidebar />
        <main className="min-h-screen">
          {children}
        </main>
        {showFooter && <Footer />}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-green-50">
      <Sidebar onCollapseChange={setIsSidebarCollapsed} />
      <main className={`transition-all duration-300 ease-in-out ${
        isSidebarCollapsed ? 'lg:ml-16' : 'lg:ml-64'
      } ml-0`}>
        <div className="min-h-screen">
          {children}
        </div>
        {showFooter && <Footer />}
      </main>
    </div>
  );
};
