import "./App.css";
import { useState } from "react";
import Header from "./common/Header/Header";
import Background from "./common/Background";
import Map from "./Map";
import Footer from "./common/Footer";
import MobileDropDown from "./common/Header/MobileDropDown";
import PinPage from "./Feature/PinPage";
import MobileSearchPage from "./Feature/Mobile/MobileSearchPage";
import MobilePinList from "./Feature/Mobile/MobilePinList";
import MobileFolder from "./Feature/Mobile/MobileFolder";
import PinInfo from "./Feature/PinInfo";
import { deletePost } from "./api/posts";
import type { PostResponseDTO } from "./api/types";

function App() {
  const [showMobileDropDown, setShowMobileDropDown] = useState(false);
  const [showPinPage, setShowPinPage] = useState(false);
  const [showDropDown, setShowDropDown] = useState(false);
  const [showMobilePinList, setShowMobilePinList] = useState(false);
  const [showMobileFolder, setShowMobileFolder] = useState(false);
  const [pinInfoSource, setPinInfoSource] = useState<'mobileFolder' | 'pinList' | 'other'>('other');
  const [searchKeyword, setSearchKeyword] = useState("");
  const [searchResults, setSearchResults] = useState<unknown[]>([]);
  const [showSearchPage, setShowSearchPage] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<{
    address: string;
    lat: number;
    lng: number;
  } | null>(null);
  const [selectedPost, setSelectedPost] = useState<PostResponseDTO | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [showPinInfo, setShowPinInfo] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [loginRefreshTrigger, setLoginRefreshTrigger] = useState(0);
  const [tempPinPageState, setTempPinPageState] = useState<{
    title: string;
    content: string;
    dateStr: string;
    files: File[];
  } | null>(null);
  
  // PinPage 상태를 App에서 관리
  const [pinPageState, setPinPageState] = useState({
    title: "",
    content: "",
    dateStr: "",
    files: [] as File[]
  });

  // 위치 선택 핸들러
  const handleLocationSelect = (location: {
    address: string;
    lat: number;
    lng: number;
  }) => {
    setSelectedLocation(location);
    setShowPinPage(true);
    setShowDropDown(false);
    setShowSearchPage(false);
    setShowPinInfo(false); // PinInfo 닫기

    // 임시 저장된 상태가 있으면 복원
    if (tempPinPageState) {
      console.log("위치 선택 - 상태 복원:", tempPinPageState);
      console.log("복원 전 pinPageState:", pinPageState);
      setPinPageState(tempPinPageState);
      console.log("복원 후 pinPageState 설정 완료");
      setTempPinPageState(null); // 임시 상태 초기화
    } else {
      console.log("임시 저장된 상태 없음");
    }

    // 콘솔에 위도, 경도 출력
    console.log(`위도: ${location.lat}, 경도: ${location.lng}`);
  };

  // 위치 편집 핸들러
  const handleLocationEdit = () => {
    // 현재 PinPage 상태를 임시 저장 (File 배열은 새로 생성)
    console.log("위치 편집 - 현재 상태 저장:", pinPageState);
    setTempPinPageState({
      title: pinPageState.title,
      content: pinPageState.content,
      dateStr: pinPageState.dateStr,
      files: [...pinPageState.files] // File 배열 복사
    });
    
    // PinPage 닫고 위치 선택 활성화
    setShowPinPage(false);
    setShowDropDown(true);
    setShowSearchPage(true);
  };

  // 핀 선택 핸들러 (핀 리스트에서)
  const handlePinSelect = (post: PostResponseDTO) => {
    setSelectedPost(post);
    setShowPinInfo(true);
    setPinInfoSource('pinList');
    setShowDropDown(false);
    setShowSearchPage(false);
    setShowMobilePinList(false);
    // 검색 결과 초기화하여 MobileSearchPage가 닫히도록 함
    setSearchResults([]);
  };

  // MobileFolder에서 핀 선택 핸들러
  const handleMobileFolderPinSelect = (post: PostResponseDTO) => {
    setSelectedPost(post);
    setShowPinInfo(true);
    setPinInfoSource('mobileFolder');
    setShowMobileFolder(false); // MobileFolder 닫기
  };

  // PinInfo 닫기 핸들러 (어디서 왔는지에 따라 적절한 화면으로 돌아가기)
  const handlePinInfoClose = () => {
    setShowPinInfo(false);
    
    // 어디서 왔는지에 따라 적절한 화면으로 돌아가기
    if (pinInfoSource === 'mobileFolder') {
      setShowMobileFolder(true);
    } else if (pinInfoSource === 'pinList') {
      setShowMobilePinList(true);
    }
    
    // 소스 초기화
    setPinInfoSource('other');
  };

  // 핀 편집 핸들러
  const handlePinEdit = (post: PostResponseDTO) => {
    setSelectedPost(post);
    setIsEditMode(true);
    setShowPinInfo(false);
    setShowPinPage(true);
  };

  // 핀 삭제 핸들러
  const handlePinDelete = async (post: PostResponseDTO) => {
    if (window.confirm("정말로 이 핀을 삭제하시겠습니까?")) {
      try {
        console.log("핀 삭제 시도:", post.postId);
        const result = await deletePost(post.postId);
        console.log("핀 삭제 성공:", result);
        alert("핀이 삭제되었습니다.");
        setShowPinInfo(false); // PinInfo 닫기
        setSelectedPost(null); // 선택된 핀 초기화
        
        // 목록 새로고침 트리거 증가
        setRefreshTrigger(prev => {
          const newValue = prev + 1;
          console.log("refreshTrigger 변경:", prev, "->", newValue);
          return newValue;
        });
      } catch (error) {
        console.error("핀 삭제 실패:", error);
        console.error("에러 상세:", error);
        alert(`핀 삭제에 실패했습니다: ${error instanceof Error ? error.message : '알 수 없는 오류'}`);
      }
    }
  };

  // PinPage 성공 핸들러
  const handlePinPageSuccess = () => {
    setSelectedLocation(null);
    setShowPinPage(false);
    setShowPinInfo(false); // PinInfo 닫기
    setIsEditMode(false); // 편집 모드 해제
    
    // 목록 새로고침 트리거 증가
    setRefreshTrigger(prev => {
      const newValue = prev + 1;
      console.log("핀 수정 후 refreshTrigger 변경:", prev, "->", newValue);
      return newValue;
    });
  };

  // 로그인 상태 변경 시 전체 앱 상태 초기화
  const handleLoginStateChange = () => {
    console.log("로그인 상태 변경 감지 - 전체 앱 상태 초기화");
    
    // 모든 상태 초기화
    setShowMobileDropDown(false);
    setShowPinPage(false);
    setShowDropDown(false);
    setShowMobilePinList(false);
    setSearchKeyword("");
    setSearchResults([]);
    setShowSearchPage(false);
    setSelectedLocation(null);
    setSelectedPost(null);
    setIsEditMode(false);
    setShowPinInfo(false);
    setTempPinPageState(null);
    
    // PinPage 상태 초기화
    setPinPageState({
      title: "",
      content: "",
      dateStr: "",
      files: []
    });
    
    // 새로고침 트리거 증가
    setRefreshTrigger(prev => {
      const newValue = prev + 1;
      console.log("로그인 상태 변경 후 refreshTrigger 변경:", prev, "->", newValue);
      return newValue;
    });
    
    setLoginRefreshTrigger(prev => {
      const newValue = prev + 1;
      console.log("loginRefreshTrigger 변경:", prev, "->", newValue);
      return newValue;
    });
  };


  return (
    <div className="flex md:flex-row flex-col h-screen relative">
      <div
        className={`h-full z-10 transition-all duration-500 ease-in-out ${
          showDropDown || showPinPage
            ? "md:flex-[0.5] flex-[1.4]"
            : "md:flex-[1.5] flex-[1.4]"
        }`}
      >
        <Header
          setShowPinPage={setShowPinPage}
          showPinPage={showPinPage}
          showDropDown={showDropDown}
          setShowDropDown={setShowDropDown}
          setSearchKeyword={setSearchKeyword}
          searchResults={searchResults}
          setShowMobilePinList={(value: boolean) => {
            setShowMobilePinList(value);
            if (value) {
              setPinInfoSource('pinList');
            }
          }}
          onLocationSelect={handleLocationSelect}
          showSearchPage={showSearchPage}
          setShowSearchPage={setShowSearchPage}
          onPinSelect={handlePinSelect}
          refreshTrigger={refreshTrigger}
          onLoginStateChange={handleLoginStateChange}
        />
      </div>
      <div className="md:flex-9 bg-white z-0 flex-9 relative">
        <Background showPinPage={showPinPage}>
          <Map searchKeyword={searchKeyword} onSearchResults={setSearchResults} loginRefreshTrigger={loginRefreshTrigger} />
          <MobileDropDown isVisible={showMobileDropDown} />
          {showPinPage && (
            <PinPage
              selectedLocation={selectedLocation}
              onLocationEdit={handleLocationEdit}
              pinPageState={pinPageState}
              setPinPageState={setPinPageState}
              selectedPost={selectedPost}
              isEditMode={isEditMode}
              onSuccess={handlePinPageSuccess}
            />
          )}
          <MobileSearchPage
            searchResults={searchResults}
            onLocationSelect={handleLocationSelect}
          />
        </Background>

        {/* MobilePinList를 Background 밖에 배치하되 같은 컨테이너 안에 */}
        {showMobilePinList && (
          <div className="absolute inset-0 z-20">
            <MobilePinList 
              setShowMobilePinList={setShowMobilePinList}
              onPinSelect={handlePinSelect}
              refreshTrigger={refreshTrigger}
            />
          </div>
        )}

        {/* MobileFolder를 Background 밖에 배치하되 같은 컨테이너 안에 */}
        {showMobileFolder && (
          <div className="absolute inset-0 z-20">
            <MobileFolder 
              setShowMobileFolder={setShowMobileFolder}
              onPinSelect={handleMobileFolderPinSelect}
              refreshTrigger={refreshTrigger}
            />
          </div>
        )}

        {/* PinInfo를 MobileFolder보다 높은 z-index로 배치 */}
        {showPinInfo && (
          <div className="absolute inset-0 z-30">
            <PinInfo
              selectedPost={selectedPost}
              onClose={handlePinInfoClose}
              onEdit={handlePinEdit}
              onDelete={handlePinDelete}
            />
          </div>
        )}
      </div>
      <div className="md:hidden flex-1 z-10">
        <Footer
          onUserFriendsClick={() => setShowMobileDropDown(!showMobileDropDown)}
          setShowPinPage={setShowPinPage}
          showPinPage={showPinPage}
          onFolderClick={() => {
            setShowMobileFolder(true);
            setPinInfoSource('other');
          }}
        />
      </div>
    </div>
  );
}

export default App;
