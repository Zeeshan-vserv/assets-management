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
    console.log("RBAC check:", req.user.userRole, "for", pageKey, action);
    if (req.user.userRole === "Admin" || req.user.userRole === "Super Admin") return next();
    if (!req.user[pageKey] || !req.user[pageKey][action]) {
      return res.status(403).json({ message: "Access denied: insufficient page permission" });
    }
    next();
  };
};