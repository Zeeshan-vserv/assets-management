import React, { useEffect, useRef, useState } from "react";
import { IoMdPrint } from "react-icons/io";
import { useParams } from "react-router-dom";
import dayjs from "dayjs";
import { useReactToPrint } from "react-to-print";
import { getGatePassById } from "../../../api/GatePassRequest";

const PrintGatePass = () => {
  const { id } = useParams();
  const componentRef = React.useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState("");

  const fetchGatePass = async () => {
    try {
      setIsLoading(true);
      const response = await getGatePassById(id);
      if (response.status !== 200) {
        throw new Error("Failed to fetch data");
      }
      setFormData(response?.data.data || {});
    } catch (error) {
      console.error("Error fetching gate pass:", error);
      toast.error("Failed to fetch gate pass data");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchGatePass();
    // eslint-disable-next-line
  }, []);

  const handleAfterPrint = React.useCallback(() => {
    console.log("`onAfterPrint` called");
  }, []);

  const handleBeforePrint = React.useCallback(() => {
    console.log("`onBeforePrint` called");
    return Promise.resolve();
  }, []);

  const printFn = useReactToPrint({
    contentRef: componentRef,
    documentTitle: "Purchase Order",
    onAfterPrint: handleAfterPrint,
    onBeforePrint: handleBeforePrint,
  });

  // console.log(formData);

  return (
    <div className="flex flex-col items-center w-screen">
      <div className="flex justify-end my-5">
        <button
          className="flex items-center  gap-1 ml-3 bg-blue-400 text-white px-5 py-0.5 rounded-sm hover:scale-105"
          onClick={printFn}
        >
          Print <IoMdPrint />
        </button>
      </div>
      <div
        className="flex justify-center items-center w-full"
        ref={componentRef}
      >
        <div className="bg-white shadow-md max-w-3xl px-14 py-5 print-full-width">
          {/* Company Logo and Name */}
          <div className="flex items-center justify-center">
            <img
              src="https://imgs.search.brave.com/SN6lyBrHVvZnaxrJMFCqiBcfjfWEVf_nupx989oM6YQ/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9zdGF0/aWMudmVjdGVlenku/Y29tL3N5c3RlbS9y/ZXNvdXJjZXMvdGh1/bWJuYWlscy8wMjMv/NjcxLzcxNC9zbWFs/bC9hZ3JpY3VsdHVy/ZS1hbmQtZmluYW5j/ZS1pbmR1c3RyeS1i/YXNlZC1jb2xvcmZ1/bC1sb2dvLWlsbHVz/dHJhdGlvbi13aXRo/LWR1bW15LXRleHQt/b24td2hpdGUtYmFj/a2dyb3VuZC12ZWN0/b3IuanBn"
              className="w-24 h-24  object-cover"
              alt="Logo"
            />
            <div>
              <h1 className="text-center text-2xl font-bold mt-4">Gate Pass</h1>
              <h2 className="text-center text-lg mt-2">Company Name Here</h2>
            </div>
          </div>
          {/* Gate Pass Details */}
          <div className="mt-16">
            <div className="flex justify-between">
              <div className="flex gap-2 text-base">
                <span className="font-bold">Gate Pass Id :</span>
                {formData?.gatePassId || ""}
              </div>
              <div className="flex gap-2 text-base">
                <span className="font-bold">Dated :</span>
                {formData?.createdAt
                  ? dayjs(formData.createdAt).format("DD-MM-YYYY")
                  : ""}{" "}
              </div>
            </div>
            <div className="flex justify-between">
              <div className="flex gap-2 text-base">
                <span className="font-bold">Gate Pass Type :</span>
                {formData?.gatePassType || ""}
              </div>
              <div className="flex gap-2 text-base">
                <span className="font-bold">Expected Return :</span>{" "}
                {formData?.expectedReturnDate === null
                  ? "N/A"
                  : dayjs(formData.expectedReturnDate).format("DD-MM-YYYY")}
              </div>
            </div>

            <div className="mt-10 text-justify">
              Dear Security, <br /> Please allow following items to be sent from{" "}
              {formData?.fromAddress} to {formData?.toAddress} for the purpose
              of {formData?.purpose || "N/A"}.
            </div>
          </div>
          {/* Asset Details */}
          <div className="mt-10">
            <table className="">
              <thead>
                <tr className="">
                  <th className="border px-4 py-2">S.No</th>
                  <th className="border px-4 py-2">Asset Type</th>
                  <th className="border px-4 py-2">Make</th>
                  <th className="border px-4 py-2">Model</th>
                  <th className="border px-4 py-2">Serial Number</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border px-4 py-2">1</td>
                  <td className="border px-4 py-2">Laptop</td>
                  <td className="border px-4 py-2">HP</td>
                  <td className="border px-4 py-2">ELITE 8200 </td>
                  <td className="border px-4 py-2">IN1A42WJ5Q</td>
                </tr>
                <tr>
                  <td className="border px-4 py-2">2</td>
                  <td className="border px-4 py-2">Laptop</td>
                  <td className="border px-4 py-2">HP</td>
                  <td className="border px-4 py-2">ELITE 8200 </td>
                  <td className="border px-4 py-2">IN1A42WJ5Q</td>
                </tr>
                <tr>
                  <td className="border px-4 py-2">3</td>
                  <td className="border px-4 py-2">Laptop</td>
                  <td className="border px-4 py-2">HP</td>
                  <td className="border px-4 py-2">ELITE 8200 </td>
                  <td className="border px-4 py-2">IN1A42WJ5Q</td>
                </tr>
                <tr>
                  <td className="border px-4 py-2">4</td>
                  <td className="border px-4 py-2">Laptop</td>
                  <td className="border px-4 py-2">HP</td>
                  <td className="border px-4 py-2">ELITE 8200 </td>
                  <td className="border px-4 py-2">IN1A42WJ5Q</td>
                </tr>
                <tr>
                  <td className="border px-4 py-2">5</td>
                  <td className="border px-4 py-2">Laptop</td>
                  <td className="border px-4 py-2">HP</td>
                  <td className="border px-4 py-2">ELITE 8200 </td>
                  <td className="border px-4 py-2">IN1A42WJ5Q</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Footer */}
          <div className="mt-10 flex flex-col gap-10">
            <div className="flex justify-between">
              <div className="w-[60%]">
                <span className="font-bold">Destination: -</span>
                <p>{formData?.toAddress}</p>
              </div>
              <div className="flex flex-col items-end">
                <span className="font-bold">Gate Pass Validity: -</span>
                <p>{dayjs(formData.gatePassValidity).format("DD-MM-YYYY")}</p>
              </div>
            </div>
            <div className="w-full flex ">
              <span className="font-bold min-w-[15%]">Reason: -</span>
              <p>{formData?.reasonForGatePass}</p>
            </div>
            <div className="w-full flex">
              <span className="font-bold min-w-[15%]">Remark: -</span>
              <p>{formData?.remarks}</p>
            </div>

            <div className="flex justify-between my-5">
              <div className="w-[60%]">
                <span className="font-bold">To Be Received By: -</span>
                <p>
                  <span className="font-semibold">Contact Name - </span> SUDHIR
                  KUMAR
                </p>
                <p>
                  <span className="font-semibold">Contact No. - </span>{" "}
                  {formData?.receiverNo}
                </p>
              </div>
              <div className="flex flex-col items-end">
                <span className="font-bold">Issued By:</span>
                <p>Company Name Here</p>
              </div>
            </div>

            <div className="flex justify-between">
              <div className="w-[60%]">
                <span className="font-bold">From: -</span>
                <p>
                   {formData?.fromAddress}
                </p>
              </div>
              <div className="flex flex-col items-end">
                <span className="font-bold">(Approved By)</span>
                <p>Approver Name Here</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrintGatePass;
