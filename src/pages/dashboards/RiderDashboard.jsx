import { useState } from 'react';
export default function RiderDashboard(){
  const [offer,setOffer]=useState(true);
  return (<div style={{padding:20, background:'#f8f6f1', minHeight:'100vh', fontFamily:'Arial'}}>
    {offer && <div style={{position:'fixed', top:10, right:10, background:'green', color:'white', padding:15, borderRadius:10, zIndex:99}}><b>New Offer $5</b><br/>Mama Chipo - Mbare A2 to Budiriro<br/><button onClick={()=>setOffer(false)} style={{background:'white', color:'green', padding:'5px 15px', border:'none', marginTop:8, borderRadius:5, cursor:'pointer'}}>Accept</button> <button onClick={()=>setOffer(false)} style={{background:'#14532d', color:'white', padding:'5px 10px', border:'none', borderRadius:5, marginLeft:5}}>Decline</button></div>}
    <h1 style={{fontSize:32, fontWeight:'bold'}}>Rider Dashboard</h1>
    <div style={{background:'black', color:'white', padding:'12px 24px', borderRadius:8, display:'inline-block', marginBottom:15}}>Today $15.00 - 3 deliveries</div>
    <div style={{display:'flex', gap:10, marginBottom:15}}><div style={{background:'white', padding:10, borderRadius:8}}>Week $85</div><div style={{background:'white', padding:10, borderRadius:8}}>Total $420</div></div>
    <div style={{background:'white', padding:15, borderRadius:10, marginBottom:10}}><h3>Mama Chipo Tomatoes</h3><p>2 crates tomatoes - $5 delivery</p><p>Mbare A2 to Budiriro C</p><button style={{background:'green', color:'white', padding:8, border:'none', borderRadius:5, cursor:'pointer'}}>Accept Delivery</button> <button style={{background:'#eee', padding:8, border:'none', borderRadius:5, marginLeft:5}}>Chat</button> <button style={{background:'#eee', padding:8, border:'none', borderRadius:5, marginLeft:5}}>Call</button><div style={{height:80, background:'#e8f5e9', marginTop:10, display:'flex', alignItems:'center', justifyContent:'center'}}>Map: Mbare to Customer</div></div>
  </div>)
}
