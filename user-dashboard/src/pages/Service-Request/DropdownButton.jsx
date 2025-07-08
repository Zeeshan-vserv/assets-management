import React, { useState } from "react";
import { AiOutlinePlusCircle } from "react-icons/ai";
import { GrSubtractCircle } from "react-icons/gr";
import { useNavigate } from "react-router-dom";

const DropdownButton = ({ label, level = 1, children = [], path }) => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const toggleOpen = () => setIsOpen(!isOpen);

  const handleClick = () => {
    if (level === 3 && path) {
      navigate(path);
    }
  };

  return (
    <div className="mt-0.5 w-full">
      {(level === 1 || level === 2) && (
        <button
          type="button"
          onClick={toggleOpen}
          className="w-full flex justify-between items-center px-3 py-1 border-2 border-[#4397F3] rounded-sm cursor-pointer text-left"
        >
          <span className="text-gray-700 font-medium text-md">
            {label} {level === 1 ? `(${children.length})` : ""}
          </span>
          {isOpen ? (
            <GrSubtractCircle size={20} className="text-green-700" />
          ) : (
            <AiOutlinePlusCircle size={20} className="text-red-700" />
          )}
        </button>
      )}

      {level === 3 && (
        <div
          onClick={handleClick}
          className="w-full px-3 py-1 text-gray-700 font-medium text-md cursor-pointer hover:underline"
        >
          {label}
        </div>
      )}

      {isOpen && children.length > 0 && level < 3 && (
        <div>
          {children.map((child, index) => (
            <DropdownButton
              key={index}
              label={child.label}
              level={level + 1}
              children={child.children || []}
              path={child.path}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default DropdownButton;
