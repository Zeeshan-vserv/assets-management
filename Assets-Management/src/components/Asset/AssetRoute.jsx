import React from "react";
import { Routes, Route } from "react-router-dom";
import AddFixedAssets from "./Global/AddFixedAssets";
import AssetImport from "./Global/AssetImport";
import AssetData from "./Global/AssetData";
import EditAsset from "./Global/EditAsset";
import AssetsSummary from "./Global/AssetsSummary";
const AssetRoute = () => {
  return (
    <Routes>
      <Route path="AddFixedAssets" element={<AddFixedAssets />} />
      <Route path="asset-import" element={<AssetImport />} />
      <Route path="AssetData" element={<AssetData />} />
      <Route path=":id" element={<EditAsset />} />
      <Route path="assets-summary" element={<AssetsSummary />} />
    </Routes>
  );
};

export default AssetRoute;
