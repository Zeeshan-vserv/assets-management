import React from "react";
import AllocatedAsset from "./AllocatedAsset.jsx";
import AllocatedConsumables from "./AllocatedConsumables.jsx";
import AllocatedComponent from "./AllocatedComponent.jsx";
function MyAssets() {
  return (
    <>
      <div className="w-[100%] min-h-screen p-6 flex flex-col gap-5 bg-slate-200">
        <AllocatedAsset />
        <AllocatedConsumables />
        <AllocatedComponent />
      </div>
    </>
  );
}

export default MyAssets;
