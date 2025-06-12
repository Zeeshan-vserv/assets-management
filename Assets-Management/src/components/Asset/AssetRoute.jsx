import React from "react";
import { Routes, Route } from "react-router-dom";
import AddFixedAssets from "./Global/AddFixedAssets";
import AssetImport from "./Global/AssetImport";
const AssetRoute = () => {
  return (
    <Routes>
      <Route path="AddFixedAssets" element={<AddFixedAssets />} />
      <Route path="asset-import" element={<AssetImport />} />
    </Routes>
  );
};

export default AssetRoute;
