import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faBars, faTimes } from "@fortawesome/free-solid-svg-icons";
import { useState, useEffect } from "react";
import Modal from "../Modal";
import { createUser, getUserById } from "../../api/users";
import { login, logout } from "../../api/auth";
import type { UserDTO } from "../../api/types";

type MobileHeaderProps = {
  setSearchKeyword?: (keyword: string) => void;
  searchResults?: unknown[];
  setShowMobilePinList: (value: boolean) => void;
  onLoginStateChange?: () => void;
};

function MobileHeader({
  setSearchKeyword,
  searchResults,
  setShowMobilePinList,
  onLoginStateChange,
}: MobileHeaderProps) {
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  
  // 로그인/회원가입 모달 상태
  const [showUserModal, setShowUserModal] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);
  const [showUserInfoModal, setShowUserInfoModal] = useState(false);
  
  // 로그인 폼 상태
  const [loginId, setLoginId] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  
  // 회원가입 폼 상태
  const [signupId, setSignupId] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupPasswordConfirm, setSignupPasswordConfirm] = useState("");
  const [signupPhoneNumber, setSignupPhoneNumber] = useState("");
  
  // 로그인 상태
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<UserDTO | null>(null);

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

  const handleSearchClick = () => {
    setIsSearchExpanded(!isSearchExpanded);
    // 기존 onSearchClick 로직은 실행하지 않음
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchValue.trim()) {
      // 검색어를 부모 컴포넌트로 전달
      if (setSearchKeyword) {
        setSearchKeyword(searchValue);
      }
      // 검색 실행 후 검색창 닫기
      setIsSearchExpanded(false);
      setSearchValue("");
    }
  };

  // 검색 결과가 있을 때 그림자 제거
  const hasSearchResults = searchResults && searchResults.length > 0;

  // 로고 클릭 핸들러
  const handleLogoClick = () => {
    if (isLoggedIn) {
      // 사용자 정보 모달 표시
      setShowUserInfoModal(true);
    } else {
      // 로그인 모달 표시
      setShowUserModal(true);
    }
  };

  return (
    <div className="md:hidden w-full h-full">
      <div
        className="flex bg-[#fafaf8] w-full h-full items-end p-3 justify-between"
        style={{
          boxShadow: hasSearchResults ? "none" : "1px 0 12px 0 rgba(0,0,0,0.4)",
        }}
      >
        <img 
          src="./logo.png" 
          alt="logo" 
          className="w-1/3 h-[90%] cursor-pointer" 
          onClick={handleLogoClick}
        />
        <div className="flex gap-4 mr-3">
          <div
            className={`bg-gray-200 rounded-full flex items-center justify-center p-2 cursor-pointer transition-all duration-300 ${
              isSearchExpanded ? "flex-1 max-w-[calc(100vw-200px)]" : "w-10"
            }`}
            onClick={!isSearchExpanded ? handleSearchClick : undefined}
          >
            {isSearchExpanded ? (
              <form onSubmit={handleSearchSubmit} className="flex items-center w-full">
                <input
                  type="text"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  placeholder="검색어를 입력하세요..."
                  className="flex-1 bg-transparent outline-none text-sm px-2 min-w-0"
                  autoFocus
                />
                <button
                  type="submit"
                  className="ml-2 text-gray-500 hover:text-gray-700 flex-shrink-0"
                >
                  <FontAwesomeIcon icon={faSearch} className="text-sm" />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsSearchExpanded(false);
                    setSearchValue("");
                  }}
                  className="ml-2 text-gray-500 hover:text-gray-700 flex-shrink-0"
                >
                  <FontAwesomeIcon icon={faTimes} className="text-sm" />
                </button>
              </form>
            ) : (
              <FontAwesomeIcon icon={faSearch} className="text-lg text-gray-500" />
            )}
          </div>
          <div
            className="w-10 h-10 bg-red-400 rounded-full flex items-center justify-center p-2 cursor-pointer"
            onClick={() => {
              console.log("빨간 버튼 클릭됨");
              setShowMobilePinList(true);
              console.log("setShowMobilePinList(true) 호출됨");
            }}
          >
            <FontAwesomeIcon icon={faBars} className="text-lg text-white" />
          </div>
        </div>
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
    </div>
  );
}

export default MobileHeader;
