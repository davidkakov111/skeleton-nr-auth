import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/auth/useAuth";
import type { UserRole } from "../../types/api";
import { FullPageSpinner } from "../shared";

// ProtectedRouteIsAuth component to guard routes for authenticated users
export function ProtectedRouteIsAuth({
  children,
}: {
  children: React.JSX.Element;
}) {
  const { user, loading } = useAuth();
  if (loading) return <FullPageSpinner />;
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

// ProtectedRouteIsNotAuth component to guard routes for unauthenticated users
export function ProtectedRouteIsNotAuth({
  children,
}: {
  children: React.JSX.Element;
}) {
  const { user, loading } = useAuth();
  if (loading) return <FullPageSpinner />;
  if (user) return <Navigate to="/" replace />;
  return children;
}

// ProtectedRouteByRoles component to guard routes by authenticated user roles
export function ProtectedRouteByRoles({
  roles,
  children,
}: {
  roles: UserRole[];
  children: React.JSX.Element;
}) {
  const { user, loading } = useAuth();
  if (loading) return <FullPageSpinner />;
  if (!user || !roles.includes(user.role))
    return <Navigate to="/login" replace />;
  return children;
}
