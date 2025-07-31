import { useSelector } from "react-redux";
import { useMemo } from "react";

/**
 * Checks if the current user has permission for a page/action.
 * @param {string} page - The page or module name (e.g. "assets", "users").
 * @param {string} action - The permission type ("isView", "isEdit", "isDelete").
 * @returns {boolean} True if user has permission, else false.
 */
export const usePermission = (page, action = "isView") => {
  const permissions = useSelector((state) => state.authReducer.permissions);

  return useMemo(() => {
    if (!permissions) return false;
    // If Admin or Super Admin, allow all actions
    if (permissions["*"] && permissions["*"].includes(action)) return true;
    return permissions[page]?.includes(action);
  }, [permissions, page, action]);
};