import { useState } from "react";

interface BackgroundProps {
  children: React.ReactNode;
  showPinPage?: boolean;
}

const Background: React.FC<BackgroundProps> = ({ children, showPinPage = false }) => {
  const [showBookMark, setShowBookMark] = useState(false);

  return (
    <div className="bg-gray-300 h-full flex items-center">
      <div
        className={`bg-gray-100 h-full md:w-[90%] z-10 ${
          showBookMark ? "w-[85%]" : "w-full"
        }`}
        style={{
          boxShadow: "1px 0 12px 0 rgba(0,0,0,0.4)",
        }}
      >
        <div
          className={`bg-gray-100 h-full md:w-[99.5%] z-10 ${
            showBookMark ? "w-[99.5%]" : "w-full"
          }`}
          style={{
            boxShadow: "1px 0 12px 0 rgba(0,0,0,0.4)",
          }}
        >
          <div
            className={`bg-gray-100 h-full md:w-[99.5%] z-10 relative ${
              showBookMark ? "w-[99.5%]" : "w-full"
            }`}
            style={{
              boxShadow: "1px 0 12px 0 rgba(0,0,0,0.4)",
            }}
          >
            {children}

            {/* 접힌 종이 효과 - 모바일에서만, showPinPage가 false일 때만 */}
            {!showPinPage && (
              <div
                className="md:hidden absolute bottom-0 right-0 cursor-pointer"
                onClick={() => setShowBookMark(!showBookMark)}
              >
                <div className="absolute bottom-0 right-0 w-12 h-12 bg-[#fafaf8] shadow-lg z-10"></div>
                <div className="absolute bottom-0 right-0 w-0 h-0 border-l-[48px] border-l-transparent border-b-[48px] border-b-gray-300 z-20"></div>
                <div className="absolute bottom-0 right-0 w-0 h-0 border-l-[42px] border-l-transparent border-b-[42px] border-b-gray-200 z-30"></div>
                <div className="absolute bottom-0 right-0 w-0 h-0 border-l-[36px] border-l-transparent border-b-[36px] border-b-gray-100 z-40"></div>
                <div className="absolute bottom-0 right-0 w-0 h-0 border-l-[30px] border-l-transparent border-b-[30px] border-b-[#fafaf8] z-50"></div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Background;
