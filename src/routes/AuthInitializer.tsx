import { useEffect, useState } from 'react';
import { useAuthStore } from '../store/authStore';
import api from '../lib/api';

interface Props {
  children: React.ReactNode;
}

export default function AuthInitializer({ children }: Props) {
  const { token, setAuth, logout } = useAuthStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await api.get('/auth/me');
        setAuth(res.data, token);
      } catch {
        // Token invalid or expired
        logout();
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-500 text-lg">Loading...</p>
      </div>
    );
  }

  return <>{children}</>;
}