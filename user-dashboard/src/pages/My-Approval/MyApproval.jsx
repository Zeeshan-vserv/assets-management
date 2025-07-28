import React from "react";
import ServiceRequestApproval from "./ServiceRequestApproval.jsx";
import GatePassApproval from "./GatePassApproval.jsx";
import PurchaseOrderApproval from "./PurchaseOrderApproval.jsx";

function MyApproval() {
  return (
    <div className="w-[100%] min-h-screen p-6 flex flex-col gap-5 bg-slate-200">
      <ServiceRequestApproval />
      {/* <GatePassApproval /> */}
      {/* <PurchaseOrderApproval /> */}
    </div>
  );
}

export default MyApproval;
