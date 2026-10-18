import { useState, useEffect } from 'react';
export default function AdminDashboard() {
  const [stats, setStats] = useState({users:0,orders:0,products:0});
  useEffect(()=>{
    fetch(${import.meta.env.VITE_API_URL}/api/admin/stats)
      .then(r=>r.json()).then(setStats).catch(()=>{});
  },[]);
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>
      <div className="mt-6 grid grid-cols-3 gap-4">
        <div className="border p-4 rounded"><p>Users</p><p className="text-2xl">{stats.users}</p></div>
        <div className="border p-4 rounded"><p>Orders</p><p className="text-2xl">{stats.orders}</p></div>
        <div className="border p-4 rounded"><p>Products</p><p className="text-2xl">{stats.products}</p></div>
      </div>
      <div className="mt-6">
        <a href="/admin/users" className="mr-4 text-blue-600">Manage Users</a>
        <a href="/admin/products" className="mr-4 text-blue-600">Manage Products</a>
        <a href="/admin/orders" className="text-blue-600">All Orders</a>
      </div>
    </div>
  );
}
