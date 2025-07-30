import React from "react";

interface MobileDropDownProps {
  isVisible: boolean;
}

const MobileDropDown: React.FC<MobileDropDownProps> = ({ isVisible }) => {
  return (
    <div
      className={`bg-[#fafaf8] w-1/2 h-full z-50 absolute top-0 left-0 md:hidden transition-all duration-300 ease-in-out ${
        isVisible ? "translate-x-0" : "-translate-x-full"
      }`}
      style={{
        boxShadow: isVisible ? "1px 0 12px 0 rgba(0,0,0,0.4)" : "none",
      }}
    >
      <div className="flex justify-between items-center p-4">
        <span>드롭다운 내용</span>
      </div>
    </div>
  );
};

export default MobileDropDown;
