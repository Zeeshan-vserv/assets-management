export const rolePermissions = {
  "Admin": { "*": ["isView", "isEdit", "isDelete"] },
  "Super Admin": { "*": ["isView", "isEdit", "isDelete"] },
  "Asset Management": {
    assets: ["isView", "isEdit"],
    users: ["isView"],
  },
  "Employee": {
    incident: ["isView", "isEdit"],
    dashboard: ["isView"],
    serviceRequest: ["isView", "isEdit"],
    gatePass: ["isView", "isEdit"],
    globalIncident: ["isView", "isEdit"],
    incidentCategory: ["isView", "isEdit"],
    incidentStatus: ["isView", "isEdit"],
    location: ["isView", "isEdit"],
    sla: ["isView", "isEdit"],
    department: ["isView", "isEdit"],
    softwareCategory: ["isView", "isEdit"],
    status: ["isView", "isEdit"],
    supportDepartment: ["isView", "isEdit"],
    globalService: ["isView", "isEdit"],
    serviceRequest: ["isView", "isEdit"],
    assets: ["isView", "isEdit"],
  },
  "GoCollect Support Department": {
    supportDepartment: ["isView"],
  },
  "Grievance Support Team": {
    grievance: ["isView"],
  },
  "L1 Technician": {
    incident: ["isView", "isEdit"],
    dashboard: ["isView"],
    serviceRequest: ["isView", "isEdit"],
    globalIncident: ["isView", "isEdit"],
    incidentCategory: ["isView", "isEdit"],
    incidentStatus: ["isView", "isEdit"],
    location: ["isView", "isEdit"],
    sla: ["isView", "isEdit"],
    department: ["isView", "isEdit"],
    softwareCategory: ["isView", "isEdit"],
    status: ["isView", "isEdit"],
    supportDepartment: ["isView", "isEdit"],
    globalService: ["isView", "isEdit"],
    serviceRequest: ["isView", "isEdit"],
    consumables: ["isView", "isEdit"],
    assets: ["isView", "isEdit"],
    approvals: ["isView"]
  },
  "L2 Technician": {
    incident: ["isView", "isEdit"],
    dashboard: ["isView"],
    serviceRequest: ["isView", "isEdit"],
    globalIncident: ["isView", "isEdit"],
    incidentCategory: ["isView", "isEdit"],
    incidentStatus: ["isView", "isEdit"],
    location: ["isView", "isEdit"],
    sla: ["isView", "isEdit"],
    department: ["isView", "isEdit"],
    softwareCategory: ["isView", "isEdit"],
    status: ["isView", "isEdit"],
    supportDepartment: ["isView", "isEdit"],
    globalService: ["isView", "isEdit"],
    serviceRequest: ["isView", "isEdit"],
    consumables: ["isView", "isEdit"],
    assets: ["isView", "isEdit"],
    approvals: ["isView"]

  },
  "L3 Technician": {
    incident: ["isView", "isEdit"],
    dashboard: ["isView"],
    serviceRequest: ["isView", "isEdit"],
    globalIncident: ["isView", "isEdit"],
    incidentCategory: ["isView", "isEdit"],
    incidentStatus: ["isView", "isEdit"],
    location: ["isView", "isEdit"],
    sla: ["isView", "isEdit"],
    department: ["isView", "isEdit"],
    softwareCategory: ["isView", "isEdit"],
    status: ["isView", "isEdit"],
    supportDepartment: ["isView", "isEdit"],
    globalService: ["isView", "isEdit"],
    serviceRequest: ["isView", "isEdit"],
    consumables: ["isView", "isEdit"],
    assets: ["isView", "isEdit"],
    approvals: ["isView"]
  },
  "Application Support Team": {
    application: ["isView"],
  }
};

export const getPermissions = async (req, res) => {
  const { userRole } = req.user;
  let permissions = rolePermissions[userRole] || {};

  if (userRole === "Admin" || userRole === "Super Admin") {
    permissions = { "*": ["isView", "isEdit", "isDelete"] };
  }

  res.json({ permissions });
};