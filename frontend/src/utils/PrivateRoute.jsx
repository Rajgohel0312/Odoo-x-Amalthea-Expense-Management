import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function PrivateRoute({ children, roles }) {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>; // ✅ wait until state is restored

  if (!user) return <Navigate to="/login" />;

  if (roles && !roles.includes(user.role)) {
    return <h2 className="text-center mt-10 text-red-600 font-bold">
      403 - Unauthorized
    </h2>;
  }

  return children;
}
