import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import type { UserRole } from '@/types';

interface ProtectedRouteProps {
  children: React.ReactNode;
  roles?: UserRole[];
  permissions?: string[];
}

export function ProtectedRoute({ children, roles, permissions }: ProtectedRouteProps) {
  const { isAuthenticated, user } = useAuthStore();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (roles && user && !roles.includes(user.role)) {
    const effectiveRole = (user as any).effective_role || user.role
    if (!roles.includes(effectiveRole as any)) {
      return <Navigate to="/403" replace />;
    }
  }

  if (permissions && user) {
    const userPerms = (user as any).permissions || []
    const isAllowed = permissions.every((p) => userPerms.includes(p))
    if (!isAllowed) {
      return <Navigate to="/403" replace />;
    }
  }

  return <>{children}</>;
}
