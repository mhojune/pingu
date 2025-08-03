import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";

type MobileSearchPageProps = {
  searchResults?: any[];
};

function MobileSearchPage({ searchResults }: MobileSearchPageProps) {
  const [showSearchResults, setShowSearchResults] = useState(false);

  const toggleSearchResults = () => {
    setShowSearchResults(!showSearchResults);
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
              {searchResults.map((place, index) => (
                <li key={index} className="item bg-white p-3 rounded-lg shadow-sm border">
                  <div className="flex items-start">
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
                        <span className="block text-sm text-blue-600">{place.phone}</span>
                      )}
                    </div>
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
