import "./App.css";
import { useState } from "react";
import Header from "./common/Header/Header";
import Background from "./common/Background";
import Map from "./Map";
import Footer from "./common/Footer";
import MobileDropDown from "./common/Header/MobileDropDown";
import PinPage from "./Feature/PinPage";

function App() {
  const [showMobileDropDown, setShowMobileDropDown] = useState(false);
  const [showPinPage, setShowPinPage] = useState(false);
  const [showDropDown, setShowDropDown] = useState(false);

  return (
    <div className="flex md:flex-row flex-col h-screen relative">
      <div
        className={`h-full z-10 ${
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
        />
      </div>
      <div className="md:flex-9 bg-white z-0 flex-9">
        <Background showPinPage={showPinPage}>
          <Map />
          <MobileDropDown isVisible={showMobileDropDown} />
          {showPinPage && <PinPage />}
        </Background>
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
