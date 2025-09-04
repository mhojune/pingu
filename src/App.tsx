import "./App.css";
import { useState, useEffect } from "react";
import Header from "./common/Header/Header";
import Background from "./common/Background";
import Map from "./Map";
import Footer from "./common/Footer";
import MobileDropDown from "./common/Header/MobileDropDown";
import PinPage from "./Feature/PinPage";
import MobileSearchPage from "./Feature/Mobile/MobileSearchPage";
import MobilePinList from "./Feature/Mobile/MobilePinList";

function App() {
  const [showMobileDropDown, setShowMobileDropDown] = useState(false);
  const [showPinPage, setShowPinPage] = useState(false);
  const [showDropDown, setShowDropDown] = useState(false);
  const [showMobilePinList, setShowMobilePinList] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [showSearchPage, setShowSearchPage] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<{
    address: string;
    lat: number;
    lng: number;
  } | null>(null);
  
  // PinPage 상태를 App에서 관리
  const [pinPageState, setPinPageState] = useState({
    title: "",
    content: "",
    dateStr: "",
    files: [] as File[],
    showBookMark: false
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

    // 콘솔에 위도, 경도 출력
    console.log(`위도: ${location.lat}, 경도: ${location.lng}`);
  };

  // 위치 편집 핸들러
  const handleLocationEdit = () => {
    setShowPinPage(false);
    setShowDropDown(true);
    setShowSearchPage(true);
  };

  // 디버깅을 위한 useEffect
  useEffect(() => {
    console.log("showMobilePinList 상태 변경:", showMobilePinList);
  }, [showMobilePinList]);

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
          setShowMobilePinList={setShowMobilePinList}
          onLocationSelect={handleLocationSelect}
          showSearchPage={showSearchPage}
          setShowSearchPage={setShowSearchPage}
        />
      </div>
      <div className="md:flex-9 bg-white z-0 flex-9 relative">
        <Background showPinPage={showPinPage}>
          <Map searchKeyword={searchKeyword} onSearchResults={setSearchResults} />
          <MobileDropDown isVisible={showMobileDropDown} />
          {showPinPage && (
            <PinPage
              selectedLocation={selectedLocation}
              onLocationEdit={handleLocationEdit}
              pinPageState={pinPageState}
              setPinPageState={setPinPageState}
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
            <MobilePinList setShowMobilePinList={setShowMobilePinList} />
          </div>
        )}
      </div>
      <div className="md:hidden flex-1 z-10">
        <Footer
          onUserFriendsClick={() => setShowMobileDropDown(!showMobileDropDown)}
          setShowPinPage={setShowPinPage}
          showPinPage={showPinPage}
        />
      </div>
    </div>
  );
}

export default App;
