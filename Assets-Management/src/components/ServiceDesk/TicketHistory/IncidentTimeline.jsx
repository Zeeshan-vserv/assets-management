// import React from "react";
// import "./IncidentTimeline.css";
// import {
//   CheckCircle,
//   HourglassEmpty,
//   AssignmentInd,
//   BuildCircle,
//   Cancel,
//   FiberManualRecord,
// } from "@mui/icons-material";

// const statusMeta = {
//   New: { color: "#00C853", icon: <FiberManualRecord fontSize="small" /> },
//   Assigned: { color: "#FF9100", icon: <AssignmentInd fontSize="small" /> },
//   "In Progress": { color: "#FFAB00", icon: <BuildCircle fontSize="small" /> },
//   Resolved: { color: "#2962FF", icon: <CheckCircle fontSize="small" /> },
//   Closed: { color: "#D50000", icon: <Cancel fontSize="small" /> },
//   "Task Assigned": { color: "#FFC107", icon: <AssignmentInd fontSize="small" /> },
// };

// function formatDate(dateStr) {
//   if (!dateStr) return "";
//   const d = new Date(dateStr);
//   return d.toLocaleString("en-GB", {
//     day: "2-digit",
//     month: "short",
//     year: "numeric",
//     hour: "2-digit",
//     minute: "2-digit",
//   });
// }

// const IncidentTimeline = ({ timeline, title = "Incident Timeline" }) => {
//   if (!timeline || timeline.length === 0) return <p className="timeline-empty">No status history.</p>;

//   return (
//     <div className="timeline-container">
//       <h4 className="timeline-header">{title}</h4>
//       <ul className="timeline">
//         {timeline.map((entry, idx) => {
//           const meta = statusMeta[entry.status] || {
//             color: "#888",
//             icon: <HourglassEmpty fontSize="small" />,
//           };
//           return (
//             <li className="timeline-item" key={idx}>
//               <div
//                 className="timeline-icon"
//                 style={{ backgroundColor: meta.color }}
//               >
//                 {meta.icon}
//               </div>
//               <div className="timeline-content">
//                 <div className="timeline-status-row">
//                   <span className="timeline-status">{entry.status}</span>
//                   <span className="timeline-date">{formatDate(entry.changedAt)}</span>
//                 </div>
//                 {entry.changedBy && (
//                   <div className="timeline-user">by {entry.changedBy}</div>
//                 )}
//                 {entry.closingSummary && (
//                   <div className="timeline-summary">
//                     <strong>Summary:</strong> {entry.closingSummary}
//                   </div>
//                 )}
//                 {entry.closeRemarks && (
//                   <div className="timeline-summary">
//                     <strong>Remarks:</strong> {entry.closeRemarks}
//                   </div>
//                 )}
//                 {entry.note && (
//                   <div className="timeline-note">
//                     <strong>Note:</strong> {entry.note}
//                   </div>
//                 )}
//               </div>
//             </li>
//           );
//         })}
//       </ul>
//     </div>
//   );
// };

// export default IncidentTimeline;

import React, { useEffect, useState } from "react";
import "./IncidentTimeline.css";
import {
  CheckCircle,
  HourglassEmpty,
  AssignmentInd,
  BuildCircle,
  Cancel,
  FiberManualRecord,
} from "@mui/icons-material";
import { getUserById } from "../../../api/AuthRequest";
// import { getUserById } from "../../api/AuthRequest";

const statusMeta = {
  New: { color: "#00C853", icon: <FiberManualRecord fontSize="small" /> },
  Assigned: { color: "#FF9100", icon: <AssignmentInd fontSize="small" /> },
  "In Progress": { color: "#FFAB00", icon: <BuildCircle fontSize="small" /> },
  Resolved: { color: "#2962FF", icon: <CheckCircle fontSize="small" /> },
  Closed: { color: "#D50000", icon: <Cancel fontSize="small" /> },
  "Task Assigned": { color: "#FFC107", icon: <AssignmentInd fontSize="small" /> },
};

function formatDate(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return d.toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

const IncidentTimeline = ({ timeline, title = "Incident Timeline" }) => {
  const [userEmails, setUserEmails] = useState({});

  useEffect(() => {
    const fetchEmails = async () => {
      const ids = timeline
        .map((entry) => entry.changedBy)
        .filter((id) => id && !userEmails[id]);
      const promises = ids.map((id) =>
        getUserById(id)
          .then((res) => {
            // Log the response to check the structure
            console.log("User API response for", id, res.data);
            // Adjust this line if your API returns email differently
            return { id, email: res.data.emailAddress || res.data.user?.emailAddress || "Unknown" };
          })
          .catch(() => ({ id, email: "Unknown" }))
      );
      const results = await Promise.all(promises);
      const emails = {};
      results.forEach(({ id, email }) => {
        emails[id] = email;
      });
      setUserEmails((prev) => ({ ...prev, ...emails }));
    };
    if (timeline && timeline.length > 0) fetchEmails();
    // eslint-disable-next-line
  }, [timeline]);

  if (!timeline || timeline.length === 0) return <p className="timeline-empty">No status history.</p>;

  return (
    <div className="timeline-container">
      <h4 className="timeline-header">{title}</h4>
      <ul className="timeline">
        {timeline.map((entry, idx) => {
          const meta = statusMeta[entry.status] || {
            color: "#888",
            icon: <HourglassEmpty fontSize="small" />,
          };
          return (
            <li className="timeline-item" key={idx}>
              <div
                className="timeline-icon"
                style={{ backgroundColor: meta.color }}
              >
                {meta.icon}
              </div>
              <div className="timeline-content">
                <div className="timeline-status-row">
                  <span className="timeline-status">{entry.status}</span>
                  <span className="timeline-date">{formatDate(entry.changedAt)}</span>
                </div>
                {entry.changedBy && (
                  <div className="timeline-user">                    
                    by {userEmails[entry.changedBy] || entry.changedBy}
                  </div>
                )}
                {entry.closingSummary && (
                  <div className="timeline-summary">
                    <strong>Summary:</strong> {entry.closingSummary}
                  </div>
                )}
                {entry.closeRemarks && (
                  <div className="timeline-summary">
                    <strong>Remarks:</strong> {entry.closeRemarks}
                  </div>
                )}
                {entry.note && (
                  <div className="timeline-note">
                    <strong>Note:</strong> {entry.note}
                  </div>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default IncidentTimeline;