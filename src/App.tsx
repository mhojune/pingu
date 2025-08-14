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
        />
      </div>
      <div className="md:flex-9 bg-white z-0 flex-9 relative">
        <Background showPinPage={showPinPage}>
          <Map searchKeyword={searchKeyword} onSearchResults={setSearchResults} />
          <MobileDropDown isVisible={showMobileDropDown} />
          {showPinPage && <PinPage />}
          <MobileSearchPage searchResults={searchResults} />
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
