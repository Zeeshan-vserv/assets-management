import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, page, permission = "isView", allowedRoles = [] }) => {
  const user = useSelector((state) => state.authReducer.authData);

  // Allow if role matches or page permission is true
  const hasRole = allowedRoles.includes(user?.userRole);
  const hasPermission = user?.[page]?.[permission];

  if (hasRole || hasPermission) {
    return children;
  }
  return <Navigate to="/not-authorized" />;
};

export default ProtectedRoute;