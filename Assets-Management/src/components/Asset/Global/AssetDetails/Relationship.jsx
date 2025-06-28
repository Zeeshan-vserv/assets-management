import React, { useState } from "react";

function Relationship() {
  const [openRelationModal, setOpenRelationModal] = useState(false);

  return (
    <>
      <div className="w-[100%] h-[100vh] p-4 flex flex-col gap-4 bg-slate-200">
        <div className="flex justify-start items-center gap-4">
          <button
            onClick={() => setOpenRelationModal(true)}
            className="bg-[#6f7fbc] shadow-[#7a8bca] shadow-sm px-4 py-2 rounded-md text-sm text-white transition-all"
          >
            Add Relationship
          </button>
        </div>
        {openRelationModal && (
          <>
            <div className="fixed inset-0 bg-black/60 z-50 flex justify-center items-center">
              <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 animate-fade-in space-y-6">
                <h2 className="text-md font-semibold mb-6 text-start">
                  New Relation Map
                </h2>

                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setOpenRelationModal(false)}
                    className="bg-[#df656b] shadow-[#F26E75] shadow-md text-white px-4 py-2 rounded-lg transition-all text-sm font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-[#6f7fbc] shadow-[#7a8bca] shadow-md px-4 py-2 rounded-md text-sm text-white transition-all"
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default Relationship;
