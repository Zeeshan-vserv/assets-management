import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { getAssetById } from "../../../../api/AssetsRequest";

function Summary({ id }) {
  const [data, setData] = useState(null);
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

  console.log(data);

  return (
    <>
      <div className="w-[100%] h-[100vh] p-4 flex flex-col gap-4 bg-slate-200">
        <div className="flex justify-end items-center gap-4">
          <h2 className="font-semibold text-sm text-gray-700">
            Mapped Asset :{}
          </h2>
          <NavLink to={`/main/asset/${id}`}>
            <button className="bg-[#df656b] shadow-[#F26E75] text-white px-4 py-1 rounded-md transition-all text-sm font-medium">
              Edit
            </button>
          </NavLink>
        </div>
        <div className="overflow-x-auto bg-white shadow-sm rounded-lg p-6">
          <table className="min-w-full table-auto border-separate border-spacing-y-2">
            <tr className="bg-gray-50 hover:bg-gray-100 rounded">
              <th className="text-left text-sm px-4 py-2 text-gray-700 w-1/2">
                Status
              </th>
              <td className="px-4 py-2 text-sm text-gray-900">
                {data?.assetState?.assetIsCurrently}
              </td>
            </tr>
            <tr className="bg-gray-50 hover:bg-gray-100 rounded">
              <th className="text-left px-4 py-2 text-sm text-gray-700 w-1/2">
                Asset Category Name
              </th>
              <td className="px-4 py-2 text-sm text-gray-900">
                {data?.assetInformation?.category}
              </td>
            </tr>
            <tr className="bg-gray-50 hover:bg-gray-100 rounded">
              <th className="text-left px-4 py-2 text-sm text-gray-700 w-1/2">
                Asset Tag
              </th>
              <td className="px-4 py-2 text-sm text-gray-900">
                {data?.assetInformation?.assetTag}
              </td>
            </tr>
            <tr className="bg-gray-50 hover:bg-gray-100 rounded">
              <th className="text-left px-4 py-2 text-sm text-gray-700 w-1/2">
                Asset Image
              </th>
              <td className="px-4 py-2 text-sm text-gray-900">in Store</td>
            </tr>
            <tr className="bg-gray-50 hover:bg-gray-100 rounded">
              <th className="text-left px-4 py-2 text-sm text-gray-700 w-1/2">
                Manufacturer Name
              </th>
              <td className="px-4 py-2 text-sm text-gray-900">
                {data?.assetInformation?.make}
              </td>
            </tr>
            <tr className="bg-gray-50 hover:bg-gray-100 rounded">
              <th className="text-left px-4 py-2 text-sm text-gray-700 w-1/2">
                Model Name
              </th>
              <td className="px-4 py-2 text-sm text-gray-900">
                {data?.assetInformation?.model}
              </td>
            </tr>
            <tr className="bg-gray-50 hover:bg-gray-100 rounded">
              <th className="text-left px-4 py-2 text-sm text-gray-700 w-1/2">
                Operating System
              </th>
              <td className="px-4 py-2 text-sm text-gray-900">
                {data?.assetInformation?.operatingSystem}
              </td>
            </tr>
            <tr className="bg-gray-50 hover:bg-gray-100 rounded">
              <th className="text-left px-4 py-2 text-sm text-gray-700 w-1/2">
                Condition
              </th>
              <td className="px-4 py-2 text-sm text-gray-900">in Store</td>
            </tr>
            <tr className="bg-gray-50 hover:bg-gray-100 rounded">
              <th className="text-left px-4 py-2 text-sm text-gray-700 w-1/2">
                Parent Asset
              </th>
              <td className="px-4 py-2 text-sm text-gray-900">in Store</td>
            </tr>
            <tr className="bg-gray-50 hover:bg-gray-100 rounded">
              <th className="text-left px-4 py-2 text-sm text-gray-700 w-1/2">
                Vendor Name
              </th>
              <td className="px-4 py-2 text-sm text-gray-900">
                {data?.warrantyInformation?.vendor}
              </td>
            </tr>
            <tr className="bg-gray-50 hover:bg-gray-100 rounded">
              <th className="text-left px-4 py-2 text-sm text-gray-700 w-1/2">
                Location
              </th>
              <td className="px-4 py-2 text-sm text-gray-900">
                {data?.locationInformation?.location}
              </td>
            </tr>
            <tr className="bg-gray-50 hover:bg-gray-100 rounded">
              <th className="text-left px-4 py-2 text-sm text-gray-700 w-1/2">
                Store Location
              </th>
              <td className="px-4 py-2 text-sm text-gray-900">
                {data?.locationInformation?.storeLocation}
              </td>
            </tr>
            <tr className="bg-gray-50 hover:bg-gray-100 rounded">
              <th className="text-left px-4 py-2 text-sm text-gray-700 w-1/2">
                Sub Location
              </th>
              <td className="px-4 py-2 text-sm text-gray-900">
                {data?.locationInformation?.subLocation}
              </td>
            </tr>
            <tr className="bg-gray-50 hover:bg-gray-100 rounded">
              <th className="text-left px-4 py-2 text-sm text-gray-700 w-1/2">
                Department
              </th>
              <td className="px-4 py-2 text-sm text-gray-900">{data?.assetState?.department}</td>
            </tr>
            <tr className="bg-gray-50 hover:bg-gray-100 rounded">
              <th className="text-left px-4 py-2 text-sm text-gray-700 w-1/2">
                Serial Number
              </th>
              <td className="px-4 py-2 text-sm text-gray-900">{data?.assetInformation?.serialNumber}</td>
            </tr>
            <tr className="bg-gray-50 hover:bg-gray-100 rounded">
              <th className="text-left px-4 py-2 text-sm text-gray-700 w-1/2">
                Express Service code
              </th>
              <td className="px-4 py-2 text-sm text-gray-900">{data?.assetInformation?.expressServiceCode}</td>
            </tr>
            <tr className="bg-gray-50 hover:bg-gray-100 rounded">
              <th className="text-left px-4 py-2 text-sm text-gray-700 w-1/2">
                Allocated To
              </th>
              <td className="px-4 py-3 text-sm text-gray-900">{data?.assetState?.user}</td>
            </tr>
            <tr className="bg-gray-50 hover:bg-gray-100 rounded">
              <th className="text-left px-4 py-2 text-sm text-gray-700 w-1/2">
                User Name
              </th>
              <td className="px-4 py-3 text-sm text-gray-900">{data?.assetState?.user}</td>
            </tr>
            <tr className="bg-gray-50 hover:bg-gray-100 rounded">
              <th className="text-left px-4 py-2 text-sm text-gray-700 w-1/2">
                User Contact No
              </th>
              <td className="px-4 py-2 text-sm text-gray-900"></td>
            </tr>
            <tr className="bg-gray-50 hover:bg-gray-100 rounded">
              <th className="text-left px-4 py-2 text-sm text-gray-700 w-1/2">
                Purchase Price
              </th>
              <td className="px-4 py-2 text-sm text-gray-900">Rs. {data?.financeInformation?.assetCost}</td>
            </tr>
            <tr className="bg-gray-50 hover:bg-gray-100 rounded">
              <th className="text-left px-4 py-2 text-sm text-gray-700 w-1/2">
                Invoice No
              </th>
              <td className="px-4 py-2 text-sm text-gray-900">{data?.financeInformation?.invoiceNo}</td>
            </tr>
            <tr className="bg-gray-50 hover:bg-gray-100 rounded">
              <th className="text-left px-4 py-2 text-sm text-gray-700 w-1/2">
                Invoice Date
              </th>
              <td className="px-4 py-2 text-sm text-gray-900">{data?.financeInformation?.invoiceDate}</td>
            </tr>
            <tr className="bg-gray-50 hover:bg-gray-100 rounded">
              <th className="text-left px-4 py-2 text-sm text-gray-700 w-1/2">
                Warranty Type
              </th>
              <td className="px-4 py-2 text-sm text-gray-900">{data?.warrantyInformation?.supportType}</td>
            </tr>
            {/* <tr className="bg-gray-50 hover:bg-gray-100 rounded">
              <th className="text-left px-4 py-2 text-sm text-gray-700 w-1/2">
                Warranty Start Date
              </th>
              <td className="px-4 py-2 text-sm text-gray-900"></td>
            </tr>
            <tr className="bg-gray-50 hover:bg-gray-100 rounded">
              <th className="text-left px-4 py-2 text-sm text-gray-700 w-1/2">
                Warranty End Date
              </th>
              <td className="px-4 py-2 text-sm text-gray-900"></td>
            </tr>
            <tr className="bg-gray-50 hover:bg-gray-100 rounded">
              <th className="text-left px-4 py-2 text-sm text-gray-700 w-1/2">
                AMC Start Date
              </th>
              <td className="px-4 py-2 text-sm text-gray-900"></td>
            </tr>
            <tr className="bg-gray-50 hover:bg-gray-100 rounded">
              <th className="text-left px-4 py-2 text-sm text-gray-700 w-1/2">
                AMC End Date
              </th>
              <td className="px-4 py-2 text-sm text-gray-900"></td>
            </tr> */}
          </table>
        </div>
      </div>
    </>
  );
}

export default Summary;
