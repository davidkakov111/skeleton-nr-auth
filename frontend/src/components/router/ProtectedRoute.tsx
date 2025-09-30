import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/auth/useAuth";

// ProtectedRoute component to guard routes
export default function ProtectedRoute({ children }: { children: React.JSX.Element }) {
    const { user } = useAuth();
    if (!user) return <Navigate to="/login" replace />;
    return children;
}
