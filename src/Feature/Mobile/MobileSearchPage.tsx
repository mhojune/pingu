import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faChevronUp, faPlus } from "@fortawesome/free-solid-svg-icons";
import { useState, useEffect } from "react";

export type PlaceResult = {
  place_name: string;
  x: string; // longitude
  y: string; // latitude
  road_address_name?: string;
  address_name?: string;
  phone?: string;
};

type MobileSearchPageProps = {
  searchResults?: PlaceResult[];
  onLocationSelect?: (location: { address: string; lat: number; lng: number }) => void;
};

function MobileSearchPage({ searchResults, onLocationSelect }: MobileSearchPageProps) {
  const [showSearchResults, setShowSearchResults] = useState(false);

  // searchResults가 변경될 때 검색 결과 창 상태 초기화
  useEffect(() => {
    if (!searchResults || searchResults.length === 0) {
      setShowSearchResults(false);
    }
  }, [searchResults]);

  const toggleSearchResults = () => {
    setShowSearchResults(!showSearchResults);
  };

  const handleLocationSelect = (place: PlaceResult) => {
    if (onLocationSelect) {
      const location = {
        address: place.place_name,
        lat: parseFloat(place.y),
        lng: parseFloat(place.x),
      };
      onLocationSelect(location);
    }
  };

  if (!searchResults || searchResults.length === 0) {
    return null;
  }

  return (
    <div className="md:hidden absolute top-0 left-0 right-0 z-50 bg-white shadow-lg">
      {/* 검색 결과 토글 버튼 */}
      <div className="bg-gray-100 border-b border-gray-200">
        <button
          onClick={toggleSearchResults}
          className="w-full flex items-center justify-between p-3 text-sm text-gray-600 hover:bg-gray-200 transition-colors"
        >
          <span>검색 결과 ({searchResults.length}개)</span>
          <FontAwesomeIcon
            icon={showSearchResults ? faChevronUp : faChevronDown}
            className="text-gray-500"
          />
        </button>
      </div>

      {/* 검색 결과 목록 */}
      {showSearchResults && (
        <div className="bg-white border-b border-gray-200 max-h-96 overflow-y-auto">
          <div className="p-3">
            <ul className="space-y-2">
              {searchResults.map((place: PlaceResult, index: number) => (
                <li key={index} className="item bg-white p-3 rounded-lg shadow-sm border">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start flex-1">
                      <div className="w-6 h-6 mr-3 flex-shrink-0 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                        {index + 1}
                      </div>
                      <div className="info flex-1">
                        <h5 className="font-semibold text-lg mb-1">{place.place_name}</h5>
                        {place.road_address_name ? (
                          <>
                            <span className="block text-sm text-gray-700 mb-1">
                              {place.road_address_name}
                            </span>
                            <span className="block text-sm text-gray-500 mb-1">
                              {place.address_name}
                            </span>
                          </>
                        ) : (
                          <span className="block text-sm text-gray-700 mb-1">
                            {place.address_name}
                          </span>
                        )}
                        {place.phone && (
                          <span className="block text-sm text-blue-600">
                            {place.phone}
                          </span>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => handleLocationSelect(place)}
                      className="ml-3 px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors flex items-center gap-2 text-sm"
                    >
                      <FontAwesomeIcon icon={faPlus} className="text-xs" />
                      추가
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

export default MobileSearchPage;
