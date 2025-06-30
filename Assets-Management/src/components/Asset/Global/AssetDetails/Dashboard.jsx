import React, { useEffect, useState } from "react";
import { getAssetById } from "../../../../api/AssetsRequest";
import { getUserById } from "../../../../api/AuthRequest";

function Dashboard({ id }) {
  const [data, setData] = useState(null);
  const [createdBy, setCreatedBy] = useState(null);

  const fetchData = async () => {
    try {
      const response = await getAssetById(id);
      setData(response?.data?.data);
    } catch (error) {
      console.error("Error fetching asset details:", error);
    }
  };

  useEffect(() => {
    if (id) {
      fetchData();
    }
  }, [id]);

  useEffect(() => {
    const fetchCreator = async () => {
      if (data?.userId) {
        try {
          const response = await getUserById(data.userId);
          // console.log(response.data.employeeName);
          
          setCreatedBy(response?.data?.employeeName);
        } catch (error) {
          console.error("Error fetching user details:", error);
        }
      }
    };

    fetchCreator();
  }, [data]);

  console.log(data);
  return (
    <>
      <div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-8">
          <div className="flex flex-col gap-2 items-center bg-white rounded-lg shadow-sm p-3 border border-gray-200 text-gray-700 transition">
            <h2 className="font-semibold text-sm text-blue-600 mb-1">
              Make (CMDB)
            </h2>
            <span className="text-sm">{data?.assetInformation?.make}</span>
          </div>
          <div className="flex flex-col items-center bg-white rounded-lg shadow-sm p-3 border border-gray-200 text-gray-700 transition">
            <h2 className="font-semibold text-sm text-blue-600 mb-1">
              Model (CMDB)
            </h2>
            <span className="text-sm">{data?.assetInformation?.model}</span>
          </div>
          <div className="flex flex-col items-center bg-white rounded-lg shadow-sm p-3 border border-gray-200 text-gray-700 transition">
            <h2 className="font-semibold text-sm text-blue-600 mb-1">
              Serial No. (CMDB)
            </h2>
            <span className="text-sm">
              {data?.assetInformation?.serialNumber}
            </span>
          </div>
          <div className="flex flex-col items-center bg-white rounded-lg shadow-sm p-3 border border-gray-200 text-gray-700 transition">
            <h2 className="font-semibold text-sm text-blue-600 mb-1">
              Allocated To
            </h2>
            <span className="text-sm">{data?.assetState?.user}</span>
          </div>
          <div className="flex flex-col items-center bg-white rounded-lg shadow-sm p-3 border border-gray-200 text-gray-700 transition">
            <h2 className="font-semibold text-sm text-blue-600 mb-1">
              Location
            </h2>
            <span className="text-sm">{data?.locationInformation?.location}</span>
          </div>
          <div className="flex flex-col items-center bg-white rounded-lg shadow-sm p-3 border border-gray-200 text-gray-700 transition">
            <h2 className="font-semibold text-sm text-blue-600 mb-1">
              Asset Status
            </h2>
            <span className="text-sm">{data?.assetState?.assetIsCurrently}</span>
          </div>
          <div className="flex flex-col items-center bg-white rounded-lg shadow-sm p-3 border border-gray-200 text-gray-700 transition">
            <h2 className="font-semibold text-sm text-blue-600 mb-1">Group</h2>
            <span className="text-sm">{}</span>
          </div>
          <div className="flex flex-col items-center bg-white rounded-lg shadow-sm p-3 border border-gray-200 text-gray-700 transition">
            <h2 className="font-semibold text-sm text-blue-600 mb-1">
              Remaining Life
            </h2>
            <span className="text-sm">{}</span>
          </div>
          <div className="flex flex-col items-center bg-white rounded-lg shadow-sm p-3 border border-gray-200 text-gray-700 transition">
            <h2 className="font-semibold text-sm text-blue-600 mb-1">
              Asset Components
            </h2>
            <span className="text-sm">{}</span>
          </div>
          <div className="flex flex-col items-center bg-white rounded-lg shadow-sm p-3 border border-gray-200 text-gray-700 transition">
            <h2 className="font-semibold text-sm text-blue-600 mb-1">
              Gate Pass Status
            </h2>
            <span className="text-sm">{}</span>
          </div>
          <div className="flex flex-col items-center bg-white rounded-lg shadow-sm p-3 border border-gray-200 text-gray-700 transition">
            <h2 className="font-semibold text-sm text-blue-600 mb-1">Vendor</h2>
            <span className="text-sm">{data?.warrantyInformation?.vendor}</span>
          </div>
          <div className="flex flex-col items-center bg-white rounded-lg shadow-sm p-3 border border-gray-200 text-gray-700 transition">
            <h2 className="font-semibold text-sm text-blue-600 mb-1">
              Available Docs
            </h2>
            <span className="text-sm">{}</span>
          </div>
          <div className="flex flex-col items-center bg-white rounded-lg shadow-sm p-3 border border-gray-200 text-gray-700 transition">
            <h2 className="font-semibold text-sm text-blue-600 mb-1">
              Created Date
            </h2>
            <span className="text-sm">{}</span>
          </div>
          <div className="flex flex-col items-center bg-white rounded-lg shadow-sm p-3 border border-gray-200 text-gray-700 transition">
            <h2 className="font-semibold text-sm text-blue-600 mb-1">
              Created By
            </h2>
            <span className="text-sm">{createdBy}</span>
          </div>
        </div>
      </div>
    </>
  );
}

export default Dashboard;
