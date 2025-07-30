import { useSelector } from "react-redux";
import { usePermission } from "../hooks/usePermission";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, page, permission = "isView", allowedRoles = [] }) => {
  const user = useSelector((state) => state.authReducer.authData);
  const permissions = useSelector((state) => state.authReducer.permissions);

  // Show loading if permissions are not loaded yet
  if (!permissions) return <div>Loading...</div>;

  // If user is Admin or Super Admin, allow access to all pages
  if (user?.userRole === "Admin" || user?.userRole === "Super Admin") {
    return children;
  }

  const hasRole = allowedRoles.includes(user?.userRole);
  const hasPermission = usePermission(page, permission);

  if (hasRole || hasPermission) {
    return children;
  }
  return <Navigate to="/not-authorized" />;
};

export default ProtectedRoute;