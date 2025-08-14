import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleLeft } from "@fortawesome/free-solid-svg-icons";

type MobilePinListProps = {
  setShowMobilePinList: (value: boolean) => void;
};

const MobilePinList = ({ setShowMobilePinList }: MobilePinListProps) => {
  return (
    <div className="w-full h-full bg-[#fafaf8] flex md:hidden">
      <div className="w-full h-full flex flex-col">
        {/* 헤더 영역 */}
        <div className="w-full flex items-center justify-between p-3 mt-3">
          <FontAwesomeIcon
            icon={faAngleLeft}
            className="text-xl cursor-pointer"
            onClick={() => setShowMobilePinList(false)}
          />
          <span className="absolute left-1/2 text-lg transform -translate-x-1/2">
            핀 선택
          </span>
          <div className="w-6"></div>
        </div>
        {/* 내용 영역 */}
        <div className="flex-1 p-3 overflow-y-auto">
          <div className="grid grid-cols-2 gap-3">
            {/* 핀 아이템 1 */}
            <div className="w-full flex items-center p-2">
              <div className="relative mr-2">
                <div className="bg-gray-300 w-16 h-16 absolute -top-1 left-1"></div>
                <div className="bg-white w-16 h-16 relative z-10"></div>
              </div>
              <div className="flex flex-col items-start">
                <div className="flex items-center gap-1">
                  <div className="w-5 h-5 bg-gray-200 rounded-full mr-1"></div>
                  <span className="text-xs">UserName1</span>
                </div>
                <span className="text-xs mt-1">2025.11.12</span>
                <span className="text-xs mt-1">PinName1</span>
              </div>
            </div>

            {/* 핀 아이템 2 */}
            <div className="w-full flex items-center p-2">
              <div className="relative mr-2">
                <div className="bg-gray-300 w-16 h-16 absolute -top-1 left-1"></div>
                <div className="bg-white w-16 h-16 relative z-10"></div>
              </div>
              <div className="flex flex-col items-start">
                <div className="flex items-center gap-1">
                  <div className="w-5 h-5 bg-gray-200 rounded-full mr-1"></div>
                  <span className="text-xs">UserName2</span>
                </div>
                <span className="text-xs mt-1">2025.11.13</span>
                <span className="text-xs mt-1">PinName2</span>
              </div>
            </div>

            {/* 핀 아이템 3 */}
            <div className="w-full flex items-center p-2">
              <div className="relative mr-2">
                <div className="bg-gray-300 w-16 h-16 absolute -top-1 left-1"></div>
                <div className="bg-white w-16 h-16 relative z-10"></div>
              </div>
              <div className="flex flex-col items-start">
                <div className="flex items-center gap-1">
                  <div className="w-5 h-5 bg-gray-200 rounded-full mr-1"></div>
                  <span className="text-xs">UserName3</span>
                </div>
                <span className="text-xs mt-1">2025.11.14</span>
                <span className="text-xs mt-1">PinName3</span>
              </div>
            </div>

            {/* 핀 아이템 4 */}
            <div className="w-full flex items-center p-2">
              <div className="relative mr-2">
                <div className="bg-gray-300 w-16 h-16 absolute -top-1 left-1"></div>
                <div className="bg-white w-16 h-16 relative z-10"></div>
              </div>
              <div className="flex flex-col items-start">
                <div className="flex items-center gap-1">
                  <div className="w-5 h-5 bg-gray-200 rounded-full mr-1"></div>
                  <span className="text-xs">UserName4</span>
                </div>
                <span className="text-xs mt-1">2025.11.15</span>
                <span className="text-xs mt-1">PinName4</span>
              </div>
            </div>

            {/* 핀 아이템 5 */}
            <div className="w-full flex items-center p-2">
              <div className="relative mr-2">
                <div className="bg-gray-300 w-16 h-16 absolute -top-1 left-1"></div>
                <div className="bg-white w-16 h-16 relative z-10"></div>
              </div>
              <div className="flex flex-col items-start">
                <div className="flex items-center gap-1">
                  <div className="w-5 h-5 bg-gray-200 rounded-full mr-1"></div>
                  <span className="text-xs">UserName5</span>
                </div>
                <span className="text-xs mt-1">2025.11.16</span>
                <span className="text-xs mt-1">PinName5</span>
              </div>
            </div>

            {/* 핀 아이템 6 */}
            <div className="w-full flex items-center p-2">
              <div className="relative mr-2">
                <div className="bg-gray-300 w-16 h-16 absolute -top-1 left-1"></div>
                <div className="bg-white w-16 h-16 relative z-10"></div>
              </div>
              <div className="flex flex-col items-start">
                <div className="flex items-center gap-1">
                  <div className="w-5 h-5 bg-gray-200 rounded-full mr-1"></div>
                  <span className="text-xs">UserName6</span>
                </div>
                <span className="text-xs mt-1">2025.11.17</span>
                <span className="text-xs mt-1">PinName6</span>
              </div>
            </div>

            {/* 핀 아이템 7 */}
            <div className="w-full flex items-center p-2">
              <div className="relative mr-2">
                <div className="bg-gray-300 w-16 h-16 absolute -top-1 left-1"></div>
                <div className="bg-white w-16 h-16 relative z-10"></div>
              </div>
              <div className="flex flex-col items-start">
                <div className="flex items-center gap-1">
                  <div className="w-5 h-5 bg-gray-200 rounded-full mr-1"></div>
                  <span className="text-xs">UserName7</span>
                </div>
                <span className="text-xs mt-1">2025.11.18</span>
                <span className="text-xs mt-1">PinName7</span>
              </div>
            </div>

            {/* 핀 아이템 8 */}
            <div className="w-full flex items-center p-2">
              <div className="relative mr-2">
                <div className="bg-gray-300 w-16 h-16 absolute -top-1 left-1"></div>
                <div className="bg-white w-16 h-16 relative z-10"></div>
              </div>
              <div className="flex flex-col items-start">
                <div className="flex items-center gap-1">
                  <div className="w-5 h-5 bg-gray-200 rounded-full mr-1"></div>
                  <span className="text-xs">UserName8</span>
                </div>
                <span className="text-xs mt-1">2025.11.19</span>
                <span className="text-xs mt-1">PinName8</span>
              </div>
            </div>

            {/* 핀 아이템 9 */}
            <div className="w-full flex items-center p-2">
              <div className="relative mr-2">
                <div className="bg-gray-300 w-16 h-16 absolute -top-1 left-1"></div>
                <div className="bg-white w-16 h-16 relative z-10"></div>
              </div>
              <div className="flex flex-col items-start">
                <div className="flex items-center gap-1">
                  <div className="w-5 h-5 bg-gray-200 rounded-full mr-1"></div>
                  <span className="text-xs">UserName9</span>
                </div>
                <span className="text-xs mt-1">2025.11.20</span>
                <span className="text-xs mt-1">PinName9</span>
              </div>
            </div>

            {/* 핀 아이템 10 */}
            <div className="w-full flex items-center p-2">
              <div className="relative mr-2">
                <div className="bg-gray-300 w-16 h-16 absolute -top-1 left-1"></div>
                <div className="bg-white w-16 h-16 relative z-10"></div>
              </div>
              <div className="flex flex-col items-start">
                <div className="flex items-center gap-1">
                  <div className="w-5 h-5 bg-gray-200 rounded-full mr-1"></div>
                  <span className="text-xs">UserName10</span>
                </div>
                <span className="text-xs mt-1">2025.11.21</span>
                <span className="text-xs mt-1">PinName10</span>
              </div>
            </div>

            {/* 핀 아이템 11 */}
            <div className="w-full flex items-center p-2">
              <div className="relative mr-2">
                <div className="bg-gray-300 w-16 h-16 absolute -top-1 left-1"></div>
                <div className="bg-white w-16 h-16 relative z-10"></div>
              </div>
              <div className="flex flex-col items-start">
                <div className="flex items-center gap-1">
                  <div className="w-5 h-5 bg-gray-200 rounded-full mr-1"></div>
                  <span className="text-xs">UserName11</span>
                </div>
                <span className="text-xs mt-1">2025.11.22</span>
                <span className="text-xs mt-1">PinName11</span>
              </div>
            </div>

            {/* 핀 아이템 12 */}
            <div className="w-full flex items-center p-2">
              <div className="relative mr-2">
                <div className="bg-gray-300 w-16 h-16 absolute -top-1 left-1"></div>
                <div className="bg-white w-16 h-16 relative z-10"></div>
              </div>
              <div className="flex flex-col items-start">
                <div className="flex items-center gap-1">
                  <div className="w-5 h-5 bg-gray-200 rounded-full mr-1"></div>
                  <span className="text-xs">UserName12</span>
                </div>
                <span className="text-xs mt-1">2025.11.23</span>
                <span className="text-xs mt-1">PinName12</span>
              </div>
            </div>

            {/* 핀 아이템 13 */}
            <div className="w-full flex items-center p-2">
              <div className="relative mr-2">
                <div className="bg-gray-300 w-16 h-16 absolute -top-1 left-1"></div>
                <div className="bg-white w-16 h-16 relative z-10"></div>
              </div>
              <div className="flex flex-col items-start">
                <div className="flex items-center gap-1">
                  <div className="w-5 h-5 bg-gray-200 rounded-full mr-1"></div>
                  <span className="text-xs">UserName13</span>
                </div>
                <span className="text-xs mt-1">2025.11.24</span>
                <span className="text-xs mt-1">PinName13</span>
              </div>
            </div>

            {/* 핀 아이템 14 */}
            <div className="w-full flex items-center p-2">
              <div className="relative mr-2">
                <div className="bg-gray-300 w-16 h-16 absolute -top-1 left-1"></div>
                <div className="bg-white w-16 h-16 relative z-10"></div>
              </div>
              <div className="flex flex-col items-start">
                <div className="flex items-center gap-1">
                  <div className="w-5 h-5 bg-gray-200 rounded-full mr-1"></div>
                  <span className="text-xs">UserName14</span>
                </div>
                <span className="text-xs mt-1">2025.11.25</span>
                <span className="text-xs mt-1">PinName14</span>
              </div>
            </div>

            {/* 핀 아이템 15 */}
            <div className="w-full flex items-center p-2">
              <div className="relative mr-2">
                <div className="bg-gray-300 w-16 h-16 absolute -top-1 left-1"></div>
                <div className="bg-white w-16 h-16 relative z-10"></div>
              </div>
              <div className="flex flex-col items-start">
                <div className="flex items-center gap-1">
                  <div className="w-5 h-5 bg-gray-200 rounded-full mr-1"></div>
                  <span className="text-xs">UserName15</span>
                </div>
                <span className="text-xs mt-1">2025.11.26</span>
                <span className="text-xs mt-1">PinName15</span>
              </div>
            </div>

            {/* 핀 아이템 16 */}
            <div className="w-full flex items-center p-2">
              <div className="relative mr-2">
                <div className="bg-gray-300 w-16 h-16 absolute -top-1 left-1"></div>
                <div className="bg-white w-16 h-16 relative z-10"></div>
              </div>
              <div className="flex flex-col items-start">
                <div className="flex items-center gap-1">
                  <div className="w-5 h-5 bg-gray-200 rounded-full mr-1"></div>
                  <span className="text-xs">UserName16</span>
                </div>
                <span className="text-xs mt-1">2025.11.27</span>
                <span className="text-xs mt-1">PinName16</span>
              </div>
            </div>

            {/* 핀 아이템 17 */}
            <div className="w-full flex items-center p-2">
              <div className="relative mr-2">
                <div className="bg-gray-300 w-16 h-16 absolute -top-1 left-1"></div>
                <div className="bg-white w-16 h-16 relative z-10"></div>
              </div>
              <div className="flex flex-col items-start">
                <div className="flex items-center gap-1">
                  <div className="w-5 h-5 bg-gray-200 rounded-full mr-1"></div>
                  <span className="text-xs">UserName17</span>
                </div>
                <span className="text-xs mt-1">2025.11.28</span>
                <span className="text-xs mt-1">PinName17</span>
              </div>
            </div>

            {/* 핀 아이템 18 */}
            <div className="w-full flex items-center p-2">
              <div className="relative mr-2">
                <div className="bg-gray-300 w-16 h-16 absolute -top-1 left-1"></div>
                <div className="bg-white w-16 h-16 relative z-10"></div>
              </div>
              <div className="flex flex-col items-start">
                <div className="flex items-center gap-1">
                  <div className="w-5 h-5 bg-gray-200 rounded-full mr-1"></div>
                  <span className="text-xs">UserName18</span>
                </div>
                <span className="text-xs mt-1">2025.11.29</span>
                <span className="text-xs mt-1">PinName18</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobilePinList;
