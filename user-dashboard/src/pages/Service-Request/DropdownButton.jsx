import React, { useState } from "react";
import { AiOutlinePlusCircle } from "react-icons/ai";
import { GrSubtractCircle } from "react-icons/gr";

const DropdownButton = ({ label, level = 1 }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleOpen = () => setIsOpen(!isOpen);

  return (
    <div className="mt-0.5 w-full">
      {/* Level 1: Show label + ({}) + icons + border */}
      {level === 1 && (
        <button
          type="button"
          onClick={toggleOpen}
          className="w-full flex justify-between items-center px-3 py-1 border-2 border-[#4397F3] rounded-sm cursor-pointer text-left"
        >
          <span className="text-gray-700 font-medium text-md">
            {label} ({})
          </span>
          {isOpen ? (
            <GrSubtractCircle size={20} className="text-green-700" />
          ) : (
            <AiOutlinePlusCircle size={20} className="text-red-700" />
          )}
        </button>
      )}

      {/* Level 2: Show only label + icons + border (no count) */}
      {level === 2 && (
        <button
          type="button"
          onClick={toggleOpen}
          className="w-full flex justify-between items-center px-3 py-1 border-2 border-[#4397F3] rounded-sm cursor-pointer text-left"
        >
          <span className="text-gray-700 font-medium text-md">{label}</span>
          {isOpen ? (
            <GrSubtractCircle size={20} className="text-green-700" />
          ) : (
            <AiOutlinePlusCircle size={20} className="text-red-700" />
          )}
        </button>
      )}

      {/* Level 3: Plain text, no button, no icon */}
      {level === 3 && (
        <div className="w-full px-3 py-1 text-gray-700 font-medium text-md">
          {label}
        </div>
      )}

      {/* Render next level only if open and level < 3 */}
      {isOpen && level < 3 && (
        <DropdownButton
          label={
            level === 1
              ? "Application Provisioning"
              : level === 2
              ? "Thirst Button"
              : ""
          }
          level={level + 1}
        />
      )}
    </div>
  );
};

export default DropdownButton;
