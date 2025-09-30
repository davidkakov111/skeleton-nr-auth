import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/auth/useAuth";

// ProtectedRouteIsAuth component to guard routes for authenticated users
export function ProtectedRouteIsAuth({ children }: { children: React.JSX.Element }) {
    const { user } = useAuth();
    if (!user) return <Navigate to="/login" replace />;
    return children;
}

// ProtectedRouteIsNotAuth component to guard routes for unauthenticated users
export function ProtectedRouteIsNotAuth({ children }: { children: React.JSX.Element }) {
    const { user } = useAuth();
    if (user) return <Navigate to="/" replace />;
    return children;
}
