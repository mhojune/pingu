import { useEffect, useRef, useState } from "react";

declare global {
  interface Window {
    kakao: any;
  }
}

type MapProps = {
  searchKeyword?: string;
  onSearchResults?: (results: any[]) => void;
};

const Map = ({ searchKeyword, onSearchResults }: MapProps) => {
  const mapRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const infowindowRef = useRef<any>(null);
  const placesServiceRef = useRef<any>(null);

  useEffect(() => {
    const mapContainer = document.getElementById("map");
    const mapOption = {
      center: new window.kakao.maps.LatLng(36.5, 128),
      level: 12,
    };

    // 지도 생성
    const map = new window.kakao.maps.Map(mapContainer, mapOption);
    mapRef.current = map;

    // 카카오맵 API가 완전히 로드된 후 서비스 객체들 생성
    const initServices = () => {
      console.log("initServices 실행");
      console.log("window.kakao:", !!window.kakao);
      console.log("window.kakao.maps:", !!window.kakao?.maps);
      console.log("window.kakao.maps.services:", !!window.kakao?.maps?.services);

      if (window.kakao && window.kakao.maps && window.kakao.maps.services) {
        console.log("서비스 객체들 생성 시작");
        // 장소 검색 객체 생성
        const ps = new window.kakao.maps.services.Places();
        placesServiceRef.current = ps;
        console.log("Places 서비스 생성 완료");

        // 인포윈도우 생성
        const infowindow = new window.kakao.maps.InfoWindow({ zIndex: 1 });
        infowindowRef.current = infowindow;
        console.log("인포윈도우 생성 완료");
      } else {
        console.log("API 아직 로드되지 않음, 재시도...");
        // API가 아직 로드되지 않았다면 잠시 후 다시 시도
        setTimeout(initServices, 100);
      }
    };

    initServices();

    // cleanup 함수
    return () => {
      if (mapContainer) {
        mapContainer.innerHTML = "";
      }
    };
  }, []);

  // 검색어가 변경될 때마다 검색 실행 (빈 문자열이 아닐 때만)
  useEffect(() => {
    if (
      searchKeyword &&
      searchKeyword.trim() &&
      placesServiceRef.current &&
      mapRef.current
    ) {
      console.log("검색 실행:", searchKeyword);
      searchPlaces(searchKeyword);
    }
  }, [searchKeyword]);

  // 장소 검색 함수
  const searchPlaces = (keyword: string) => {
    if (!keyword.replace(/^\s+|\s+$/g, "")) {
      return false;
    }

    console.log("검색 시작:", keyword);
    console.log("placesService 존재:", !!placesServiceRef.current);
    console.log("map 존재:", !!mapRef.current);

    // 기존 마커 제거
    removeMarker();

    // 장소검색 실행
    placesServiceRef.current.keywordSearch(keyword, placesSearchCB);
  };

  // 검색 완료 콜백
  const placesSearchCB = (data: any, status: any, pagination: any) => {
    console.log("검색 콜백 실행:", status, data);
    if (status === window.kakao.maps.services.Status.OK) {
      console.log("검색 성공, 결과 개수:", data.length);
      displayPlaces(data);
      if (onSearchResults) {
        onSearchResults(data);
      }
    } else if (status === window.kakao.maps.services.Status.ZERO_RESULT) {
      console.log("검색 결과가 존재하지 않습니다.");
    } else if (status === window.kakao.maps.services.Status.ERROR) {
      console.log("검색 결과 중 오류가 발생했습니다.");
    }
  };

  // 검색 결과 표시
  const displayPlaces = (places: any[]) => {
    const bounds = new window.kakao.maps.LatLngBounds();

    for (let i = 0; i < places.length; i++) {
      const placePosition = new window.kakao.maps.LatLng(places[i].y, places[i].x);
      const marker = addMarker(placePosition, i, places[i].place_name);

      // 마커 이벤트 리스너
      window.kakao.maps.event.addListener(marker, "mouseover", () => {
        displayInfowindow(marker, places[i].place_name);
      });

      window.kakao.maps.event.addListener(marker, "mouseout", () => {
        infowindowRef.current.close();
      });

      bounds.extend(placePosition);
    }

    // 검색된 장소 위치를 기준으로 지도 범위 재설정
    mapRef.current.setBounds(bounds);
  };

  // 마커 생성
  const addMarker = (position: any, idx: number, title: string) => {
    const imageSrc =
      "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/marker_number_blue.png";
    const imageSize = new window.kakao.maps.Size(36, 37);
    const imgOptions = {
      spriteSize: new window.kakao.maps.Size(36, 691),
      spriteOrigin: new window.kakao.maps.Point(0, idx * 46 + 10),
      offset: new window.kakao.maps.Point(13, 37),
    };

    const markerImage = new window.kakao.maps.MarkerImage(
      imageSrc,
      imageSize,
      imgOptions
    );
    const marker = new window.kakao.maps.Marker({
      position: position,
      image: markerImage,
    });

    marker.setMap(mapRef.current);
    markersRef.current.push(marker);

    return marker;
  };

  // 마커 제거
  const removeMarker = () => {
    for (let i = 0; i < markersRef.current.length; i++) {
      markersRef.current[i].setMap(null);
    }
    markersRef.current = [];
  };

  // 인포윈도우 표시
  const displayInfowindow = (marker: any, title: string) => {
    const content = '<div style="padding:5px;z-index:1;">' + title + "</div>";
    infowindowRef.current.setContent(content);
    infowindowRef.current.open(mapRef.current, marker);
  };

  return (
    <div id="map" className="w-full h-full" style={{ width: "100%", height: "100%" }} />
  );
};

export default Map;
