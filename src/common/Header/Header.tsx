import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch,
  faUserFriends,
  faFolder,
  faBars,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import DropDown from "./DropDown";
import SearchPage from "../../Feature/SearchPage";
import MobileHeader from "./MobileHeader";
import { useState } from "react";
import PinList from "../../Feature/PinList";

type HeaderProps = {
  setShowPinPage: (value: boolean) => void;
  showPinPage: boolean;
  showDropDown: boolean;
  setShowDropDown: (value: boolean) => void;
  setSearchKeyword?: (keyword: string) => void;
  searchResults?: any[];
  setShowMobilePinList: (value: boolean) => void;
};

function Header({
  setShowPinPage,
  showPinPage,
  showDropDown,
  setShowDropDown,
  setSearchKeyword,
  searchResults,
  setShowMobilePinList,
}: HeaderProps) {
  const [showSearchPage, setShowSearchPage] = useState(false);
  const [showFriendsPage, setShowFriendsPage] = useState(false);
  const [showFolderPage, setShowFolderPage] = useState(false);
  const [showPinListPage, setShowPinListPage] = useState(false);

  return (
    <div className="flex w-full h-full relative">
      <div
        className="flex-col items-center justify-between h-full p-8 bg-[#fafaf8] transition-all duration-500 ease-in-out z-10 md:flex hidden w-full"
        style={{ boxShadow: "1px 0 12px 0 rgba(0,0,0,0.4)" }}
      >
        <div className="transition-all duration-500 ease-in-out">
          {!showDropDown && !showPinPage ? (
            <img
              src="./logo.png"
              alt="logo"
              className="w-full mb-10 transition-all duration-500 ease-in-out"
            />
          ) : (
            <img
              src="./logo_min.png"
              alt="logo"
              className="w-1/0.5 h-auto mb-10 transition-all duration-500 ease-in-out"
            />
          )}
        </div>
        <div
          className={`flex flex-col text-2xl w-full gap-6 text-gray-500 mb-auto transition-all duration-500 ease-in-out ${
            (showDropDown || showPinPage) && "justify-center items-center"
          }`}
        >
          <div
            onClick={() => {
              setShowDropDown(!showDropDown);
              setShowSearchPage(!showSearchPage);
              setShowFriendsPage(false);
              setShowFolderPage(false);
              setShowPinListPage(false);
            }}
            className="cursor-pointer transition-all duration-300 ease-in-out hover:text-gray-700"
          >
            <FontAwesomeIcon icon={faSearch} className="mr-5" />
            {!showDropDown && !showPinPage && <span>Search</span>}
          </div>
          <div
            onClick={() => {
              setShowDropDown(!showDropDown);
              setShowFriendsPage(!showFriendsPage);
              setShowSearchPage(false);
              setShowFolderPage(false);
              setShowPinListPage(false);
            }}
            className="cursor-pointer transition-all duration-300 ease-in-out hover:text-gray-700"
          >
            <FontAwesomeIcon icon={faUserFriends} className="mr-5" />
            {!showDropDown && !showPinPage && <span>Friends</span>}
          </div>
          <div
            onClick={() => {
              setShowDropDown(!showDropDown);
              setShowFolderPage(!showFolderPage);
              setShowSearchPage(false);
              setShowFriendsPage(false);
              setShowPinListPage(false);
            }}
            className="cursor-pointer transition-all duration-300 ease-in-out hover:text-gray-700"
          >
            <FontAwesomeIcon icon={faFolder} className="mr-5" />
            {!showDropDown && !showPinPage && <span>Folder</span>}
          </div>
          <div
            onClick={() => {
              setShowDropDown(!showDropDown);
              setShowPinListPage(!showPinListPage);
              setShowSearchPage(false);
              setShowFriendsPage(false);
              setShowFolderPage(false);
            }}
            className="cursor-pointer transition-all duration-300 ease-in-out hover:text-gray-700"
          >
            <FontAwesomeIcon icon={faBars} className="mr-5" />
            {!showDropDown && !showPinPage && <span>PinList</span>}
          </div>
        </div>
        <div className="flex justify-center items-center w-full mt-auto">
          <FontAwesomeIcon
            icon={faPlus}
            className="text-6xl text-red-500 cursor-pointer transition-all duration-300 ease-in-out hover:scale-110"
            onClick={() => setShowPinPage(!showPinPage)}
          />
        </div>
      </div>

      {/* 드롭다운 애니메이션 */}
      <div
        className={`absolute left-full top-0 w-lg h-full transition-all duration-500 ease-in-out md:block hidden ${
          showDropDown
            ? "opacity-100 transform translate-x-0"
            : "opacity-0 transform -translate-x-4 pointer-events-none"
        }`}
      >
        <DropDown>
          {showSearchPage && (
            <SearchPage
              onSearchKeyword={setSearchKeyword}
              searchResults={searchResults}
            />
          )}
          {showPinListPage && <PinList />}
        </DropDown>
      </div>

      {/* Mobile */}
      <MobileHeader
        setSearchKeyword={setSearchKeyword}
        searchResults={searchResults}
        setShowMobilePinList={setShowMobilePinList}
      />
    </div>
  );
}

export default Header;
