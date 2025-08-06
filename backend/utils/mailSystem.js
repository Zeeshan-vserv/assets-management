import nodemailer from "nodemailer";
import AuthModel from "../models/authModel.js";

const transporter = nodemailer.createTransport({
  host: "vservit.icewarpcloud.in",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Fetch emails by role
export async function getEmailsByRole(role) {
  const users = await AuthModel.find({ userRole: role });
  return users.map(u => u.emailAddress).filter(Boolean);
}

// Fetch email by user ID or username
export async function getEmailById(idOrUsername) {
  let user = null;
  if (/^[0-9a-fA-F]{24}$/.test(idOrUsername)) {
    user = await AuthModel.findById(idOrUsername);
  }
  if (!user) {
    user = await AuthModel.findOne({ username: idOrUsername });
  }
  return user?.emailAddress || "";
}

// --- INCIDENT MAILS ---

export async function sendNewIncidentMail({ incident, adminEmails, superAdminEmails, technicianEmail }) {
  const subject = `New Incident Logged: ${incident.incidentId}`;
  const html = `
    <b>New Incident Logged</b><br>
    <b>Incident ID:</b> ${incident.incidentId}<br>
    <b>Subject:</b> ${incident.subject}<br>
    <b>Category:</b> ${incident.category}<br>
    <b>Status:</b> ${incident.status}<br>
    <b>Logged By:</b> ${incident.submitter?.user || incident.userId}<br>
    <b>Description:</b> ${incident.description}
  `;
  const toList = [...adminEmails, ...superAdminEmails].filter(Boolean).join(",");
  if (toList) {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: toList,
      subject,
      html,
    });
  }
  if (technicianEmail) {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: technicianEmail,
      subject,
      html,
    });
  }
}

export async function sendAssignedIncidentMail({ incident, adminEmails, superAdminEmails, technicianEmail }) {
  const subject = `Incident Assigned: ${incident.incidentId}`;
  const latestAssignment = incident.statusTimeline?.at(-1);
  const html = `
    <b>Incident Assigned</b><br>
    <b>Incident ID:</b> ${incident.incidentId}<br>
    <b>Subject:</b> ${incident.subject}<br>
    <b>Category:</b> ${incident.category}<br>
    <b>Status:</b> ${incident.status}<br>
    <b>Assigned To:</b> ${technicianEmail}<br>
    <b>Assigned By:</b> ${latestAssignment?.changedBy || ""}<br>
    <b>Assignment Time:</b> ${latestAssignment ? new Date(latestAssignment.changedAt).toLocaleString() : ""}<br>
    <b>Description:</b> ${incident.description}
  `;
  const toList = [...adminEmails, ...superAdminEmails].filter(Boolean).join(",");
  if (toList) {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: toList,
      subject,
      html,
    });
  }
  if (technicianEmail) {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: technicianEmail,
      subject,
      html,
    });
  }
}

// --- SERVICE REQUEST MAILS ---

export async function sendNewServiceRequestMail({ serviceRequest, adminEmails, superAdminEmails, technicianEmail, approverEmails }) {
  const subject = `New Service Request Logged: ${serviceRequest.serviceId}`;
  const html = `
    <b>New Service Request Logged</b><br>
    <b>Service Request ID:</b> ${serviceRequest.serviceId}<br>
    <b>Subject:</b> ${serviceRequest.subject}<br>
    <b>Category:</b> ${serviceRequest.category}<br>
    <b>Status:</b> ${serviceRequest.status}<br>
    <b>Logged By:</b> ${serviceRequest.submitter?.user || serviceRequest.userId}<br>
    <b>Description:</b> ${serviceRequest.description}
  `;
  const toList = [...adminEmails, ...superAdminEmails].filter(Boolean).join(",");
  if (toList) {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: toList,
      subject,
      html,
    });
  }
  if (technicianEmail) {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: technicianEmail,
      subject,
      html,
    });
  }
  if (approverEmails && approverEmails.length > 0) {
    for (const email of approverEmails) {
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: `Approval Required: ${serviceRequest.serviceId}`,
        html,
      });
    }
  }
}

