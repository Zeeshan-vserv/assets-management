import { Autocomplete, TextField } from "@mui/material";
import React, { useState } from "react";
import { RxCrossCircled } from "react-icons/rx";

function AssetMapping({ assetMappingModal, setAssetMappingModal }) {
  const [isMapWithSerial, setIsMapWithSerial] = useState(false);
  const [hostName, setHostName] = useState("");
  const [serialNumber, setSerialNumber] = useState("");

  const handleSave = () => {
    if (isMapWithSerial) {
      console.log("Saving Serial Number:", serialNumber);
    } else {
      console.log("Saving Host Name:", hostName);
    }
    setAssetMappingModal(false);
    setIsMapWithSerial(false);
  };

  const handleRemove = () => {
    if (isMapWithSerial) {
      console.log("Removing Serial Number:", serialNumber);
    } else {
      console.log("Removing Host Name:", hostName);
    }
    setAssetMappingModal(false);
    setIsMapWithSerial(false);
  };

  const handleUpdate = () => {
    if (isMapWithSerial) {
      console.log("Updating Serial Number:", serialNumber);
    } else {
      console.log("Updating Host Name:", hostName);
    }
    setAssetMappingModal(false);
    setIsMapWithSerial(false);
  };

  const assetMappingHandler = (e) => {
    e.preventDefault();
    handleSave();
  };

  return (
    <>
      {assetMappingModal && (
        <>
          <div className="fixed inset-0 bg-black/60 z-50 flex justify-center items-center">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 animate-fade-in space-y-6 relative">
              <RxCrossCircled
                size={26}
                className="absolute top-4 right-4 cursor-pointer text-blue-600"
                onClick={() => setAssetMappingModal(false)}
              />

              <h2 className="text-md font-semibold mb-6 text-start">
                FIXED ASSETS MAPPING
              </h2>
              <form className="space-y-2" onSubmit={assetMappingHandler}>
                <div className="space-y-4">
                  <div className="flex items-start gap-2">
                    <input
                      type="checkbox"
                      checked={isMapWithSerial}
                      onChange={(e) => setIsMapWithSerial(e.target.checked)}
                    />
                    <label className="w-40 text-sm font-medium text-gray-500">
                      Map with Serial Number
                    </label>
                  </div>
                </div>
                <div className="space-y-4">
                  {!isMapWithSerial && (
                    <div className="flex items-start gap-2">
                      <Autocomplete
                        className="w-[100%]"
                        options={["ZSD", "ZSD_SRISHTI", "JSD_JANVI"]}
                        getOptionLabel={(option) => option}
                        value={hostName}
                        onChange={(e, newValue) => setHostName(newValue || "")}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            variant="standard"
                            className="text-xs text-slate-600"
                            placeholder="Select Host Name"
                            inputProps={{
                              ...params.inputProps,
                              style: { fontSize: "0.8rem" },
                            }}
                          />
                        )}
                      />
                    </div>
                  )}
                  {isMapWithSerial && (
                    <div className="flex items-center gap-2">
                      <Autocomplete
                        className="w-[100%]"
                        options={["210J3", "F6Z5C63"]}
                        getOptionLabel={(option) => option}
                        value={serialNumber}
                        onChange={(e, newValue) =>
                          setSerialNumber(newValue || "")
                        }
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            variant="standard"
                            className="text-xs text-slate-600"
                            placeholder="Select Serial Number"
                            inputProps={{
                              ...params.inputProps,
                              style: { fontSize: "0.8rem" },
                            }}
                          />
                        )}
                      />
                    </div>
                  )}
                </div>
                <div className="flex justify-end gap-3 pt-4">
                  {isMapWithSerial ? (
                    <>
                      <button
                        type="button"
                        onClick={handleRemove}
                        className="bg-[#df656b] shadow-[#F26E75] shadow-md text-white px-4 py-2 rounded-lg transition-all text-sm font-medium"
                      >
                        Remove
                      </button>
                      <button
                        type="submit"
                        className="bg-[#6f7fbc] shadow-[#7a8bca] shadow-md px-4 py-2 rounded-md text-sm text-white transition-all"
                      >
                        Save
                      </button>
                      <button
                        type="submit"
                        onClick={handleUpdate}
                        className="bg-[#6f7fbc] shadow-[#7a8bca] shadow-md px-4 py-2 rounded-md text-sm text-white transition-all"
                      >
                        Update
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        type="submit"
                        className="bg-[#6f7fbc] shadow-[#7a8bca] shadow-md px-4 py-2 rounded-md text-sm text-white transition-all"
                      >
                        Save
                      </button>
                      <button
                        type="button"
                        onClick={handleRemove}
                        className="bg-[#df656b] shadow-[#F26E75] shadow-md text-white px-4 py-2 rounded-lg transition-all text-sm font-medium"
                      >
                        Remove
                      </button>
                      <button
                        type="submit"
                        onClick={handleUpdate}
                        className="bg-[#6f7fbc] shadow-[#7a8bca] shadow-md px-4 py-2 rounded-md text-sm text-white transition-all"
                      >
                        Update
                      </button>
                    </>
                  )}
                </div>
              </form>
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default AssetMapping;
