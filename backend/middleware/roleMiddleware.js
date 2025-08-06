import { rolePermissions } from '../controllers/AccessController.js';

export const requireRole = (roles = []) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.userRole)) {
      return res.status(403).json({ message: "Access denied: insufficient role" });
    }
    next();
  };
};

export const requirePagePermission = (pageKey, action = "isView") => {
  return (req, res, next) => {
    // console.log("User role:", req.user.userRole);
    // console.log("Role permissions:", rolePermissions[req.user.userRole]);

    // 1. Allow Admin/Super Admin
    if (req.user.userRole === "Admin" || req.user.userRole === "Super Admin") return next();

    // 2. Check rolePermissions for this role and page
    const perms = rolePermissions[req.user.userRole];
    if (
      perms &&
      (
        (perms[pageKey] && perms[pageKey].includes(action)) ||
        (perms["*"] && perms["*"].includes(action))
      )
    ) {
      return next();
    }

    // 3. If not allowed by role, check user page/module permission
    if (
      req.user[pageKey] &&
      req.user[pageKey][action] === true
    ) {
      return next();
    }

    // 4. Deny if neither role nor page permission allows
    return res.status(403).json({ message: "Access denied: insufficient page permission" });
  };
};