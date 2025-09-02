import MermaidChart from "./MermaidChart";
import { Timeline } from "@mui/icons-material"; // Optional: Add any icon
import "./IncidentFlowchart.css"; // custom styles here

const incidentChart = `
flowchart TD
    A[User Logs Incident] --> B{Technician Assigned?}
    B -- Yes --> C[Status: Assigned]
    B -- No --> D[Status: New]
    C --> E[Status: In Progress]
    D --> C
    E --> F{Resolved?}
    F -- Yes --> G[Status: Resolved]
    F -- No --> E
    G --> H{User Confirms?}
    H -- Yes --> I[Status: Closed]
    H -- No --> J[Status: Reopen]
    J --> E
    G -- Auto-Close Timer --> I
    E -- Pause Needed? --> K[Status: Pause]
    K --> E
    E -- Cancel Needed? --> L[Status: Cancelled]
    L --> M[End]
    I --> M
`;

export default function IncidentFlowchart() {
  return (
    <div className="flowchart-wrapper">
      <div className="flowchart-card">
        <div className="flowchart-header">
          <Timeline className="flowchart-icon" />
          <h2 className="flowchart-title">Incident Lifecycle Flow</h2>
        </div>
        <MermaidChart chart={incidentChart} className="flowchart-graph" />
      </div>
    </div>
  );
}
