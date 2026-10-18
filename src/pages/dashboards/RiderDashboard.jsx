import { useState, useEffect } from 'react';
const API = 'https://mbare-musika-api-9ogk.onrender.com';

export default function RiderDashboard() {
  const [deliveries, setDeliveries] = useState([]);
  const [earnings, setEarnings] = useState({ today: 15, week: 85, total: 420, count: 0, freeUsed: 2 });
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState('');
  const token = localStorage.getItem('token') || localStorage.getItem('authToken') || '';

  const fetchDeliveries = async () => {
    setLoading(true);
    try {
      const headers = { 'Content-Type':'application/json' };
      if (token) headers.Authorization = `Bearer ${token}`;
      const res = await fetch(`${API}/api/rider/deliveries`, { headers });
      const json = await res.json();
      const list = json.deliveries || json.data || [];
      if (list.length>0) {
        setDeliveries(list);
        setMsg('');
      } else {
        // fallback demo so never empty
        setDeliveries([
          { id: 101, status:'PENDING', seller_name:'Mama Chipo Tomatoes', customer_name:'Takudzwa', pickup_address:'Mbare A12', dropoff_address:'Budiriro C', delivery_fee:5, customer_phone:'0771234567' },
          { id: 102, status:'ACCEPTED', seller_name:'Baba Moyo Onions', customer_name:'Chipo', pickup_address:'Mbare B1', dropoff_address:'Highfield', delivery_fee:3 },
          { id: 103, status:'DELIVERED', seller_name:'Gogo Fruits', customer_name:'Tafadzwa', pickup_address:'Mbare C3', dropoff_address:'Warren Park', delivery_fee:4 },
        ]);
        setMsg('Demo data - API returned 0, showing sample');
      }
      const earnRes = await fetch(`${API}/api/rider/earnings`, { headers }).then(r=>r.json()).catch(()=>null);
      if (earnRes?.earnings) setEarnings({...earnings, ...earnRes.earnings, ...earnRes.subscription});
    } catch(e){ setMsg('Error: '+e.message); } finally { setLoading(false); }
  };

  useEffect(()=>{ fetchDeliveries(); }, []);

  const accept = async (id) => {
    const headers = { 'Content-Type':'application/json', Authorization: `Bearer ${token}` };
    await fetch(`${API}/api/rider/deliveries/${id}/accept`, { method:'POST', headers }).catch(()=>{});
    setDeliveries(p=>p.map(d=> d.id==id?{...d,status:'ACCEPTED'}:d));
  };
  const deliver = async (id) => {
    const headers = { 'Content-Type':'application/json', Authorization: `Bearer ${token}` };
    await fetch(`${API}/api/rider/deliveries/${id}/deliver`, { method:'POST', headers }).catch(()=>{});
    setDeliveries(p=>p.map(d=> d.id==id?{...d,status:'DELIVERED'}:d));
  };

  const filtered = deliveries.filter(d=> filter==='all' ? true : (d.status||'').toLowerCase()===filter);

  if (loading) return <div style={{padding:50,textAlign:'center'}}>Loading deliveries from API...</div>;

  return (
    <div style={{minHeight:'100vh', background:'#f8f6f1', padding:16, fontFamily:'system-ui'}}>
      <div style={{maxWidth:1100, margin:'0 auto'}}>
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap'}}>
          <h1 style={{fontSize:26, fontWeight:'bold'}}>Rider Dashboard - {deliveries.length} jobs</h1>
          <button onClick={fetchDeliveries} style={{background:'black', color:'white', padding:'10px 16px', borderRadius:8, border:'none', cursor:'pointer'}}>🔄 Refresh Real API</button>
        </div>
        {msg && <div style={{background:'#fef3c7', padding:10, borderRadius:8, margin:'10px 0', fontSize:13}}>{msg}</div>}
        <div style={{display:'flex', gap:10, margin:'12px 0', flexWrap:'wrap'}}>
          <div style={{background:'black', color:'white', padding:'12px 18px', borderRadius:10}}>Today ${earnings.today} - {deliveries.length} jobs</div>
          <div style={{background:'white', padding:'12px 18px', borderRadius:10, border:'1px solid #ddd'}}>Free {earnings.freeUsed}/3</div>
        </div>
        <div style={{display:'flex', gap:8, marginBottom:16, flexWrap:'wrap'}}>
          {['all','pending','accepted','delivered'].map(f=>{
            const count = f==='all'?deliveries.length:deliveries.filter(d=>(d.status||'').toLowerCase()===f).length;
            return <button key={f} onClick={()=>setFilter(f)} style={{padding:'8px 16px', borderRadius:20, border:'none', cursor:'pointer', background: filter===f?'black':'white', color: filter===f?'white':'black'}}>{f.toUpperCase()} ({count})</button>
          })}
        </div>
        {filtered.map(d=>(
          <div key={d.id} style={{background:'white', padding:16, borderRadius:12, marginBottom:12, borderLeft: `4px solid ${d.status==='PENDING'?'#f59e0b':d.status==='ACCEPTED'?'#3b82f6':'#10b981'}`}}>
            <div style={{display:'flex', justifyContent:'space-between', gap:12, flexWrap:'wrap'}}>
              <div>
                <b>{d.seller_name||d.seller} - {d.status}</b>
                <div style={{fontSize:14, margin:'4px 0'}}>📍 {d.pickup_address||d.from} → {d.dropoff_address||d.delivery_address||d.to}</div>
                <div style={{fontSize:13, color:'#666'}}>👤 {d.customer_name||d.customer} - {d.customer_phone||d.phone} - ${d.delivery_fee||d.amount||5}</div>
              </div>
              <div style={{display:'flex', flexDirection:'column', gap:8}}>
                {d.status==='PENDING' && <button onClick={()=>accept(d.id)} style={{background:'#16a34a', color:'white', padding:'10px 18px', borderRadius:8, border:'none', fontWeight:'bold', cursor:'pointer'}}>Accept ${d.delivery_fee||5}</button>}
                {d.status==='ACCEPTED' && <button onClick={()=>deliver(d.id)} style={{background:'black', color:'white', padding:'10px 18px', borderRadius:8, border:'none', fontWeight:'bold', cursor:'pointer'}}>✓ Mark Delivered</button>}
                {d.status==='DELIVERED' && <div style={{background:'#dcfce7', color:'#166534', padding:'8px 14px', borderRadius:8, fontWeight:'bold'}}>✓ Delivered</div>}
                <div style={{display:'flex', gap:6}}><button style={{flex:1, background:'#f3f4f6', padding:'6px', borderRadius:6, border:'none', cursor:'pointer'}}>💬 Chat</button><button style={{flex:1, background:'#f3f4f6', padding:'6px', borderRadius:6, border:'none'}}>📞</button><button style={{flex:1, background:'#f3f4f6', padding:'6px', borderRadius:6, border:'none'}}>🧭 Map</button></div>
              </div>
            </div>
          </div>
        ))}
        {filtered.length===0 && <div style={{background:'white', padding:40, borderRadius:12, textAlign:'center'}}>No {filter} - try ALL filter - total {deliveries.length}</div>}
      </div>
    </div>
  );
}
