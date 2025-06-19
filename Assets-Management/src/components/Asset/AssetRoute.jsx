import React from "react";
import { Routes, Route } from "react-router-dom";
import AddFixedAssets from "./Global/AddFixedAssets";
import AssetImport from "./Global/AssetImport";
import AssetData from "./Global/AssetData";
import EditAsset from "./Global/EditAsset";
import AssetsSummary from "./Global/AssetsSummary";
import GetPass from "./Global/GetPass";
import EditGetPass from "./Global/EditGetPass";
import GetPassImport from "./Global/GetPassImport";
const AssetRoute = () => {
  return (
    <Routes>
      <Route path="AddFixedAssets" element={<AddFixedAssets />} />
      <Route path="asset-import" element={<AssetImport />} />
      <Route path="AssetData" element={<AssetData />} />
      <Route path=":id" element={<EditAsset />} />
      <Route path="assets-summary" element={<AssetsSummary />} />
      <Route path="get-pass" element={<GetPass />} />
      <Route path="edit-pass/:id" element={<EditGetPass />} />
      <Route path="get-pass-import" element={<GetPassImport />} />
    </Routes>
  );
};

export default AssetRoute;
