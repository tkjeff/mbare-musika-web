import { useState, useEffect, useRef } from 'react';

export default function RiderDashboard() {
  const [deliveries, setDeliveries] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [earnings, setEarnings] = useState({ today: 0, week: 0, total: 0, count: 0 });
  const [subscription, setSubscription] = useState({ freeUsed: 0, needsPayment: false });
  const [newOffer, setNewOffer] = useState(null);
  const [filter, setFilter] = useState('pending');
  const API = import.meta.env.VITE_API_URL || 'https://mbare-musika-api-9ogk.onrender.com';

  // Poll for new delivery offers every 10s
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token') || localStorage.getItem('mbare_musika_token');
        const headers = { Authorization: Bearer  };
        const [dRes, eRes] = await Promise.all([
          fetch(${API}/api/rider/deliveries, { headers }).then(r=>r.json()).catch(()=>({deliveries:[]})),
          fetch(${API}/api/rider/earnings, { headers }).then(r=>r.json()).catch(()=>({})),
        ]);
        if (dRes.deliveries) setDeliveries(dRes.deliveries);
        if (dRes.newOffer) { setNewOffer(dRes.newOffer); new Audio('/notification.mp3').play().catch(()=>{}); }
        if (eRes.earnings) setEarnings(eRes.earnings);
        if (eRes.subscription) setSubscription(eRes.subscription);
      } catch {}
    };
    fetchData();
    const id = setInterval(fetchData, 10000);
    return () => clearInterval(id);
  }, []);

  const acceptDelivery = async (id) => {
    const token = localStorage.getItem('token') || localStorage.getItem('mbare_musika_token');
    await fetch(${API}/api/rider/deliveries//accept, { method: 'POST', headers: { Authorization: Bearer  }});
    setNewOffer(null);
    setDeliveries(prev => prev.map(d => d.id===id ? {...d, status:'ACCEPTED'} : d));
  };

  const markDelivered = async (id) => {
    const token = localStorage.getItem('token') || localStorage.getItem('mbare_musika_token');
    await fetch(${API}/api/rider/deliveries//deliver, { method: 'POST', headers: { Authorization: Bearer  }});
    setDeliveries(prev => prev.map(d => d.id===id ? {...d, status:'DELIVERED'} : d));
  };

  const filtered = deliveries.filter(d => filter==='all' ? true : d.status.toLowerCase()===filter);

  return (
    <div className="min-h-screen bg-[#f8f6f1] p-4">
      {/* NEW OFFER POPUP */}
      {newOffer && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl animate-bounce">
            <h2 className="text-xl font-bold text-green-700">?? New Delivery Offer!</h2>
            <p className="mt-2"><b>From:</b> {newOffer.seller_name} (Mbare Stall {newOffer.stall_no})</p>
            <p><b>To:</b> {newOffer.customer_address}</p>
            <p><b>Fee Offered:</b> <span className="text-green-600 font-bold">\ USD</span></p>
            <p><b>Distance:</b> {newOffer.distance_km} km | <b>ETA:</b> {newOffer.eta_min} min</p>
            <div className="flex gap-3 mt-4">
              <button onClick={()=>acceptDelivery(newOffer.id)} className="flex-1 bg-green-600 text-white py-2 rounded-lg">Accept \</button>
              <button onClick={()=>setNewOffer(null)} className="flex-1 bg-gray-200 py-2 rounded-lg">Decline</button>
            </div>
          </div>
        </div>
      )}

      {/* TOP STATS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-xl shadow"><p className="text-sm text-gray-500">Today Earnings</p><p className="text-2xl font-bold text-green-700">\</p></div>
        <div className="bg-white p-4 rounded-xl shadow"><p className="text-sm text-gray-500">Deliveries</p><p className="text-2xl font-bold">{earnings.count}/3 free</p>{subscription.needsPayment && <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded">\/month required</span>}</div>
        <div className="bg-white p-4 rounded-xl shadow"><p className="text-sm text-gray-500">Pending</p><p className="text-2xl font-bold">{deliveries.filter(d=>d.status==='PENDING').length}</p></div>
        <div className="bg-white p-4 rounded-xl shadow"><p className="text-sm text-gray-500">Total Earned</p><p className="text-2xl font-bold">\</p></div>
      </div>

      {/* FILTER + MAP + LIST */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="flex gap-2">
            {['pending','accepted','delivered','all'].map(f=>(
              <button key={f} onClick={()=>setFilter(f)} className={px-4 py-2 rounded-full capitalize }>{f}</button>
            ))}
          </div>

          {filtered.map(d=>(
            <div key={d.id} className="bg-white rounded-xl shadow p-4">
              <div className="flex justify-between">
                <div>
                  <p className="font-bold">Order #{d.order_id} - {d.status}</p>
                  <p className="text-sm text-gray-600">Pickup: {d.pickup_address} ? Drop: {d.dropoff_address}</p>
                  <p className="text-sm">Customer: {d.customer_name} | {d.customer_phone} | Fee: <b className="text-green-600">\</b></p>
                  <p className="text-xs text-gray-500">ETA: {d.eta_min} min | Distance: {d.distance_km} km | Created: {new Date(d.created_at).toLocaleTimeString()}</p>
                </div>
                <div className="flex flex-col gap-2">
                  {d.status==='PENDING' && <button onClick={()=>acceptDelivery(d.id)} className="bg-green-600 text-white px-3 py-1 rounded text-sm">Accept</button>}
                  {d.status==='ACCEPTED' && <button onClick={()=>markDelivered(d.id)} className="bg-blue-600 text-white px-3 py-1 rounded text-sm">Mark Delivered</button>}
                  <button onClick={()=>setActiveChat(activeChat===d.id?null:d.id)} className="bg-gray-100 px-3 py-1 rounded text-sm">?? Chat</button>
                </div>
              </div>

              {/* MAP - OpenStreetMap iframe */}
              <div className="mt-3 h-48 bg-gray-100 rounded overflow-hidden">
                <iframe width="100%" height="100%" frameBorder="0" src={https://www.openstreetmap.org/export/embed.html?bbox=%2C%2C%2C&layer=mapnik&marker=%2C&marker=%2C} title="delivery map"></iframe>
              </div>

              {/* CHAT DROPDOWN */}
              {activeChat===d.id && (
                <div className="mt-3 border rounded p-3 bg-gray-50">
                  <p className="text-sm font-bold">Chat with {d.customer_name}</p>
                  <div className="h-24 overflow-y-auto bg-white p-2 rounded text-sm my-2">
                    <p><b>Customer:</b> I'm at gate 2, blue house</p>
                    <p><b>You:</b> On my way, 10 min</p>
                  </div>
                  <div className="flex gap-2">
                    <input placeholder="Type message..." className="flex-1 border rounded px-2 py-1 text-sm" />
                    <button className="bg-black text-white px-3 py-1 rounded text-sm">Send</button>
                    <a href={	el:} className="bg-green-600 text-white px-3 py-1 rounded text-sm">Call</a>
                  </div>
                </div>
              )}
            </div>
          ))}
          {filtered.length===0 && <div className="bg-white p-8 rounded-xl text-center text-gray-500">No {filter} deliveries. Waiting for seller+customer deals...</div>}
        </div>

        {/* RIGHT SIDEBAR - Money + Subscription */}
        <div className="space-y-4">
          <div className="bg-black text-white p-4 rounded-xl">
            <p className="text-sm opacity-70">Money Generated</p>
            <p className="text-3xl font-bold">\ USD</p>
            <p className="text-xs mt-2 opacity-60">{earnings.count} deliveries completed this month</p>
            {earnings.count>=3 && (
              <div className="mt-3 bg-white/10 p-3 rounded">
                <p className="text-sm">After 3 free deliveries, platform charges \/month</p>
                <button className="mt-2 w-full bg-white text-black py-2 rounded">Pay \ to Continue Riding</button>
              </div>
            )}
          </div>
          <div className="bg-white p-4 rounded-xl">
            <p className="font-bold">How it works</p>
            <ul className="text-sm text-gray-600 mt-2 space-y-1 list-disc ml-4">
              <li>Seller + Customer secure deal ? delivery pops up here with fee offer</li>
              <li>Accept ? see map + customer chat + ETA</li>
              <li>Deliver ? earnings added, customer confirms</li>
              <li>3 free/month, then \ subscription</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
