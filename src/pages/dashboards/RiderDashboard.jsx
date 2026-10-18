import { useState, useEffect } from 'react';

export default function RiderDashboard() {
  const [deliveries] = useState([
    { id: '1', seller: 'Mama Chipo Tomatoes', items: '2 crates tomatoes - $40', amount: 5, status: 'PENDING', from: 'Mbare Musika A2', to: 'Budiriro C, Harare', customer: 'Takudzwa' },
    { id: '2', seller: 'Baba Moyo Onions', items: '1 bag onions - $25', amount: 3, status: 'ACCEPTED', from: 'Mbare Musika B1', to: 'Highfield', customer: 'Chipo' },
  ]);
  const [earnings] = useState({ today: 15, week: 85, total: 420, count: 3 });
  const [newOffer, setNewOffer] = useState({ id: 'demo-1', amount: 5, from: 'Mbare Musika A2', to: 'Budiriro C', seller: 'Mama Chipo Tomatoes' });
  const [filter, setFilter] = useState('pending');

  const filtered = deliveries.filter(d => filter==='all' || d.status.toLowerCase()===filter);

  return (
    <div style={{minHeight:'100vh', background:'#f8f6f1', padding:'16px', fontFamily:'system-ui'}}>
      {newOffer && (
        <div style={{position:'fixed', top:'16px', right:'16px', background:'#16a34a', color:'white', padding:'16px', borderRadius:'12px', boxShadow:'0 10px 30px rgba(0,0,0,0.3)', zIndex:50}}>
          <h3 style={{fontWeight:'bold'}}>🔥 New Delivery Offer ${newOffer.amount}</h3>
          <p>{newOffer.from} → {newOffer.to}</p>
          <p style={{fontSize:'14px'}}>{newOffer.seller}</p>
          <div style={{display:'flex', gap:'8px', marginTop:'8px'}}>
            <button onClick={()=>setNewOffer(null)} style={{background:'white', color:'#16a34a', padding:'6px 16px', borderRadius:'6px', fontWeight:'bold', border:'none', cursor:'pointer'}}>Accept</button>
            <button onClick={()=>setNewOffer(null)} style={{background:'#14532d', color:'white', padding:'6px 16px', borderRadius:'6px', border:'none', cursor:'pointer'}}>Decline</button>
          </div>
        </div>
      )}

      <div style={{maxWidth:'1100px', margin:'0 auto'}}>
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'24px'}}>
          <h1 style={{fontSize:'32px', fontWeight:'bold'}}>Rider Dashboard</h1>
          <div style={{background:'black', color:'white', padding:'12px 24px', borderRadius:'12px'}}>
            <p style={{fontSize:'12px', opacity:0.8}}>Today Earnings</p>
            <p style={{fontSize:'24px', fontWeight:'bold'}}>${earnings.today}.00</p>
          </div>
        </div>

        <div style={{display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:'16px', marginBottom:'24px'}}>
          <div style={{background:'white', padding:'16px', borderRadius:'12px', boxShadow:'0 2px 8px rgba(0,0,0,0.05)'}}><p style={{fontSize:'12px', color:'#666'}}>Deliveries Today</p><p style={{fontSize:'24px', fontWeight:'bold'}}>{earnings.count}</p></div>
          <div style={{background:'white', padding:'16px', borderRadius:'12px', boxShadow:'0 2px 8px rgba(0,0,0,0.05)'}}><p style={{fontSize:'12px', color:'#666'}}>Week Earnings</p><p style={{fontSize:'24px', fontWeight:'bold'}}>${earnings.week}</p></div>
          <div style={{background:'white', padding:'16px', borderRadius:'12px', boxShadow:'0 2px 8px rgba(0,0,0,0.05)'}}><p style={{fontSize:'12px', color:'#666'}}>Total</p><p style={{fontSize:'24px', fontWeight:'bold'}}>${earnings.total}</p></div>
        </div>

        <div style={{display:'flex', gap:'8px', marginBottom:'16px'}}>
          {['pending','accepted','delivered','all'].map(f=>(
            <button key={f} onClick={()=>setFilter(f)} style={{padding:'8px 16px', borderRadius:'20px', border:'none', cursor:'pointer', background: filter===f?'black':'white', color: filter===f?'white':'black', fontWeight: filter===f?'bold':'normal'}}>{f.toUpperCase()}</button>
          ))}
        </div>

        {filtered.map(d=>(
          <div key={d.id} style={{background:'white', padding:'20px', borderRadius:'12px', boxShadow:'0 2px 8px rgba(0,0,0,0.05)', marginBottom:'16px'}}>
            <div style={{display:'flex', justifyContent:'space-between'}}>
              <div>
                <h3 style={{fontWeight:'bold', fontSize:'18px'}}>{d.seller}</h3>
                <p style={{color:'#555'}}>{d.items} - ${d.amount} delivery fee</p>
                <p style={{fontSize:'14px', marginTop:'8px'}}>📍 {d.from} → {d.to}</p>
                <p style={{fontSize:'12px', color:'#888', marginTop:'4px'}}>Customer: {d.customer} | Status: {d.status}</p>
                <div style={{marginTop:'12px', height:'100px', background:'#f0fdf4', borderRadius:'8px', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'12px', color:'#666'}}>🗺️ Map: {d.from} → {d.to}</div>
              </div>
              <div style={{display:'flex', flexDirection:'column', gap:'8px', minWidth:'160px'}}>
                {d.status==='PENDING' && <button style={{background:'#16a34a', color:'white', padding:'10px', borderRadius:'8px', fontWeight:'bold', border:'none', cursor:'pointer'}}>Accept Delivery</button>}
                {d.status==='ACCEPTED' && <button style={{background:'black', color:'white', padding:'10px', borderRadius:'8px', border:'none', cursor:'pointer'}}>Mark Delivered</button>}
                <div style={{display:'flex', gap:'6px'}}>
                  <button style={{background:'#f3f4f6', padding:'6px 10px', borderRadius:'6px', fontSize:'12px', border:'none'}}>💬 Chat</button>
                  <button style={{background:'#f3f4f6', padding:'6px 10px', borderRadius:'6px', fontSize:'12px', border:'none'}}>📞 Call</button>
                  <button style={{background:'#f3f4f6', padding:'6px 10px', borderRadius:'6px', fontSize:'12px', border:'none'}}>🧭 Navigate</button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
