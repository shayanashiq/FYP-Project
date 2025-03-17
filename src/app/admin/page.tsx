// src/app/admin/page.tsx
import SearchBar from '../../../modules/admin/components/searchbar';

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Dashboard</h1>
      </div>
      
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="p-6 bg-white rounded-lg shadow">
          <h2 className="text-lg font-medium">Total Products</h2>
          <p className="text-3xl font-bold mt-2">120</p>
        </div>
        <div className="p-6 bg-white rounded-lg shadow">
          <h2 className="text-lg font-medium">Total Orders</h2>
          <p className="text-3xl font-bold mt-2">52</p>
        </div>
        <div className="p-6 bg-white rounded-lg shadow">
          <h2 className="text-lg font-medium">Total Revenue</h2>
          <p className="text-3xl font-bold mt-2">$12,456</p>
        </div>
      </div>
      
      <p className="text-gray-600">Welcome to your ecommerce admin dashboard. Manage your products, orders, and more from here.</p>
    </div>
  );
}