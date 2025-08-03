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
import { useState } from "react";

type HeaderProps = {
  setShowPinPage: (value: boolean) => void;
  showPinPage: boolean;
  showDropDown: boolean;
  setShowDropDown: (value: boolean) => void;
  searchKeyword?: string;
  setSearchKeyword?: (keyword: string) => void;
  searchResults?: any[];
};

function Header({
  setShowPinPage,
  showPinPage,
  showDropDown,
  setShowDropDown,
  searchKeyword,
  setSearchKeyword,
  searchResults,
}: HeaderProps) {
  const [showSearchPage, setShowSearchPage] = useState(false);
  const [showFriendsPage, setShowFriendsPage] = useState(false);
  const [showFolderPage, setShowFolderPage] = useState(false);
  const [showMenuPage, setShowMenuPage] = useState(false);

  return (
    <div className="flex w-full h-full relative">
      <div
        className={`flex-col items-center justify-between h-full p-8 bg-[#fafaf8] transition-all duration-500 z-10 md:flex hidden w-full`}
        style={{ boxShadow: "1px 0 12px 0 rgba(0,0,0,0.4)" }}
      >
        {!showDropDown && !showPinPage ? (
          <img src="/logo.png" alt="logo" className="w-full mb-10" />
        ) : (
          <img src="/logo_min.png" alt="logo" className="w-1/0.5 h-auto mb-10" />
        )}
        <div
          className={`flex flex-col text-2xl w-full gap-6 text-gray-500 mb-auto ${
            (showDropDown || showPinPage) && "justify-center items-center"
          }`}
        >
          <div
            onClick={() => {
              setShowDropDown(!showDropDown);
              setShowSearchPage(!showSearchPage);
              setShowFriendsPage(false);
              setShowFolderPage(false);
              setShowMenuPage(false);
            }}
            className="cursor-pointer"
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
              setShowMenuPage(false);
            }}
            className="cursor-pointer"
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
              setShowMenuPage(false);
            }}
            className="cursor-pointer"
          >
            <FontAwesomeIcon icon={faFolder} className="mr-5" />
            {!showDropDown && !showPinPage && <span>Folder</span>}
          </div>
          <div
            onClick={() => {
              setShowDropDown(!showDropDown);
              setShowMenuPage(!showMenuPage);
              setShowSearchPage(false);
              setShowFriendsPage(false);
              setShowFolderPage(false);
            }}
            className="cursor-pointer"
          >
            <FontAwesomeIcon icon={faBars} className="mr-5" />
            {!showDropDown && !showPinPage && <span>Menu</span>}
          </div>
        </div>
        <div className="flex justify-center items-center w-full mt-auto">
          <FontAwesomeIcon
            icon={faPlus}
            className="text-6xl text-red-500 cursor-pointer"
            onClick={() => setShowPinPage(!showPinPage)}
          />
        </div>
      </div>
      {showDropDown && (
        <div className="absolute left-full top-0 w-lg h-full">
          <DropDown>
            {showSearchPage && (
              <SearchPage
                onSearchKeyword={setSearchKeyword}
                searchResults={searchResults}
              />
            )}
          </DropDown>
        </div>
      )}
      {/* Mobile */}
      <div
        className="md:hidden flex bg-[#fafaf8] w-full items-end p-3 justify-between"
        style={{ boxShadow: "1px 0 12px 0 rgba(0,0,0,0.4)" }}
      >
        <img src="/logo.png" alt="logo" className="w-1/3 h-[90%]" />
        <div className="flex gap-4 mr-3">
          <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center p-2">
            <FontAwesomeIcon icon={faSearch} className="text-lg text-gray-500" />
          </div>
          <div className="w-10 h-10 bg-red-400 rounded-full flex items-center justify-center p-2">
            <FontAwesomeIcon icon={faBars} className="text-lg text-white" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Header;
