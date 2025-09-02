import MermaidChart from "./MermaidChart";

const serviceRequestChart = `
flowchart TD
    A[User Logs Service Request] --> B{Approval Needed?}
    B -- Yes --> C[Status: Approval Pending]
    C --> D{Approved?}
    D -- Yes --> E[Status: Provisioning]
    D -- No --> F[Status: Rejected]
    E --> G[Status: Assigned]
    G --> H[Status: In Progress]
    H --> I{Resolved?}
    I -- Yes --> J[Status: Resolved]
    J --> K{User Confirms?}
    K -- Yes --> L[Status: Closed]
    K -- No --> M[Status: Reopen]
    M --> H
    H -- Pause Needed? --> N[Status: On Hold]
    N --> H
    H -- Cancel Needed? --> O[Status: Cancelled]
    O --> P[End]
    L --> P
    F --> P
    B -- No --> G
`;

export default function ServiceRequestFlowchart() {
  return (
    <div className="flex justify-center items-center min-h-[80vh] bg-gradient-to-br from-emerald-50 to-blue-50">
      <div className="w-full max-w-3xl rounded-2xl shadow-2xl bg-white/80 p-8 border border-emerald-100 animate-fade-in-up">
        <h2 className="text-3xl font-bold text-emerald-700 mb-6 text-center tracking-tight drop-shadow">
          Service Request Flow
        </h2>
        <MermaidChart chart={serviceRequestChart} className="transition-transform duration-700 hover:scale-105" />
      </div>
    </div>
  );
}