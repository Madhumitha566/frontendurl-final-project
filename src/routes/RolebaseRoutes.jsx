import { useAuth } from "../context/authContext";
import { Navigate } from "react-router-dom";

const RolebaseRoutes = ({ children, requiredRole }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        <span className="ml-3 text-gray-600 font-medium">Loading...</span>
      </div>
    );
  }

  // 1. If no user is logged in at all, send them to login
  if (!user) {
    return <Navigate to="/login" />;
  }

  // 2. If user exists but their role is not in the allowed list
  // Note: Check if your backend sends "Resident" or "resident"
  if (!requiredRole.includes(user.role)) {
    return <Navigate to="/unauthorized" />;
  }

  // 3. If everything is fine, render the dashboard
  return children;
};

export default RolebaseRoutes;