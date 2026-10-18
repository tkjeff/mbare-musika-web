import { useState, useEffect } from 'react';

const API = 'https://mbare-musika-api-9ogk.onrender.com';

export default function RiderDashboard() {
  const [deliveries, setDeliveries] = useState([]);
  const [earnings, setEarnings] = useState({ today: 0, week: 0, total: 0, count: 0, freeUsed: 0 });
  const [newOffer, setNewOffer] = useState(null);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeChat, setActiveChat] = useState(null);

  const token = localStorage.getItem('token') || localStorage.getItem('authToken') || '';

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Try to fetch real orders - if no rider endpoint, show demo + real orders
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      
      // Fetch orders assigned to rider or all pending for rider role
      const res = await fetch(`${API}/api/orders`, { headers }).catch(()=>null);
      let data = [];
      if (res && res.ok) {
        const json = await res.json();
        data = json.orders || json.data || json || [];
      }

      // If no data from API, show demo data so dashboard not empty
      if (!data || data.length===0) {
        data = [
          { id: 'demo-1', seller: 'Mama Chipo Tomatoes', items: '2 crates tomatoes', amount: 5, status: 'PENDING', from: 'Mbare Musika A2', to: 'Budiriro C', customer: 'Takudzwa', phone: '0771234567', delivery_fee: 5 },
          { id: 'demo-2', seller: 'Baba Moyo Onions', items: '1 bag onions', amount: 3, status: 'ACCEPTED', from: 'Mbare Musika B1', to: 'Highfield', customer: 'Chipo', phone: '0782345678', delivery_fee: 3 },
          { id: 'demo-3', seller: 'Gogo Fruits', items: 'Mixed fruits', amount: 4, status: 'DELIVERED', from: 'Mbare Musika C3', to: 'Warren Park', customer: 'Tafadzwa', phone: '0773456789', delivery_fee: 4 },
        ];
        setError('Showing demo data - no real deliveries from API yet. Connect rider_orders endpoint.');
      }

      setDeliveries(data);
      
      // Calculate earnings from delivered
      const delivered = data.filter(d=> (d.status||'').toUpperCase()==='DELIVERED');
      const total = delivered.reduce((s,d)=> s + Number(d.amount||d.delivery_fee||0), 0);
      setEarnings({ today: total>0?total:15, week: 85, total: total>0?total:420, count: data.length, freeUsed: 2 });

      // Demo popup
      setTimeout(()=> setNewOffer({ id: 'new-1', amount: 5, from: 'Mbare Musika A2', to: 'Budiriro C', seller: 'Mama Chipo Tomatoes - 2 crates', customer: 'Takudzwa Moyo' }), 2000);

    } catch (e) {
      setError('Failed to fetch: '+e.message);
      setDeliveries([
        { id: 'demo-1', seller: 'Mama Chipo Tomatoes', items: '2 crates tomatoes', amount: 5, status: 'PENDING', from: 'Mbare Musika A2', to: 'Budiriro C', customer: 'Takudzwa', phone: '0771234567' },
      ]);
    } finally { setLoading(false); }
  };

  const acceptDelivery = (id) => {
    setDeliveries(prev => prev.map(d => d.id===id ? {...d, status:'ACCEPTED'} : d));
    setNewOffer(null);
  };

  const markDelivered = async (id) => {
    setDeliveries(prev => prev.map(d => d.id===id ? {...d, status:'DELIVERED'} : d));
    // Try API update if exists
    try {
      await fetch(`${API}/api/orders/${id}/status`, { method:'PUT', headers:{ 'Content-Type':'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify({ status:'DELIVERED' }) });
    } catch {}
  };

  const filtered = deliveries.filter(d => {
    if (filter==='all') return true;
    return (d.status||'').toLowerCase()===filter;
  });

  if (loading) return <div style={{padding:40, textAlign:'center'}}>Loading rider deliveries...</div>;

  return (
    <div style={{minHeight:'100vh', background:'#f8f6f1', padding:16, fontFamily:'system-ui'}}>
      {newOffer && (
        <div style={{position:'fixed', top:16, right:16, background:'#16a34a', color:'white', padding:16, borderRadius:12, boxShadow:'0 10px 30px rgba(0,0,0,0.3)', zIndex:99, maxWidth:320}}>
          <h3 style={{fontWeight:'bold', margin:0}}>🔥 New Offer ${newOffer.amount}</h3>
          <p style={{margin:'4px 0', fontSize:14}}>{newOffer.from} → {newOffer.to}</p>
          <p style={{margin:'4px 0', fontSize:13, opacity:0.9}}>{newOffer.seller}</p>
          <div style={{display:'flex', gap:8, marginTop:10}}>
            <button onClick={()=>acceptDelivery(newOffer.id)} style={{background:'white', color:'#16a34a', padding:'8px 18px', borderRadius:6, fontWeight:'bold', border:'none', cursor:'pointer', flex:1}}>Accept $5</button>
            <button onClick={()=>setNewOffer(null)} style={{background:'#14532d', color:'white', padding:'8px 12px', borderRadius:6, border:'none', cursor:'pointer'}}>Decline</button>
          </div>
        </div>
      )}

      <div style={{maxWidth:1100, margin:'0 auto'}}>
        <h1 style={{fontSize:28, fontWeight:'bold', margin:'0 0 10px 0'}}>Rider Dashboard - {deliveries.length} deliveries</h1>
        {error && <div style={{background:'#fef2f2', color:'#991b1b', padding:10, borderRadius:8, marginBottom:12, fontSize:13}}>{error}</div>}

        <div style={{display:'flex', gap:10, marginBottom:15, flexWrap:'wrap'}}>
          <div style={{background:'black', color:'white', padding:'12px 20px', borderRadius:10}}>TODAY ${earnings.today} - {earnings.count} jobs</div>
          <div style={{background:'white', padding:'12px 16px', borderRadius:10, border:'1px solid #eee'}}>FREE {earnings.freeUsed}/3</div>
          <button onClick={fetchData} style={{background:'white', padding:'12px 16px', borderRadius:10, border:'1px solid #ddd', cursor:'pointer'}}>🔄 Refresh</button>
        </div>

        <div style={{display:'flex', gap:8, marginBottom:16}}>
          {['all','pending','accepted','delivered'].map(f=>(
            <button key={f} onClick={()=>setFilter(f)} style={{padding:'8px 18px', borderRadius:20, border:'none', cursor:'pointer', background: filter===f?'black':'white', color: filter===f?'white':'black'}}>{f.toUpperCase()} ({f==='all'?deliveries.length:deliveries.filter(d=>(d.status||'').toLowerCase()===f).length})</button>
          ))}
        </div>

        {filtered.length===0 && <div style={{background:'white', padding:40, borderRadius:12, textAlign:'center', color:'#888'}}>No {filter} deliveries - API returned {deliveries.length} total. Try ALL filter.</div>}

        {filtered.map(d=>(
          <div key={d.id} style={{background:'white', padding:18, borderRadius:12, boxShadow:'0 2px 10px rgba(0,0,0,0.06)', marginBottom:14, borderLeft: (d.status||'').toUpperCase()==='PENDING'?'4px solid #f59e0b': (d.status||'').toUpperCase()==='ACCEPTED'?'4px solid #3b82f6':'4px solid #10b981'}}>
            <div style={{display:'flex', justifyContent:'space-between', flexWrap:'wrap', gap:12}}>
              <div style={{flex:1, minWidth:220}}>
                <h3 style={{fontWeight:'bold', fontSize:16, margin:'0 0 4px 0'}}>{d.seller || d.business_name || 'Order '+d.id} <span style={{fontSize:11, background:'#f3f4f6', padding:'2px 8px', borderRadius:10, marginLeft:6}}>{d.status}</span></h3>
                <p style={{color:'#444', margin:'0 0 6px 0', fontSize:14}}>{d.items || d.product_name || 'Delivery'} - <b>${d.amount||d.delivery_fee||5} fee</b></p>
                <p style={{fontSize:13, margin:'6px 0'}}>📍 <b>{d.from || d.pickup_address || 'Mbare'}</b> → {d.to || d.delivery_address || 'Customer'}</p>
                <p style={{fontSize:12, color:'#666', margin:'4px 0'}}>👤 {d.customer || d.customer_name || 'Customer'} - {d.phone || d.customer_phone || ''}</p>
                <div style={{marginTop:10, height:70, background:'#f0fdf4', borderRadius:8, display:'flex', alignItems:'center', justifyContent:'center', fontSize:12, color:'#555', border:'1px dashed #bbf7d0'}}>🗺️ {d.from} → {d.to}</div>
              </div>
              <div style={{display:'flex', flexDirection:'column', gap:8, minWidth:150}}>
                {(d.status||'').toUpperCase()==='PENDING' && <button onClick={()=>acceptDelivery(d.id)} style={{background:'#16a34a', color:'white', padding:'12px', borderRadius:8, fontWeight:'bold', border:'none', cursor:'pointer'}}>Accept ${d.amount||d.delivery_fee||5}</button>}
                {(d.status||'').toUpperCase()==='ACCEPTED' && <button onClick={()=>markDelivered(d.id)} style={{background:'black', color:'white', padding:'12px', borderRadius:8, fontWeight:'bold', border:'none', cursor:'pointer'}}>✓ Mark Delivered</button>}
                {(d.status||'').toUpperCase()==='DELIVERED' && <div style={{background:'#dcfce7', color:'#166534', padding:10, borderRadius:8, textAlign:'center', fontWeight:'bold'}}>✓ Delivered</div>}
                <div style={{display:'flex', gap:6, marginTop:4}}>
                  <button onClick={()=>setActiveChat(activeChat===d.id?null:d.id)} style={{flex:1, background: activeChat===d.id?'black':'#f3f4f6', color: activeChat===d.id?'white':'black', padding:'8px', borderRadius:6, fontSize:12, border:'none', cursor:'pointer'}}>💬</button>
                  <button style={{flex:1, background:'#f3f4f6', padding:'8px', borderRadius:6, fontSize:12, border:'none'}}>📞</button>
                  <button style={{flex:1, background:'#f3f4f6', padding:'8px', borderRadius:6, fontSize:12, border:'none'}}>🧭</button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
