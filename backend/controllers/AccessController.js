export const rolePermissions = {
  "Admin": { "*": ["isView", "isEdit", "isDelete"] },
  "Super Admin": { "*": ["isView", "isEdit", "isDelete"] },
  "Asset Management": {
    assets: ["isView", "isEdit"],
    users: ["isView"],
    // ...add more as needed
  },
  "Employee": {
    incidents: ["isView", "isEdit"],
    // ...add more as needed
  },
  "GoCollect Support Department": {
    supportDepartment: ["isView"],
    // ...add more as needed
  },
  "Grievance Support Team": {
    grievance: ["isView"],
    // ...add more as needed
  },
  "L1 Technician": {
    tickets: ["isView", "isEdit"],
    // ...add more as needed
  },
  "L2 Technician": {
    tickets: ["isView", "isEdit"],
    // ...add more as needed
  },
  "L3 Technician": {
    tickets: ["isView", "isEdit"],
    // ...add more as needed
  },
  "Application Support Team": {
    application: ["isView"],
    // ...add more as needed
  }
  // Add more roles/modules as needed
};

export const getPermissions = async (req, res) => {
  const { userRole } = req.user;
  let permissions = rolePermissions[userRole] || {};

  // If Admin or Super Admin, allow all pages
  if (userRole === "Admin" || userRole === "Super Admin") {
    permissions = { "*": ["isView", "isEdit", "isDelete"] };
  }

  res.json({ permissions });
};