export async function sendAssignedServiceRequestMail({ serviceRequest, adminEmails, superAdminEmails, technicianEmail, approverEmails }) {
  const subject = `Service Request Assigned: ${serviceRequest.serviceId}`;
  const latestAssignment = serviceRequest.statusTimeline?.at(-1);
  const html = `
    <b>Service Request Assigned</b><br>
    <b>Service Request ID:</b> ${serviceRequest.serviceId}<br>
    <b>Subject:</b> ${serviceRequest.subject}<br>
    <b>Category:</b> ${serviceRequest.category}<br>
    <b>Status:</b> ${serviceRequest.status}<br>
    <b>Assigned To:</b> ${technicianEmail}<br>
    <b>Assigned By:</b> ${latestAssignment?.changedBy || ""}<br>
    <b>Assignment Time:</b> ${latestAssignment ? new Date(latestAssignment.changedAt).toLocaleString() : ""}<br>
    <b>Description:</b> ${serviceRequest.description}
  `;
  const toList = [...adminEmails, ...superAdminEmails].filter(Boolean).join(",");
  if (toList) {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: toList,
      subject,
      html,
    });
  }
  if (technicianEmail) {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: technicianEmail,
      subject,
      html,
    });
  }
  if (approverEmails && approverEmails.length > 0) {
    for (const email of approverEmails) {
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: `Approval Required: ${serviceRequest.serviceId}`,
        html,
      });
    }
  }
}

export async function sendApprovalMail({ serviceRequest, approverEmail, level }) {
  const subject = `Approval Required: ${serviceRequest.serviceId}`;
  const html = `
    <b>Service Request Approval Needed</b><br>
    <b>Service Request ID:</b> ${serviceRequest.serviceId}<br>
    <b>Subject:</b> ${serviceRequest.subject}<br>
    <b>Category:</b> ${serviceRequest.category}<br>
    <b>Status:</b> ${serviceRequest.status}<br>
    <b>Approval Level:</b> ${level}<br>
    <b>Description:</b> ${serviceRequest.description}
  `;
  if (approverEmail) {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: approverEmail,
      subject,
      html,
    });
  }
}

export async function sendRequesterNotificationMail({ serviceRequest, requesterEmail, action }) {
  const subject = `Your Service Request ${serviceRequest.serviceId} has been ${action}`;
  const html = `
    <b>Service Request ID:</b> ${serviceRequest.serviceId}<br>
    <b>Subject:</b> ${serviceRequest.subject}<br>
    <b>Status:</b> ${serviceRequest.status}<br>
    <b>Result:</b> ${action}<br>
    <b>Description:</b> ${serviceRequest.description}
  `;
  if (requesterEmail) {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: requesterEmail,
      subject,
      html,
    });
  }
}

export async function sendServiceStatusChangeMail({ serviceRequest, adminEmails, superAdminEmails }) {
  const subject = `Status Changed: ${serviceRequest.serviceId}`;
  const latestStatus = serviceRequest.statusTimeline?.at(-1);
  const html = `
    <b>Service Request Status Changed</b><br>
    <b>Service Request ID:</b> ${serviceRequest.serviceId}<br>
    <b>Subject:</b> ${serviceRequest.subject}<br>
    <b>Category:</b> ${serviceRequest.category}<br>
    <b>New Status:</b> ${serviceRequest.status}<br>
    <b>Changed By:</b> ${latestStatus?.changedBy || ""}<br>
    <b>Change Time:</b> ${latestStatus ? new Date(latestStatus.changedAt).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }) : ""}<br>
    <b>Description:</b> ${serviceRequest.description}
  `;
  const toList = [...adminEmails, ...superAdminEmails].filter(Boolean).join(",");
  if (toList) {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: toList,
      subject,
      html,
    });
  }
  // Notify the user who logged the ticket
  const userEmail = serviceRequest.submitter?.userEmail;
  if (userEmail) {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: userEmail,
      subject,
      html,
    });
  }
}

export async function sendIncidentStatusChangeMail({ incident, adminEmails, superAdminEmails }) {
  const subject = `Status Changed: ${incident.incidentId}`;
  const latestStatus = incident.statusTimeline?.at(-1);
  const html = `
    <b>Incident Status Changed</b><br>
    <b>Incident ID:</b> ${incident.incidentId}<br>
    <b>Subject:</b> ${incident.subject}<br>
    <b>Category:</b> ${incident.category}<br>
    <b>New Status:</b> ${incident.status}<br>
    <b>Changed By:</b> ${latestStatus?.changedBy || ""}<br>
    <b>Change Time:</b> ${latestStatus ? new Date(latestStatus.changedAt).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }) : ""}<br>
    <b>Description:</b> ${incident.description}
  `;
  const toList = [...adminEmails, ...superAdminEmails].filter(Boolean).join(",");
  if (toList) {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: toList,
      subject,
      html,
    });
  }
  // Notify the user who logged the ticket
  const userEmail = incident.submitter?.userEmail;
  if (userEmail) {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: userEmail,
      subject,
      html,
    });
  }
}