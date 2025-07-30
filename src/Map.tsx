import { useEffect } from "react";

declare global {
  interface Window {
    kakao: any;
  }
}
const Map = () => {
  useEffect(() => {
    const mapContainer = document.getElementById("map");
    const mapOption = {
      center: new window.kakao.maps.LatLng(36.5, 128),
      level: 12,
    };
    new window.kakao.maps.Map(mapContainer, mapOption);

    // cleanup 함수 추가!
    return () => {
      if (mapContainer) {
        mapContainer.innerHTML = "";
      }
    };
  }, []);

  return (
    <div id="map" className="w-full h-fulll" style={{ width: "100%", height: "100%" }} />
  );
};

export default Map;
