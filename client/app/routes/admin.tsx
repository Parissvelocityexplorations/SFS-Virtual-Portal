import { Outlet, useNavigate, useLocation } from '@remix-run/react';
import { useEffect } from 'react';
import type { MetaFunction } from '@remix-run/node';

export const meta: MetaFunction = () => {
  return [
    { title: "Admin - Space Force Visitor Management" },
    { name: "description", content: "Admin panel for Space Force Visitor Management system" },
  ];
};

export default function Admin() {
  const navigate = useNavigate();
  const location = useLocation();
  
  useEffect(() => {
    // Check if user is authenticated except for signin route
    if (location.pathname !== '/admin/signin') {
      const isAuthenticated = localStorage.getItem('sfAdminAuth') === 'true';
      
      if (!isAuthenticated) {
        navigate('/admin/signin');
      }
    }
  }, [location.pathname, navigate]);
  
  return <Outlet />;
}