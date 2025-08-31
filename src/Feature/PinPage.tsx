import { faPencil, faLocationDot } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import PhotoFrame from "../common/PhotoFrame";
import { faTrashCan, faImage, faCalendar } from "@fortawesome/free-regular-svg-icons";
import { faBookmark as faSolidBookmark } from "@fortawesome/free-solid-svg-icons";
import { faBookmark as faRegularBookmark } from "@fortawesome/free-regular-svg-icons";
import { useState } from "react";

type PinPageProps = {
  selectedLocation: {
    address: string;
    lat: number;
    lng: number;
  } | null;
  onLocationEdit: () => void;
};

const PinPage = ({ selectedLocation, onLocationEdit }: PinPageProps) => {
  const [showBookMark, setShowBookMark] = useState(false);

  return (
    <div className="absolute top-0 left-0 w-full h-full bg-white z-10 flex flex-col items-center">
      <div
        className="w-full max-w-7xl px-5 sm:px-10 md:px-20 lg:px-40 xl:px-60 flex flex-col items-center overflow-y-scroll"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        <PhotoFrame />
        <div className="w-full flex flex-col items-center md:px-15">
          <div className="w-full flex justify-end md:text-4xl text-2xl gap-5">
            <FontAwesomeIcon icon={faPencil} className="cursor-pointer" />
            <FontAwesomeIcon icon={faTrashCan} className="cursor-pointer" />
          </div>
          <div className="w-full flex items-center gap-3 mb-5">
            <div className="md:w-14 md:h-14 w-10 h-10 rounded-full flex items-center justify-center bg-gray-300">
              <FontAwesomeIcon icon={faImage} className="text-gray-500" />
            </div>
            <span className="md:text-3xl text-2xl">This is name space</span>
          </div>
          <div className="w-full flex flex-col gap-1 md:mb-7 mb-5">
            <div className="flex w-full justify-between">
              <label htmlFor="title" className="md:text-xl text-lg">
                제목
              </label>
              {showBookMark && (
                <div className="flex gap-2 md:-mt-6 -mt-3 cursor-pointer">
                  <div className="md:w-10 md:h-10 w-8 h-8 rounded-full flex items-center justify-center bg-red-400"></div>
                  <div className="md:w-10 md:h-10 w-8 h-8 rounded-full flex items-center justify-center bg-orange-400"></div>
                  <div className="md:w-10 md:h-10 w-8 h-8 rounded-full flex items-center justify-center bg-yellow-400"></div>
                  <div className="md:w-10 md:h-10 w-8 h-8 rounded-full flex items-center justify-center bg-green-400"></div>
                  <div className="md:w-10 md:h-10 w-8 h-8 rounded-full flex items-center justify-center bg-sky-400"></div>
                </div>
              )}
            </div>
            <div className="w-full flex items-center border-1 border-gray-200 rounded-md md:p-3 p-2">
              <input
                type="text"
                placeholder="핀 제목을 입력해주세요"
                id="title"
                className="w-full outline-none focus:outline-none md:text-xl text-lg mr-4"
              />
              <FontAwesomeIcon
                icon={showBookMark ? faSolidBookmark : faRegularBookmark}
                className={` md:text-3xl text-2xl mr-2 cursor-pointer ${
                  showBookMark ? "text-red-400" : "text-gray-500"
                }`}
                onClick={() => setShowBookMark(!showBookMark)}
              />
            </div>
          </div>
          <div className="w-full flex flex-1 md:gap-15 gap-5 pb-2 md:mb-7 mb-5">
            <div className="flex items-center">
              <FontAwesomeIcon
                icon={faCalendar}
                className="text-black md:text-3xl text-xl mr-2"
              />
              <input
                type="date"
                className="appearance-none focus:outline-none md:text-2xl text-xl"
                style={{
                  WebkitAppearance: "none",
                  MozAppearance: "textfield",
                  appearance: "none",
                  backgroundColor: "transparent",
                  position: "relative",
                  zIndex: 2,
                }}
              />
            </div>
            <div className="flex flex-1 items-center w-1/2">
              <FontAwesomeIcon
                icon={faLocationDot}
                className="text-black md:text-3xl text-xl mr-2 flex-shrink-0"
              />
              <div
                className="md:text-2xl text-xl underline underline-offset-7 overflow-x-auto whitespace-nowrap cursor-pointer hover:text-blue-600 transition-colors"
                style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                onWheel={(e) => {
                  e.preventDefault();
                  const container = e.currentTarget;
                  container.scrollLeft += e.deltaY;
                }}
                onClick={onLocationEdit}
              >
                {selectedLocation ? selectedLocation.address : "위치를 입력해 주세요"}
              </div>
            </div>
          </div>
          <div className="w-full flex flex-col gap-1 md:mb-7 mb-5">
            <label htmlFor="content" className="md:text-xl text-lg">
              내용
            </label>
            <div className="w-full border-1 border-gray-200 rounded-md md:p-3 p-2">
              <textarea
                placeholder="핀 내용을 입력해주세요"
                id="content"
                className="w-full min-h-32 resize-none outline-none focus:outline-none md:text-xl text-lg"
                rows={6}
              />
            </div>
          </div>
          {/*  */}
        </div>
      </div>
    </div>
  );
};

export default PinPage;
