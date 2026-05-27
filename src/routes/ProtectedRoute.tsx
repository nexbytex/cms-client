import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import type { Role } from '../types';

interface Props {
  children: React.ReactNode;
  allowedRoles: Role[];
}

export default function ProtectedRoute({ children, allowedRoles }: Props) {
  const { isAuthenticated, user } = useAuthStore();

  // Not logged in → go to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Logged in but wrong role → go to their dashboard
  if (user && !allowedRoles.includes(user.role)) {
    const redirectMap: Record<Role, string> = {
      ADMIN: '/admin',
      TEACHER: '/teacher',
      STUDENT: '/student',
    };
    return <Navigate to={redirectMap[user.role]} replace />;
  }

  return <>{children}</>;
}