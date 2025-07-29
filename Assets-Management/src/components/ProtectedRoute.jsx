import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, page, permission = "isView", allowedRoles = [] }) => {
  const user = useSelector((state) => state.authReducer.authData);
  
  

  const hasRole = allowedRoles.includes(user?.userRole);
  console.log("User Role:", user?.userRole, "Has Role:", hasRole);
  
  
  const hasPermission = user?.[page]?.[permission];

  if (hasRole || hasPermission) {
    return children;
  }
  return <Navigate to="/not-authorized" />;
};

export default ProtectedRoute;