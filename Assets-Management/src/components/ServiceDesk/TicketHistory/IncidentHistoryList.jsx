import React from "react";
import IncidentTimeline from "./IncidentTimeline";
import "./IncidentHistoryList.css";

const IncidentHistoryList = ({ incidents, type = "Incident" }) => {
  if (!incidents || incidents.length === 0) {
    return <p className="no-incidents">No incidents found.</p>;
  }

  return (
    <div className="incident-list-container">
      {incidents.map((incident, index) => (
        <div
          className="incident-card fade-in"
          key={incident._id}
          style={{ animationDelay: `${index * 0.1}s` }}
        >
          <div className="incident-header">
            <div>
              <h3 className="incident-title">
                {incident.incidentId || incident.serviceId} - {incident.subject}
              </h3>
              <div className="incident-meta">
                <span className={`incident-status-chip status-${incident.status.replace(/\s/g, "").toLowerCase()}`}>
                  {incident.status}
                </span>
                <span className="incident-category">{incident.category}{incident.subCategory ? ` · ${incident.subCategory}` : ""}</span>
                <span className="incident-loggedby">Logged By: {incident.submitter?.user || incident.submitter?.name}</span>
              </div>
            </div>
            <div className="incident-sla">
              <span>SLA:</span> {incident.sla ? new Date(incident.sla).toLocaleString() : "—"}
            </div>
          </div>
          <IncidentTimeline
            timeline={incident.statusTimeline}
            title={type === "Service Request" ? "Service Request Timeline" : "Incident Timeline"}
          />
        </div>
      ))}
    </div>
  );
};

export default IncidentHistoryList;