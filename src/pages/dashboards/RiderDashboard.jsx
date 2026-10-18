import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';

export default function RiderDashboard() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetch(${import.meta.env.VITE_API_URL}/api/orders/assigned)
      .then(r=>r.json()).then(d=>setOrders(d.orders||[]));
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Rider Dashboard - {user?.name}</h1>
      <p className="text-gray-600">Deliveries assigned to you</p>
      <div className="mt-6 grid gap-4">
        {orders.map(o=>(
          <div key={o.id} className="border p-4 rounded">
            <p>Order #{o.id} - {o.status}</p>
            <p>Customer: {o.customer_name} - {o.delivery_address}</p>
            <button className="mt-2 bg-green-600 text-white px-4 py-1 rounded">Mark Delivered</button>
          </div>
        ))}
        {orders.length===0 && <p>No deliveries assigned</p>}
      </div>
    </div>
  );
}
