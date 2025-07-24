import { useSelector } from "react-redux";

/**
 * Checks if the current user has permission for a page/action.
 * @param {string} page - The page or module name (e.g. "assets", "users").
 * @param {string} permission - The permission type ("isView", "isEdit", "isDelete").
 * @param {Array} allowedRoles - Array of roles that always have access (e.g. ["Admin", "Super Admin"]).
 * @returns {boolean} True if user has permission or role, else false.
 */
export const usePermission = (page, permission = "isView", allowedRoles = ["Admin", "Super Admin"]) => {
  const user = useSelector((state) => state.authReducer.authData);
  return (
    allowedRoles.includes(user?.userRole) ||
    (user?.[page] && user[page][permission])
  );
};