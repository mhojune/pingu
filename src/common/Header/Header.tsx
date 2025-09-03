import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch,
  faUserFriends,
  faFolder,
  faBars,
  faPlus,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import DropDown from "./DropDown";
import SearchPage from "../../Feature/SearchPage";
import MobileHeader from "./MobileHeader";
import { useState } from "react";
import Modal from "../Modal";
import PinList from "../../Feature/PinList";
import PinFolder from "../../Feature/PinFolder";
import { createUser } from "../../api/users";

type HeaderProps = {
  setShowPinPage: (value: boolean) => void;
  showPinPage: boolean;
  showDropDown: boolean;
  setShowDropDown: (value: boolean) => void;
  setSearchKeyword?: (keyword: string) => void;
  searchResults?: any[];
  setShowMobilePinList: (value: boolean) => void;
  onLocationSelect?: (location: { address: string; lat: number; lng: number }) => void;
  showSearchPage?: boolean;
  setShowSearchPage?: (value: boolean) => void;
};

function Header({
  setShowPinPage,
  showPinPage,
  showDropDown,
  setShowDropDown,
  setSearchKeyword,
  searchResults,
  setShowMobilePinList,
  onLocationSelect,
  showSearchPage = false,
  setShowSearchPage,
}: HeaderProps) {
  const [showFriendsPage, setShowFriendsPage] = useState(false);
  const [showFolderPage, setShowFolderPage] = useState(false);
  const [showPinListPage, setShowPinListPage] = useState(false);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);
  const [loginId, setLoginId] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [signupId, setSignupId] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupPasswordConfirm, setSignupPasswordConfirm] = useState("");

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
              if (setShowSearchPage) {
                // Search가 현재 활성화되어 있으면 비활성화, 아니면 활성화
                if (showSearchPage) {
                  setShowSearchPage(false);
                  setShowDropDown(false);
                } else {
                  setShowSearchPage(true);
                  setShowDropDown(true);
                }
              }
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
              if (setShowSearchPage) {
                setShowSearchPage(false);
              }
              if (!showDropDown) {
                setShowDropDown(true);
                setShowFriendsPage(true);
              } else if (showFriendsPage) {
                setShowDropDown(false);
                setShowFriendsPage(false);
              } else {
                setShowFriendsPage(true);
              }
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
              if (setShowSearchPage) {
                setShowSearchPage(false);
              }
              if (!showDropDown) {
                setShowDropDown(true);
                setShowFolderPage(true);
              } else if (showFolderPage) {
                setShowDropDown(false);
                setShowFolderPage(false);
              } else {
                setShowFolderPage(true);
              }
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
              if (setShowSearchPage) {
                setShowSearchPage(false);
              }
              if (!showDropDown) {
                setShowDropDown(true);
                setShowPinListPage(true);
              } else if (showPinListPage) {
                setShowDropDown(false);
                setShowPinListPage(false);
              } else {
                setShowPinListPage(true);
              }
              setShowFriendsPage(false);
              setShowFolderPage(false);
            }}
            className="cursor-pointer transition-all duration-300 ease-in-out hover:text-gray-700"
          >
            <FontAwesomeIcon icon={faBars} className="mr-5" />
            {!showDropDown && !showPinPage && <span>PinList</span>}
          </div>
          <div
            onClick={() => setShowUserModal(true)}
            className="cursor-pointer transition-all duration-300 ease-in-out hover:text-gray-700"
          >
            <FontAwesomeIcon icon={faUser} className="mr-5" />
            {!showDropDown && !showPinPage && <span>User</span>}
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
              onLocationSelect={onLocationSelect}
            />
          )}
          {showPinListPage && <PinList />}
          {showFolderPage && <PinFolder />}
        </DropDown>
      </div>

      {/* User Login Modal */}
      <Modal
        isOpen={showUserModal}
        onClose={() => setShowUserModal(false)}
        title="로그인"
      >
        <div className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="아이디"
            className="w-full rounded border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={loginId}
            onChange={(e) => setLoginId(e.target.value)}
          />
          <input
            type="password"
            placeholder="비밀번호"
            className="w-full rounded border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={loginPassword}
            onChange={(e) => setLoginPassword(e.target.value)}
          />
          <button
            className="w-full rounded bg-blue-600 py-2 text-white hover:bg-blue-700 transition"
            onClick={() => {
              // TODO: 실제 로그인 로직 연동
              setShowUserModal(false);
            }}
          >
            로그인
          </button>
          <div className="text-center text-sm text-gray-500">또는</div>
          <button
            className="w-full rounded border border-gray-300 py-2 hover:bg-gray-50 transition"
            onClick={() => {
              setShowUserModal(false);
              setShowSignupModal(true);
            }}
          >
            회원가입
          </button>
        </div>
      </Modal>

      {/* Signup Modal */}
      <Modal
        isOpen={showSignupModal}
        onClose={() => setShowSignupModal(false)}
        title="회원가입"
      >
        <div className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="아이디"
            className="w-full rounded border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={signupId}
            onChange={(e) => setSignupId(e.target.value)}
          />
          <input
            type="password"
            placeholder="비밀번호"
            className="w-full rounded border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={signupPassword}
            onChange={(e) => setSignupPassword(e.target.value)}
          />
          <input
            type="password"
            placeholder="비밀번호 확인"
            className="w-full rounded border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={signupPasswordConfirm}
            onChange={(e) => setSignupPasswordConfirm(e.target.value)}
          />
          <button
            className="w-full rounded bg-green-600 py-2 text-white hover:bg-green-700 transition"
            onClick={async () => {
              // 간단 유효성 검사
              if (!signupId.trim()) {
                alert("아이디를 입력해주세요.");
                return;
              }
              if (!signupPassword) {
                alert("비밀번호를 입력해주세요.");
                return;
              }
              if (signupPassword !== signupPasswordConfirm) {
                alert("비밀번호가 일치하지 않습니다.");
                return;
              }

              try {
                // 백엔드 UserDTO 스키마에 맞춰 최소 필드 구성
                await createUser({
                  userId: 0,
                  username: signupId.trim(),
                  password: signupPassword,
                  phoneNumber: "",
                  regDate: new Date().toISOString(),
                  modDate: new Date().toISOString(),
                });
                alert("회원가입이 완료되었습니다. 로그인해 주세요.");
                setShowSignupModal(false);
                setShowUserModal(true);
              } catch (e) {
                console.error(e);
                alert("회원가입에 실패했습니다.");
              }
            }}
          >
            회원가입 완료
          </button>
          <button
            className="w-full rounded border border-gray-300 py-2 hover:bg-gray-50 transition"
            onClick={() => {
              setShowSignupModal(false);
              setShowUserModal(true);
            }}
          >
            로그인으로 돌아가기
          </button>
        </div>
      </Modal>

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
