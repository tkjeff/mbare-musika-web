import { useState, useEffect } from 'react';

export default function RiderDashboard() {
  const [deliveries, setDeliveries] = useState([
    { id: '1', seller: 'Mama Chipo Tomatoes', items: '2 crates tomatoes', amount: 5, status: 'PENDING', from: 'Mbare Musika A2', to: 'Budiriro C', customer: 'Takudzwa', phone: '0771234567' },
    { id: '2', seller: 'Baba Moyo Onions', items: '1 bag onions', amount: 3, status: 'ACCEPTED', from: 'Mbare Musika B1', to: 'Highfield', customer: 'Chipo', phone: '0782345678' },
    { id: '3', seller: 'Gogo Fruits', items: 'Mixed fruits', amount: 4, status: 'DELIVERED', from: 'Mbare Musika C3', to: 'Warren Park', customer: 'Tafadzwa', phone: '0773456789' },
  ]);
  const [earnings] = useState({ today: 15, week: 85, total: 420, count: 3, freeUsed: 2 });
  const [newOffer, setNewOffer] = useState(null);
  const [filter, setFilter] = useState('pending');
  const [activeChat, setActiveChat] = useState(null);
  const [showEarnings, setShowEarnings] = useState(true);

  useEffect(() => {
    // Demo popup for new offer after 3 seconds
    const t = setTimeout(() => {
      setNewOffer({ id: 'new-1', amount: 5, from: 'Mbare Musika A2', to: 'Budiriro C', seller: 'Mama Chipo Tomatoes - 2 crates', customer: 'Takudzwa Moyo' });
    }, 3000);
    return () => clearTimeout(t);
  }, []);

  const acceptDelivery = (id) => {
    setDeliveries(prev => prev.map(d => d.id===id ? {...d, status:'ACCEPTED'} : d));
    setNewOffer(null);
  };

  const markDelivered = (id) => {
    setDeliveries(prev => prev.map(d => d.id===id ? {...d, status:'DELIVERED'} : d));
  };

  const filtered = deliveries.filter(d => filter==='all' ? true : d.status.toLowerCase()===filter);

  return (
    <div style={{minHeight:'100vh', background:'#f8f6f1', padding:16, fontFamily:'system-ui'}}>
      {newOffer && (
        <div style={{position:'fixed', top:16, right:16, background:'#16a34a', color:'white', padding:16, borderRadius:12, boxShadow:'0 10px 30px rgba(0,0,0,0.3)', zIndex:99, maxWidth:320}}>
          <h3 style={{fontWeight:'bold', margin:0}}>🔥 New Delivery Offer ${newOffer.amount}</h3>
          <p style={{margin:'4px 0', fontSize:14}}>{newOffer.from} → {newOffer.to}</p>
          <p style={{margin:'4px 0', fontSize:13, opacity:0.9}}>{newOffer.seller}</p>
          <p style={{margin:'4px 0', fontSize:12}}>Customer: {newOffer.customer}</p>
          <div style={{display:'flex', gap:8, marginTop:10}}>
            <button onClick={()=>acceptDelivery(newOffer.id)} style={{background:'white', color:'#16a34a', padding:'8px 18px', borderRadius:6, fontWeight:'bold', border:'none', cursor:'pointer', flex:1}}>Accept $5</button>
            <button onClick={()=>setNewOffer(null)} style={{background:'#14532d', color:'white', padding:'8px 12px', borderRadius:6, border:'none', cursor:'pointer'}}>Decline</button>
          </div>
        </div>
      )}

      <div style={{maxWidth:1100, margin:'0 auto'}}>
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20, flexWrap:'wrap', gap:10}}>
          <h1 style={{fontSize:28, fontWeight:'bold', margin:0}}>Rider Dashboard</h1>
          <div style={{display:'flex', gap:10}}>
            <div style={{background:'black', color:'white', padding:'12px 20px', borderRadius:10}}><p style={{fontSize:11, margin:0, opacity:0.8}}>TODAY</p><p style={{fontSize:22, fontWeight:'bold', margin:0}}>${earnings.today}.00</p><p style={{fontSize:11, margin:0}}>{earnings.count} deliveries</p></div>
            <div style={{background:'white', padding:'12px 16px', borderRadius:10, border:'1px solid #eee'}}><p style={{fontSize:11, margin:0, color:'#666'}}>FREE</p><p style={{fontSize:16, fontWeight:'bold', margin:0}}>{earnings.freeUsed}/3 used</p><p style={{fontSize:10, margin:0, color: earnings.freeUsed>=3 ? 'red' : 'green'}}>{earnings.freeUsed>=3 ? '$1/day after' : 'Free delivery'}</p></div>
          </div>
        </div>

        <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(150px, 1fr))', gap:12, marginBottom:20}}>
          <div style={{background:'white', padding:14, borderRadius:10, boxShadow:'0 2px 8px rgba(0,0,0,0.05)'}}><p style={{fontSize:11, color:'#666', margin:0}}>TODAY DELIVERIES</p><p style={{fontSize:22, fontWeight:'bold', margin:0}}>{earnings.count}</p></div>
          <div style={{background:'white', padding:14, borderRadius:10, boxShadow:'0 2px 8px rgba(0,0,0,0.05)'}}><p style={{fontSize:11, color:'#666', margin:0}}>WEEK</p><p style={{fontSize:22, fontWeight:'bold', margin:0}}>${earnings.week}</p></div>
          <div style={{background:'white', padding:14, borderRadius:10, boxShadow:'0 2px 8px rgba(0,0,0,0.05)'}}><p style={{fontSize:11, color:'#666', margin:0}}>TOTAL EARNINGS</p><p style={{fontSize:22, fontWeight:'bold', margin:0}}>${earnings.total}</p></div>
          <div style={{background:'#fef3c7', padding:14, borderRadius:10}}><p style={{fontSize:11, color:'#92400e', margin:0}}>SUBSCRIPTION</p><p style={{fontSize:14, fontWeight:'bold', margin:0}}>{earnings.freeUsed<3 ? 'Free (3/day)' : 'Pay $1/day'}</p></div>
        </div>

        <div style={{display:'flex', gap:8, marginBottom:16, flexWrap:'wrap'}}>
          {['pending','accepted','delivered','all'].map(f=>(
            <button key={f} onClick={()=>setFilter(f)} style={{padding:'8px 18px', borderRadius:20, border:'none', cursor:'pointer', background: filter===f?'black':'white', color: filter===f?'white':'black', fontWeight: filter===f?'bold':'normal', boxShadow:'0 1px 3px rgba(0,0,0,0.1)'}}>{f.toUpperCase()}</button>
          ))}
          <button onClick={()=>setShowEarnings(!showEarnings)} style={{marginLeft:'auto', padding:'8px 14px', borderRadius:20, background:'white', border:'1px solid #ddd', cursor:'pointer'}}>💰 Earnings</button>
        </div>

        {filtered.length===0 && <div style={{background:'white', padding:40, borderRadius:12, textAlign:'center', color:'#888'}}>No {filter} deliveries</div>}

        {filtered.map(d=>(
          <div key={d.id} style={{background:'white', padding:18, borderRadius:12, boxShadow:'0 2px 10px rgba(0,0,0,0.06)', marginBottom:14, borderLeft: d.status==='PENDING'?'4px solid #f59e0b': d.status==='ACCEPTED'?'4px solid #3b82f6':'4px solid #10b981'}}>
            <div style={{display:'flex', justifyContent:'space-between', flexWrap:'wrap', gap:12}}>
              <div style={{flex:1, minWidth:220}}>
                <h3 style={{fontWeight:'bold', fontSize:16, margin:'0 0 4px 0'}}>{d.seller} <span style={{fontSize:12, background:'#f3f4f6', padding:'2px 8px', borderRadius:10, marginLeft:6}}>{d.status}</span></h3>
                <p style={{color:'#444', margin:'0 0 6px 0', fontSize:14}}>{d.items} - <b>${d.amount} fee</b></p>
                <p style={{fontSize:13, margin:'6px 0'}}>📍 <b>{d.from}</b> → {d.to}</p>
                <p style={{fontSize:12, color:'#666', margin:'4px 0'}}>👤 {d.customer} - {d.phone}</p>
                <div style={{marginTop:10, height:90, background:'#f0fdf4', borderRadius:8, display:'flex', alignItems:'center', justifyContent:'center', fontSize:12, color:'#555', border:'1px dashed #bbf7d0'}}>🗺️ Map View: {d.from} → {d.to} (Leaflet map)</div>
              </div>
              <div style={{display:'flex', flexDirection:'column', gap:8, minWidth:150}}>
                {d.status==='PENDING' && <button onClick={()=>acceptDelivery(d.id)} style={{background:'#16a34a', color:'white', padding:'12px', borderRadius:8, fontWeight:'bold', border:'none', cursor:'pointer'}}>Accept ${d.amount}</button>}
                {d.status==='ACCEPTED' && <><button onClick={()=>markDelivered(d.id)} style={{background:'black', color:'white', padding:'12px', borderRadius:8, fontWeight:'bold', border:'none', cursor:'pointer'}}>✓ Mark Delivered</button><div style={{fontSize:11, color:'#666', textAlign:'center'}}>Complete delivery to earn</div></>}
                {d.status==='DELIVERED' && <div style={{background:'#dcfce7', color:'#166534', padding:10, borderRadius:8, textAlign:'center', fontWeight:'bold'}}>✓ Delivered - ${d.amount} earned</div>}
                <div style={{display:'flex', gap:6, marginTop:4}}>
                  <button onClick={()=>setActiveChat(activeChat===d.id?null:d.id)} style={{flex:1, background: activeChat===d.id?'black':'#f3f4f6', color: activeChat===d.id?'white':'black', padding:'8px', borderRadius:6, fontSize:12, border:'none', cursor:'pointer'}}>💬 Chat</button>
                  <button style={{flex:1, background:'#f3f4f6', padding:'8px', borderRadius:6, fontSize:12, border:'none', cursor:'pointer'}}>📞 Call</button>
                  <button style={{flex:1, background:'#f3f4f6', padding:'8px', borderRadius:6, fontSize:12, border:'none', cursor:'pointer'}}>🧭 Map</button>
                </div>
                {activeChat===d.id && (
                  <div style={{background:'#f9fafb', padding:10, borderRadius:8, marginTop:6, border:'1px solid #eee'}}>
                    <p style={{fontSize:11, margin:'0 0 6px 0', fontWeight:'bold'}}>Chat with {d.customer}</p>
                    <div style={{fontSize:12, background:'white', padding:6, borderRadius:6, marginBottom:4}}>Customer: Where is my order?</div>
                    <div style={{fontSize:12, background:'#dcfce7', padding:6, borderRadius:6}}>You: On my way, 10 mins!</div>
                    <input placeholder="Type message..." style={{width:'100%', marginTop:6, padding:6, borderRadius:6, border:'1px solid #ddd', fontSize:12}} />
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
