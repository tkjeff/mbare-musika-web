import { Navigate } from 'react-router-dom';

export default function RoleGuard({ allow = [], children }) {
  let user = null;
  try {
    const keys = ['mbare_musika_user','user','auth_user','mbare_user'];
    for(const k of keys){
      const raw = localStorage.getItem(k);
      if(raw){ user = JSON.parse(raw); break; }
    }
  } catch {}
  
  const role = user?.role || localStorage.getItem('user_role') || 'CUSTOMER';

  if(!user){
    return <Navigate to="/login" replace />;
  }

  if(allow.length > 0 && !allow.includes(role)){
    const map = { OWNER:'/manager', ADMIN:'/admin', SELLER:'/seller', RIDER:'/rider', CUSTOMER:'/customer' };
    return <Navigate to={map[role] || '/'} replace />;
  }

  return children;
}
