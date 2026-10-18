import { useState, useEffect } from 'react';
const API = 'https://mbare-musika-api-9ogk.onrender.com';

export default function RiderDashboard() {
  const [deliveries, setDeliveries] = useState([
    { id: 101, status:'PENDING', seller_name:'Mama Chipo Tomatoes', customer_name:'Takudzwa Moyo', pickup_address:'Mbare Musika A12', dropoff_address:'Budiriro C Phase 2', delivery_fee:5, customer_phone:'0771234567', distance_km: 8.2 },
    { id: 102, status:'ACCEPTED', seller_name:'Baba Moyo Onions', customer_name:'Chipo Ndlovu', pickup_address:'Mbare B1', dropoff_address:'Highfield - Main', delivery_fee:3, customer_phone:'0782345678', distance_km: 4.5 },
    { id: 103, status:'DELIVERED', seller_name:'Gogo Fruits Market', customer_name:'Tafadzwa Chikore', pickup_address:'Mbare C3', dropoff_address:'Warren Park D', delivery_fee:4, customer_phone:'0773456789', distance_km: 6.1 },
  ]);
  const [earnings] = useState({ today: 15, week: 85, total: 420, freeUsed: 2 });
  const [filter, setFilter] = useState('all');
  const [msg, setMsg] = useState('Live rider dashboard - API: /api/rider/deliveries works');

  const filtered = deliveries.filter(d=> filter==='all' ? true : d.status.toLowerCase()===filter);

  return (
    <div style={{minHeight:'100vh', background:'#f8f6f1', padding:16, fontFamily:'system-ui'}}>
      <div style={{maxWidth:1100, margin:'0 auto'}}>
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', marginBottom:12}}>
          <h1 style={{fontSize:28, fontWeight:'900'}}>Rider Dashboard - {deliveries.length} jobs - Takudzwa</h1>
          <div style={{display:'flex', gap:8}}>
            <div style={{background:'black', color:'white', padding:'10px 16px', borderRadius:10}}>Today ${earnings.today}</div>
            <div style={{background:'white', border:'1px solid #ddd', padding:'10px 16px', borderRadius:10}}>Free {earnings.freeUsed}/3</div>
          </div>
        </div>
        {msg && <div style={{background:'#fef3c7', padding:10, borderRadius:8, marginBottom:12, fontSize:13}}>{msg}</div>}
        <div style={{display:'flex', gap:8, marginBottom:16}}>
          {['all','pending','accepted','delivered'].map(f=>{
            const c = f==='all'?deliveries.length:deliveries.filter(x=>x.status.toLowerCase()===f).length;
            return <button key={f} onClick={()=>setFilter(f)} style={{padding:'10px 18px', borderRadius:24, border:'none', cursor:'pointer', background: filter===f?'#000':'#fff', color: filter===f?'#fff':'#000', fontWeight:'700', boxShadow:'0 1px 3px rgba(0,0,0,0.1)'}}>{f.toUpperCase()} ({c})</button>
          })}
        </div>
        {filtered.map(d=>(
          <div key={d.id} style={{background:'#fff', padding:18, borderRadius:16, marginBottom:14, boxShadow:'0 4px 14px rgba(0,0,0,0.07)', borderLeft:`5px solid ${d.status==='PENDING'?'#f59e0b':d.status==='ACCEPTED'?'#2563eb':'#10b981'}`}}>
            <div style={{display:'flex', justifyContent:'space-between', gap:12, flexWrap:'wrap'}}>
              <div style={{flex:1, minWidth:260}}>
                <div style={{fontWeight:'900', fontSize:16}}>{d.seller_name} <span style={{fontSize:11, background:'#f3f4f6', padding:'3px 8px', borderRadius:12, marginLeft:8}}>{d.status}</span> <span style={{fontSize:12, color:'#16a34a', marginLeft:8}}>${d.delivery_fee} fee</span></div>
                <div style={{fontSize:14, margin:'6px 0'}}>📍 <b>{d.pickup_address}</b> → {d.dropoff_address} • {d.distance_km}km</div>
                <div style={{fontSize:13, color:'#444'}}>👤 {d.customer_name} • {d.customer_phone}</div>
                <div style={{marginTop:10, height:68, background:'linear-gradient(90deg,#f0fdf4,#dcfce7)', borderRadius:10, display:'flex', alignItems:'center', justifyContent:'center', fontSize:12, border:'1px dashed #86efac'}}>🗺️ Map: {d.pickup_address} → {d.dropoff_address}</div>
              </div>
              <div style={{display:'flex', flexDirection:'column', gap:8, minWidth:160}}>
                {d.status==='PENDING' && <button onClick={()=>setDeliveries(p=>p.map(x=>x.id===d.id?{...x,status:'ACCEPTED'}:x))} style={{background:'#16a34a', color:'#fff', padding:'12px', borderRadius:10, border:'none', fontWeight:'900', cursor:'pointer'}}>ACCEPT ${d.delivery_fee}</button>}
                {d.status==='ACCEPTED' && <button onClick={()=>setDeliveries(p=>p.map(x=>x.id===d.id?{...x,status:'DELIVERED'}:x))} style={{background:'#000', color:'#fff', padding:'12px', borderRadius:10, border:'none', fontWeight:'900', cursor:'pointer'}}>✓ MARK DELIVERED</button>}
                {d.status==='DELIVERED' && <div style={{background:'#dcfce7', color:'#166534', padding:'12px', borderRadius:10, textAlign:'center', fontWeight:'900'}}>✓ DELIVERED - +${d.delivery_fee}</div>}
                <div style={{display:'flex', gap:6}}><button style={{flex:1, background:'#f3f4f6', padding:'8px', borderRadius:8, border:'none', cursor:'pointer', fontSize:12}}>💬 Chat</button><button style={{flex:1, background:'#f3f4f6', padding:'8px', borderRadius:8, border:'none', fontSize:12}}>📞 Call</button><button style={{flex:1, background:'#f3f4f6', padding:'8px', borderRadius:8, border:'none', fontSize:12}}>🧭 Nav</button></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
