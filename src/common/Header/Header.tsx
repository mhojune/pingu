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
import type { PostResponseDTO } from "../../api/types";
import SearchPage from "../../Feature/SearchPage";
import MobileHeader from "./MobileHeader";
import { useState, useEffect } from "react";
import Modal from "../Modal";
import PinList from "../../Feature/PinList";
import PinFolder from "../../Feature/PinFolder";
import FriendList from "../../Feature/FriendList";
import { createUser, getUserById } from "../../api/users";
import { login, logout } from "../../api/auth";
import type { UserDTO } from "../../api/types";

type HeaderProps = {
  setShowPinPage: (value: boolean) => void;
  showPinPage: boolean;
  showDropDown: boolean;
  setShowDropDown: (value: boolean) => void;
  setSearchKeyword?: (keyword: string) => void;
  searchResults?: unknown[];
  setShowMobilePinList: (value: boolean) => void;
  onLocationSelect?: (location: { address: string; lat: number; lng: number }) => void;
  showSearchPage?: boolean;
  setShowSearchPage?: (value: boolean) => void;
  onPinSelect?: (post: PostResponseDTO) => void;
  refreshTrigger?: number;
  onLoginStateChange?: () => void;
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
  onPinSelect,
  refreshTrigger,
  onLoginStateChange,
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
  const [signupPhoneNumber, setSignupPhoneNumber] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<UserDTO | null>(null);
  const [showUserInfoModal, setShowUserInfoModal] = useState(false);

  // 컴포넌트 마운트 시 localStorage에서 로그인 상태 확인
  useEffect(() => {
    const savedLoginState = localStorage.getItem("isLoggedIn");
    const savedUserId = localStorage.getItem("userId");
    
    if (savedLoginState === "true" && savedUserId) {
      const userId = parseInt(savedUserId, 10);
      setIsLoggedIn(true);
      // 사용자 정보 로드
      loadUserInfo(userId);
    }
  }, []);

  // 사용자 정보 로드 함수
  const loadUserInfo = async (userId: number) => {
    try {
      console.log("사용자 정보 요청 - userId:", userId);
      const userInfo = await getUserById(userId);
      console.log("사용자 정보 응답:", userInfo);
      setCurrentUser(userInfo);
      console.log("사용자 정보 설정 완료");
    } catch (error) {
      console.error("사용자 정보 로드 실패:", error);
      console.error("에러 타입:", typeof error);
      console.error("에러 메시지:", error instanceof Error ? error.message : String(error));
    }
  };

  // 로그아웃 함수
  const handleLogout = async () => {
    try {
      await logout();
      
      // localStorage에서 로그인 정보 제거
      localStorage.removeItem("userId");
      localStorage.removeItem("isLoggedIn");
      
      // 상태 초기화
      setIsLoggedIn(false);
      setCurrentUser(null);
      setShowUserInfoModal(false);
      
      // 전체 앱 상태 초기화
      if (onLoginStateChange) {
        onLoginStateChange();
      }
      
      alert("로그아웃되었습니다.");
    } catch (error) {
      console.error("로그아웃 에러:", error);
      alert("로그아웃에 실패했습니다.");
    }
  };

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
            onClick={() => {
              if (isLoggedIn) {
                // 사용자 정보 모달 표시
                setShowUserInfoModal(true);
              } else {
                // 로그인 모달 표시
                setShowUserModal(true);
              }
            }}
            className="cursor-pointer transition-all duration-300 ease-in-out hover:text-gray-700"
          >
            <FontAwesomeIcon icon={faUser} className="mr-5" />
            {!showDropDown && !showPinPage && (
              <span>User</span>
            )}
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
          {showFriendsPage && <FriendList />}
          {showPinListPage && <PinList onPinSelect={onPinSelect} refreshTrigger={refreshTrigger} />}
          {showFolderPage && <PinFolder onPinSelect={onPinSelect} />}
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
            onClick={async () => {
              // 유효성 검사
              if (!loginId.trim()) {
                alert("아이디를 입력해주세요.");
                return;
              }
              if (!loginPassword) {
                alert("비밀번호를 입력해주세요.");
                return;
              }

              try {
                console.log("로그인 시도:", { username: loginId.trim() });
                
                const response = await login({
                  username: loginId.trim(),
                  password: loginPassword,
                });

                console.log("로그인 응답:", response);
                console.log("응답 타입:", typeof response);

                // 백엔드에서 사용자 ID만 반환하는 경우 처리
                if (typeof response === 'number' && response > 0) {
                  const userId = response;
                  console.log("로그인 성공, 사용자 ID:", userId);
                  
                  // localStorage에 유저 아이디 저장
                  localStorage.setItem("userId", userId.toString());
                  localStorage.setItem("isLoggedIn", "true");
                  
                  // 상태 업데이트
                  setIsLoggedIn(true);
                  
                  // 사용자 정보 로드
                  console.log("사용자 정보 로드 시작");
                  await loadUserInfo(userId);
                  
                  // 폼 초기화 및 모달 닫기
                  setLoginId("");
                  setLoginPassword("");
                  setShowUserModal(false);
                  
                  // 전체 앱 상태 초기화
                  if (onLoginStateChange) {
                    onLoginStateChange();
                  }
                  
                  alert("로그인 성공!");
                } else {
                  console.log("로그인 실패 - 응답:", response);
                  alert("로그인에 실패했습니다.");
                }
              } catch (error) {
                console.error("로그인 에러 상세:", error);
                console.error("에러 타입:", typeof error);
                console.error("에러 메시지:", error instanceof Error ? error.message : String(error));
                alert("로그인에 실패했습니다. 아이디와 비밀번호를 확인해주세요.");
              }
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

      {/* User Info Modal */}
      <Modal
        isOpen={showUserInfoModal}
        onClose={() => setShowUserInfoModal(false)}
        title="사용자 정보"
      >
        <div className="flex flex-col gap-4">
          {currentUser ? (
            <>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                  <span className="font-semibold">사용자 ID:</span>
                  <span>{currentUser.userId}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                  <span className="font-semibold">사용자명:</span>
                  <span>{currentUser.username}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                  <span className="font-semibold">전화번호:</span>
                  <span>{currentUser.phoneNumber}</span>
                </div>
              </div>
              <button
                className="w-full rounded bg-red-600 py-2 text-white hover:bg-red-700 transition"
                onClick={handleLogout}
              >
                로그아웃
              </button>
            </>
          ) : (
            <div className="text-center text-gray-500">
              사용자 정보를 불러오는 중...
            </div>
          )}
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
          <input
            type="tel"
            placeholder="핸드폰 번호"
            className="w-full rounded border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={signupPhoneNumber}
            onChange={(e) => setSignupPhoneNumber(e.target.value)}
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
              if (!signupPhoneNumber.trim()) {
                alert("핸드폰 번호를 입력해주세요.");
                return;
              }

              try {
                // 백엔드 UserDTO 스키마에 맞춰 최소 필드 구성
                // userId는 서버에서 자동 생성되므로 제외
                await createUser({
                  username: signupId.trim(),
                  password: signupPassword,
                  phoneNumber: signupPhoneNumber.trim(),
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
              // 폼 초기화
              setSignupId("");
              setSignupPassword("");
              setSignupPasswordConfirm("");
              setSignupPhoneNumber("");
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
        onLoginStateChange={onLoginStateChange}
      />
    </div>
  );
}

export default Header;
