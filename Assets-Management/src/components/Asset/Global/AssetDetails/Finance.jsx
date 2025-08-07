import { TextField } from "@mui/material";
import React, { useState } from "react";

function Finance({ id }) {
  const [data, setData] = useState([]);
  const [financeModal, setFinanceModal] = useState(false);
  const [editAmount, setEditAmount] = useState({ amount: "" });
  // console.log("id", id);

  const updateLossChangeHandler = (e) => {
    const { name, value } = e.target;
    setEditAmount((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const openEditModal = (e) => {
    e.preventDefault();
    setEditAmount({
      _id: id,
      amount: "",
    });
    setFinanceModal(true);
  };

  const updateLossHandler = (e) => {
    e.preventDefault();
    //call api
    // console.log("Updating amount:", editAmount);
    setData(
      data.map((item) =>
        item._id === id ? { ...item, amount: editAmount.amount } : item
      )
    );
    setFinanceModal(true);
  };

  return (
    <>
      <div className="w-[100%] h-[100vh] p-4 flex flex-col gap-4 bg-slate-200">
        <div className="flex justify-end items-center gap-4">
          <button
            onClick={openEditModal}
            className="bg-[#6f7fbc] shadow-[#7a8bca] shadow-sm px-4 py-2 rounded-md text-sm text-white transition-all"
          >
            Update Loss/Reversal
          </button>
        </div>
        <div className="overflow-x-auto bg-white shadow-sm rounded-lg p-4">
          <table className="min-w-full table-auto border-separate border-spacing-y-2">
            <tr className="bg-gray-50 hover:bg-gray-100 rounded">
              <th className="text-left text-sm px-4 py-2 text-gray-700 w-1/2">
                Asset Cost
              </th>
              <td className="px-4 py-2 text-sm text-gray-900">null</td>
            </tr>
            <tr className="bg-gray-50 hover:bg-gray-100 rounded">
              <th className="text-left text-sm px-4 py-2 text-gray-700 w-1/2">
                Components Cost
              </th>
              <td className="px-4 py-2 text-sm text-gray-900">0</td>
            </tr>
            <tr className="bg-gray-50 hover:bg-gray-100 rounded">
              <th className="text-left text-sm px-4 py-2 text-gray-700 w-1/2">
                Current Cost (SLM)
              </th>
              <td className="px-4 py-2 text-sm text-gray-900">null</td>
            </tr>
            <tr className="bg-gray-50 hover:bg-gray-100 rounded">
              <th className="text-left text-sm px-4 py-2 text-gray-700 w-1/2">
                Current Cost (WDV)
              </th>
              <td className="px-4 py-2 text-sm text-gray-900">null</td>
            </tr>
            <tr className="bg-gray-50 hover:bg-gray-100 rounded">
              <th className="text-left text-sm px-4 py-2 text-gray-700 w-1/2">
                Residual Cost
              </th>
              <td className="px-4 py-2 text-sm text-gray-900">null</td>
            </tr>
            <tr className="bg-gray-50 hover:bg-gray-100 rounded">
              <th className="text-left text-sm px-4 py-2 text-gray-700 w-1/2">
                Asset Life
              </th>
              <td className="px-4 py-2 text-sm text-gray-900">3</td>
            </tr>
            <tr className="bg-gray-50 hover:bg-gray-100 rounded">
              <th className="text-left text-sm px-4 py-2 text-gray-700 w-1/2">
                Depreciation (%)
              </th>
              <td className="px-4 py-2 text-sm text-gray-900">33</td>
            </tr>
            <tr className="bg-gray-50 hover:bg-gray-100 rounded">
              <th className="text-left text-sm px-4 py-2 text-gray-700 w-1/2">
                Loss/Reversal
              </th>
              <td className="px-4 py-2 text-sm text-gray-900">0</td>
            </tr>
            <tr className="bg-gray-50 hover:bg-gray-100 rounded">
              <th className="text-left text-sm px-4 py-2 text-gray-700 w-1/2">
                PO No.
              </th>
              <td className="px-4 py-2 text-sm text-gray-900">0</td>
            </tr>
            <tr className="bg-gray-50 hover:bg-gray-100 rounded">
              <th className="text-left text-sm px-4 py-2 text-gray-700 w-1/2">
                PO Date
              </th>
              <td className="px-4 py-2 text-sm text-gray-900">Invalid</td>
            </tr>
            <tr className="bg-gray-50 hover:bg-gray-100 rounded">
              <th className="text-left text-sm px-4 py-2 text-gray-700 w-1/2">
                Invoice No.
              </th>
              <td className="px-4 py-2 text-sm text-gray-900">12</td>
            </tr>
            <tr className="bg-gray-50 hover:bg-gray-100 rounded">
              <th className="text-left text-sm px-4 py-2 text-gray-700 w-1/2">
                Invoice Date
              </th>
              <td className="px-4 py-2 text-sm text-gray-900">Invalid</td>
            </tr>
            <tr className="bg-gray-50 hover:bg-gray-100 rounded">
              <th className="text-left text-sm px-4 py-2 text-gray-700 w-1/2">
                Vendor
              </th>
              <td className="px-4 py-2 text-sm text-gray-900">N/A</td>
            </tr>
          </table>
        </div>
        {financeModal && (
          <>
            <div className="fixed inset-0 bg-black/60 z-50 flex justify-center items-center">
              <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 animate-fade-in space-y-6">
                <h2 className="text-sm font-semibold mb-6 text-start">
                  UPDATE ASSET LOSS/REVERSAL DETAILS
                </h2>
                <form onSubmit={updateLossHandler} className="space-y-2">
                  <div className="flex items-center gap-2">
                    <label className="w-40 text-sm font-medium text-gray-500">
                      Amount
                    </label>
                    <TextField
                      name="amount"
                      required
                      fullWidth
                      value={editAmount?.amount || ""}
                      onChange={updateLossChangeHandler}
                      variant="standard"
                      sx={{ width: 250 }}
                    />
                  </div>
                  <div className="flex justify-end gap-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setFinanceModal(false)}
                      className="bg-[#df656b] shadow-[#F26E75] shadow-md text-white px-4 py-2 rounded-lg transition-all text-sm font-medium"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="bg-[#6f7fbc] shadow-[#7a8bca] shadow-md px-4 py-2 rounded-md text-sm text-white transition-all"
                    >
                      Update
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default Finance;
