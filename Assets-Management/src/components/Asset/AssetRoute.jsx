import React from 'react'
import { Routes, Route } from "react-router-dom";
import AddFixedAssets from './Global/AddFixedAssets';
const AssetRoute = () => {
  return (
      <Routes>
        <Route path="AddFixedAssets" element={<AddFixedAssets />} />
      </Routes>
  )
}

export default AssetRoute