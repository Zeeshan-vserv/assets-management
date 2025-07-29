import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";

const Sidebar = () => {
  const user = useSelector((state) => state.authReducer.authData);

  return (
    <nav>
      {user?.assets?.isView && <NavLink to="/assets">Assets</NavLink>}
      {user?.tickets?.isView && <NavLink to="/tickets">Tickets</NavLink>}
      {user?.userRole === "Admin" && <NavLink to="/admin">Admin Panel</NavLink>}
      {/* Add more page checks as needed */}
    </nav>
  );
};

export default Sidebar;