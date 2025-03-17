import React, { ReactNode } from 'react';
import Sidebar from './sidebar';

interface AdminLayoutProps {
  children: ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 p-6 overflow-hidden">
        {children}
      </div>
    </div>
  );
};

export default AdminLayout;