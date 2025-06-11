import React from "react";

const AddFixedAssets = () => {
  return (
    <div className="w-[100%] h-[94vh] overflow-auto p-6 flex flex-col gap-5 bg-slate-200">
      <h2 className="text-slate-700 font-semibold">NEW ASSET</h2>
      <form action="" className="flex flex-col gap-10">
        {/* Asset Information fields */}
        <div className="w-full p-8 bg-white rounded-md shadow-md">
          <div className="flex gap-1 justify-end">
            <button className="bg-[#8092D1] shadow-[#8092D1] shadow-md py-1.5 px-3 rounded-md text-sm text-white">
              submit
            </button>
            <button className="bg-[#F26E75] shadow-[#F26E75] shadow-md py-1.5 px-3 rounded-md text-sm text-white">
              cancel
            </button>
          </div>
          <h3 className="text-slate-700">Asset Information</h3>
          <div className="flex flex-wrap gap-6 justify-between mt-3">
            <div className="flex items-center w-[46%]">
              <label
                htmlFor="businessUnit"
                className="w-[25%] text-xs font-semibold text-slate-600"
              >
                Business Unit
              </label>
              <select
                className="w-[65%] text-xs border-b-2 border-slate-300 p-2 outline-none focus:border-blue-500"
                name="businessUnit"
                id="businessUnit"
              >
                <option value="">Select</option>
                <option value="1">Business Unit 1</option>
                <option value="2">Business Unit 2</option>
              </select>
            </div>
            <div className="flex items-center w-[46%]">
              <label
                htmlFor="category"
                className="w-[25%] text-xs font-semibold text-slate-600"
              >
                Category
              </label>
              <select
                className="w-[65%] text-xs border-b-2 border-slate-300 p-2 outline-none focus:border-blue-500"
                name="category"
                id="category"
              >
                <option value="">Select</option>
                <option value="IT Assets">IT Assets</option>
                <option value="Laptop">Laptop</option>
                <option value="Monitor">Monitor</option>
                <option value="Printer">Printer</option>
                <option value="Scanner">Scanner</option>
                <option value="Router">Router</option>
                <option value="Furniture">Furniture</option>
                <option value="Veichles">Veichles</option>
                <option value="Switch">Switch</option>
                <option value="Machinery">Machinery</option>
                <option value="Others">Others</option>
                <option value="Electronics">Electronics</option>
                <option value="Modem">Modem</option>
                <option value="Keyboard">Keyboard</option>
                <option value="Mouse">Mouse</option>
                <option value="Storage Devices">Storage Devices</option>
                <option value="MacBook">MacBook</option>
                <option value="Smart Tv">Smart Tv</option>
                <option value="Mobile Phone">Mobile Phone</option>
                <option value="Mobile Phone">Mobile Phone</option>
                <option value="Switch">Switch</option>
                <option value="UPS">UPS</option>
                <option value="Desk">Desk</option>
                <option value="File Cabinets">File Cabinets</option>
                <option value="Chairs">Chairs</option>
                <option value="Bookcases">Bookcases</option>
                <option value="Sofa Sets">Sofa Sets</option>
                <option value="Conference Speakers">Conference Speakers</option>
                <option value="Coffee Machine">Coffee Machine</option>
                <option value="Bag Scanner">Bag Scanner</option>
                <option value="Desk Phones">Desk Phones</option>
                <option value="Fan">Fan</option>
                <option value="Tool Kit">Tool Kit</option>
                <option value="Two Wheeler">Two Wheeler</option>
                <option value="Four Wheeler">Four Wheeler</option>
                <option value="Barcode Printer">Barcode Printer</option>
                <option value="Projector">Projector</option>
                <option value="Apple">Apple</option>
                <option value="Medical Desk">Medical Desk</option>
                <option value="Patient Bed">Patient Bed</option>
                <option value="Printer + Scanner">Printer + Scanner</option>
                <option value="VC">VC</option>
              </select>
            </div>
            <div className="flex items-center w-[46%]">
              <label
                htmlFor="assetTag"
                className="w-[25%] text-xs font-semibold text-slate-600"
              >
                Asset Tag
              </label>
              <input
                className="w-[65%] text-xs text-slate-600 border-b-2 border-slate-300 p-2 outline-none focus:border-blue-500"
                type="text"
                id="assetTag"
                name="assetTag"
              />
            </div>
            <div className="flex items-center w-[46%]">
              <label
                htmlFor="criticality"
                className="w-[25%] text-xs font-semibold text-slate-600"
              >
                Criticality
              </label>
              <select
                className="w-[65%] text-xs border-b-2 border-slate-300 p-2 outline-none focus:border-blue-500"
                name="criticality"
                id="criticality"
              >
                <option value="">Select</option>
                <option value="Critical">Critical</option>
                <option value="Non-Critical">Non-Critical</option>
              </select>
            </div>
            <div className="flex items-center w-[46%]">
              <label
                htmlFor="make"
                className="w-[25%] text-xs font-semibold text-slate-600"
              >
                Make
              </label>
              <input
                className="w-[65%] text-xs text-slate-600 border-b-2 border-slate-300 p-2 outline-none focus:border-blue-500"
                type="text"
                id="make"
                name="make"
              />
            </div>
            <div className="flex items-center w-[46%]">
              <label
                htmlFor="model"
                className="w-[25%] text-xs font-semibold text-slate-600"
              >
                Model
              </label>
              <input
                className="w-[65%] text-xs text-slate-600 border-b-2 border-slate-300 p-2 outline-none focus:border-blue-500"
                type="text"
                id="model"
                name="model"
              />
            </div>
            <div className="flex items-center w-[46%]">
              <label
                htmlFor="serialNumber"
                className="w-[25%] text-xs font-semibold text-slate-600"
              >
                Serial Number
              </label>
              <input
                className="w-[65%] text-xs text-slate-600 border-b-2 border-slate-300 p-2 outline-none focus:border-blue-500"
                type="text"
                id="serialNumber"
                name="serialNumber"
              />
            </div>
            <div className="flex items-center w-[46%]">
              <label
                htmlFor="expressServiceCode"
                className="w-[25%] text-xs font-semibold text-slate-600"
              >
                Express Service Code
              </label>
              <input
                className="w-[65%] text-xs text-slate-600 border-b-2 border-slate-300 p-2 outline-none focus:border-blue-500"
                type="text"
                id="expressServiceCode"
                name="expressServiceCode"
              />
            </div>
            <div className="flex items-center w-[46%]">
              <label
                htmlFor="ipAddress"
                className="w-[25%] text-xs font-semibold text-slate-600"
              >
                IP Address
              </label>
              <input
                className="w-[65%] text-xs text-slate-600 border-b-2 border-slate-300 p-2 outline-none focus:border-blue-500"
                type="text"
                id="ipAddress"
                name="ipAddress"
              />
            </div>
            <div className="flex items-center w-[46%]">
              <label
                htmlFor="operatingSystem"
                className="w-[25%] text-xs font-semibold text-slate-600"
              >
                Operating System
              </label>
              <input
                className="w-[65%] text-xs text-slate-600 border-b-2 border-slate-300 p-2 outline-none focus:border-blue-500"
                type="text"
                id="operatingSystem"
                name="operatingSystem"
              />
            </div>
            <div className="flex items-center w-[46%]">
              <label
                htmlFor="cpu"
                className="w-[25%] text-xs font-semibold text-slate-600"
              >
                CPU
              </label>
              <input
                className="w-[65%] text-xs text-slate-600 border-b-2 border-slate-300 p-2 outline-none focus:border-blue-500"
                type="text"
                id="cpu"
                name="cpu"
              />
            </div>
            <div className="flex items-center w-[46%]">
              <label
                htmlFor="hardDisk"
                className="w-[25%] text-xs font-semibold text-slate-600"
              >
                Hard Disk
              </label>
              <input
                className="w-[65%] text-xs text-slate-600 border-b-2 border-slate-300 p-2 outline-none focus:border-blue-500"
                type="text"
                id="hardDisk"
                name="hardDisk"
              />
            </div>
            <div className="flex items-center w-[46%]">
              <label
                htmlFor="ram"
                className="w-[25%] text-xs font-semibold text-slate-600"
              >
                RAM
              </label>
              <input
                className="w-[65%] text-xs text-slate-600 border-b-2 border-slate-300 p-2 outline-none focus:border-blue-500"
                type="text"
                id="ram"
                name="ram"
              />
            </div>
            <div className="flex items-center w-[46%]">
              <label
                htmlFor="assetImage"
                className="w-[25%] text-xs font-semibold text-slate-600"
              >
                Asset Image
              </label>
              <input
                className="w-[65%] text-xs text-slate-600 border-b-2 border-slate-300 p-2 outline-none focus:border-blue-500"
                type="file"
                id="ram"
                name="ram"
              />
            </div>
          </div>
        </div>

        {/* Location Information fields */}
        <div className="w-full p-8 bg-white rounded-md shadow-md">
          <h3 className="text-slate-700">Location Information</h3>
          <div className="flex flex-wrap gap-6 justify-between mt-3">
            <div className="flex items-center w-[46%]">
              <label
                htmlFor="location"
                className="w-[25%] text-xs font-semibold text-slate-600"
              >
                Location
              </label>
              <select
                className="w-[65%] text-xs border-b-2 border-slate-300 p-2 outline-none focus:border-blue-500"
                name="location"
                id="location"
              >
                <option value="">Select Location</option>
                <option value="agra">AGRA</option>
                <option value="ahmedabad">AHMEDABAD</option>
                <option value="banglore">BANGLORE</option>
                <option value="bokaro">BOKARO</option>
                <option value="bokaburnpurro">BURNPUR</option>
                <option value="chandigarh">CHANDIGARH</option>
                <option value="chattisgarh">CHATTISGARH</option>
                <option value="chennai">CHENNAI</option>
                <option value="coimbatore">COIMBATORE</option>
                <option value="dankuni">DANKUNI</option>
                <option value="delhi">DELHI</option>
                <option value="durgapur">DURGAPUR</option>
                <option value="faridabad">FARIDABAD</option>
                <option value="ghaziabad">GHAZIABAD</option>
                <option value="gujarat">GUJARAT</option>
                <option value="guwahati">GUWAHATI</option>
                <option value="haldia">HALDIA</option>
                <option value="hyderabad">HYDERABAD</option>
                <option value="jagdishpur">JAGDISHPUR</option>
                <option value="jalandhar">JALANDHAR</option>
                <option value="jammu">JAMMU</option>
                <option value="kandrori">KANDRORI</option>
                <option value="kanpur">KANPUR</option>
                <option value="kochi">KOCHI</option>
                <option value="kolkata">KOLKATA</option>
                <option value="lucknow">LUCKNOW</option>
                <option value="ludhiana">LUDHIANA</option>
                <option value="madhya pradesh">MADHYA PRADESH</option>
                <option value="maharashtra">MAHARASHTRA</option>
                <option value="manali">MANALI</option>
                <option value="mandigobindgarh">MANDIGOBINDGARH</option>
                <option value="N/A">N/A</option>
                <option value="paradeep">PARADEEP</option>
                <option value="patna">PATNA</option>
                <option value="prayagraj">PRAYAGRAJ</option>
                <option value="rajasthan">RAJASTHAN</option>
                <option value="rishikesh">RISHIKESH</option>
                <option value="roorkela">ROORKELA</option>
                <option value="salem">SALEM</option>
                <option value="siliguri">SILIGURI</option>
                <option value="srinagar">SRINAGAR</option>
                <option value="trichy">TRICHY</option>
                <option value="vizag">VIZAG</option>
              </select>
            </div>
            <div className="flex items-center w-[46%]">
              <label
                htmlFor="subLocation"
                className="w-[25%] text-xs font-semibold text-slate-600"
              >
                Sub Location
              </label>
              <input
                className="w-[65%] text-xs text-slate-600 border-b-2 border-slate-300 p-2 outline-none focus:border-blue-500"
                type="text"
                id="subLocation"
                name="subLocation"
              />
            </div>
            <div className="flex items-center w-[46%]">
              <label
                htmlFor="storeLocation"
                className="w-[25%] text-xs font-semibold text-slate-600"
              >
                Store Location
              </label>
              <input
                className="w-[65%] text-xs text-slate-600 border-b-2 border-slate-300 p-2 outline-none focus:border-blue-500"
                type="text"
                id="storeLocation"
                name="storeLocation"
              />
            </div>
          </div>
        </div>

        {/* Warranty Information fields */}
        <div className="w-full p-8 bg-white rounded-md shadow-md">
          <h3 className="text-slate-700">Warranty Information</h3>
          <div className="flex flex-wrap gap-6 justify-between mt-3">
            <div className="flex items-center w-[46%]">
              <label
                htmlFor="vendor"
                className="w-[25%] text-xs font-semibold text-slate-600"
              >
                Vendor
              </label>
              <select
                className="w-[65%] text-xs border-b-2 border-slate-300 p-2 outline-none focus:border-blue-500"
                name="businessUnit"
                id="businessUnit"
              >
                <option value="">Select</option>
                <option value="N/A">N/A</option>
              </select>
            </div>
            <div className="flex items-center w-[46%]">
              <label
                htmlFor="assetType"
                className="w-[25%] text-xs font-semibold text-slate-600"
              >
                Asset Type
              </label>
              <select
                className="w-[65%] text-xs border-b-2 border-slate-300 p-2 outline-none focus:border-blue-500"
                name="assetType"
                id="assetType"
              >
                <option value="">Select</option>
                <option value="New">New</option>
                <option value="Old">Old</option>
                <option value="Refurbished">Refurbished</option>
                <option value="Damaged">Damaged</option>
                <option value="Provident by Landlord">
                  Provident by Landlord
                </option>
                <option value="N/A">N/A</option>
                <option value="Used">Used</option>
              </select>
            </div>
            <div className="flex items-center w-[46%]">
              <label
                htmlFor="assetType"
                className="w-[25%] text-xs font-semibold text-slate-600"
              >
                Asset Type
              </label>
              <select
                className="w-[65%] text-xs border-b-2 border-slate-300 p-2 outline-none focus:border-blue-500"
                name="supportType"
                id="supportType"
              >
                Support Type
                <option value="">Select</option>
                <option value="Under Warranty">Under Warranty</option>
                <option value="Under AMC">Under AMC</option>
                <option value="Out Of Support">Out Of Support</option>
              </select>
            </div>
          </div>
        </div>

        {/* Finance Information fields */}
        <div className="w-full p-8 bg-white rounded-md shadow-md">
          <h3 className="text-slate-700">Finance Information</h3>
          <div className="flex flex-wrap gap-6 justify-between mt-3">
            <div className="flex items-center w-[46%]">
              <label
                htmlFor="poNo"
                className="w-[25%] text-xs font-semibold text-slate-600"
              >
                PO No.
              </label>
              <input
                className="w-[65%] text-xs text-slate-600 border-b-2 border-slate-300 p-2 outline-none focus:border-blue-500"
                type="text"
                id="poNo"
                name="poNo"
              />
            </div>
            <div className="flex items-center w-[46%]">
              <label
                htmlFor="poDate"
                className="w-[25%] text-xs font-semibold text-slate-600"
              >
                PO Date
              </label>
              <input
                className="w-[65%] text-xs text-slate-600 border-b-2 border-slate-300 p-2 outline-none focus:border-blue-500"
                type="date"
                id="poDate"
                name="poDate"
              />
            </div>
            <div className="flex items-center w-[46%]">
              <label
                htmlFor="invoiceNo"
                className="w-[25%] text-xs font-semibold text-slate-600"
              >
                Invoice No.
              </label>
              <input
                className="w-[65%] text-xs text-slate-600 border-b-2 border-slate-300 p-2 outline-none focus:border-blue-500"
                type="text"
                id="invoiceNo"
                name="invoiceNo"
              />
            </div>
            <div className="flex items-center w-[46%]">
              <label
                htmlFor="invoiceDate"
                className="w-[25%] text-xs font-semibold text-slate-600"
              >
                Invoice Date
              </label>
              <input
                className="w-[65%] text-xs text-slate-600 border-b-2 border-slate-300 p-2 outline-none focus:border-blue-500"
                type="date"
                id="invoiceDate"
                name="invoiceDate"
              />
            </div>
            <div className="flex items-center w-[46%]">
              <label
                htmlFor="assetCost"
                className="w-[25%] text-xs font-semibold text-slate-600"
              >
                Asset Cost
              </label>
              <input
                className="w-[65%] text-xs text-slate-600 border-b-2 border-slate-300 p-2 outline-none focus:border-blue-500"
                type="number"
                placeholder="(INR)"
                id="assetCost"
                name="assetCost"
              />
            </div>
            <div className="flex items-center w-[46%]">
              <label
                htmlFor="residualCost"
                className="w-[25%] text-xs font-semibold text-slate-600"
              >
                Residual Cost
              </label>
              <input
                className="w-[65%] text-xs text-slate-600 border-b-2 border-slate-300 p-2 outline-none focus:border-blue-500"
                type="number"
                placeholder="(INR)"
                id="residualCost"
                name="residualCost"
              />
            </div>
            <div className="flex items-center w-[46%]">
              <label
                htmlFor="assetLife"
                className="w-[25%] text-xs font-semibold text-slate-600"
              >
                Asset Life
              </label>
              <input
                className="w-[65%] text-xs text-slate-600 border-b-2 border-slate-300 p-2 outline-none focus:border-blue-500"
                type="number"
                placeholder="(YEARS)"
                id="assetLife"
                name="assetLife"
              />
            </div>
            <div className="flex items-center w-[46%]">
              <label
                htmlFor="assetLife"
                className="w-[25%] text-xs font-semibold text-slate-600"
              >
                Depreciation(%)
              </label>
              <input
                className="w-[65%] text-xs text-slate-600 border-b-2 border-slate-300 p-2 outline-none focus:border-blue-500"
                type="number"
                placeholder="(0.0)"
                id="assetLife"
                name="assetLife"
              />
            </div>
            <div className="flex items-center w-[46%]">
              <label
                htmlFor="hsnCode"
                className="w-[25%] text-xs font-semibold text-slate-600"
              >
                HSN Code
              </label>
              <input
                className="w-[65%] text-xs text-slate-600 border-b-2 border-slate-300 p-2 outline-none focus:border-blue-500"
                type="text"
                id="hsnCode"
                name="hsnCode"
              />
            </div>
            <div className="flex items-center w-[46%]">
              <label
                htmlFor="costCenter"
                className="w-[25%] text-xs font-semibold text-slate-600"
              >
                Cost Center
              </label>
              <select
                className="w-[65%] text-xs border-b-2 border-slate-300 p-2 outline-none focus:border-blue-500"
                name="costCenter"
                id="costCenter"
              >
                <option value="">Select</option>
                <option value="N/A">N/A</option>
              </select>
            </div>
          </div>
        </div>

        {/* Preventive Maintenance fields */}
        <div className="w-full p-8 bg-white rounded-md shadow-md">
          <h3 className="text-slate-700">Preventive Maintenance</h3>
          <div className="flex flex-wrap gap-6 justify-between mt-3">
            <div className="flex items-center w-[46%]">
              <label
                htmlFor="pmCycle"
                className="w-[25%] text-xs font-semibold text-slate-600"
              >
                PM Cycle
              </label>
              <input
                className="w-[65%] text-xs text-slate-600 border-b-2 border-slate-300 p-2 outline-none focus:border-blue-500"
                type="number"
                placeholder="Np. of Days"
                id="pmCycle"
                name="pmCycle"
              />
            </div>
            <div className="flex items-center w-[46%]">
              <label
                htmlFor="pmCycle"
                className="w-[25%] text-xs font-semibold text-slate-600"
              >
                PM Cycle
              </label>
              <div className="w-[65%] flex flex-col gap-2 text-sm">
                <div className="flex items-center gap-2">
                  <input
                    type="radio"
                    value="From Actual PM Date"
                    id="pmCycle"
                    name="pmCycle"
                  />
                  From Actual PM Date
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="radio"
                    value="Fixed Schedule"
                    id="pmCycle"
                    name="pmCycle"
                  />
                  Fixed Schedule
                </div>
              </div>
            </div>
            <div className="flex items-center w-[46%]">
              <label
                htmlFor="istPmDate"
                className="w-[25%] text-xs font-semibold text-slate-600"
              >
                1st PM Date
              </label>
              <input
                className="w-[65%] text-xs text-slate-600 border-b-2 border-slate-300 p-2 outline-none focus:border-blue-500"
                type="date"
                id="istPmDate"
                name="istPmDate"
              />
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddFixedAssets;
