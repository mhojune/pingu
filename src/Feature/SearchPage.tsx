import { faSearch, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";

type SearchPageProps = {
  onSearchKeyword?: (keyword: string) => void;
  searchResults?: any[];
  onLocationSelect?: (location: { address: string; lat: number; lng: number }) => void;
};

const SearchPage = ({
  onSearchKeyword,
  searchResults,
  onLocationSelect,
}: SearchPageProps) => {
  const [searchKeyword, setSearchKeyword] = useState("");

  const handleSearch = () => {
    if (searchKeyword.trim() && onSearchKeyword) {
      console.log("검색 버튼 클릭:", searchKeyword);
      onSearchKeyword(searchKeyword);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleLocationSelect = (place: any) => {
    if (onLocationSelect) {
      const location = {
        address: place.place_name,
        lat: parseFloat(place.y),
        lng: parseFloat(place.x),
      };
      onLocationSelect(location);
    }
  };

  return (
    <div className="w-full h-full flex flex-col">
      {/* 검색 페이지 헤더 */}
      <div className="p-5">
        <div className="bg-gray-200 rounded-full p-3 flex w-full justify-between items-center text-xl">
          <input
            type="text"
            placeholder="검색어를 입력해주세요"
            className="bg-transparent outline-none flex-1 mr-2"
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <FontAwesomeIcon
            icon={faSearch}
            className="cursor-pointer text-gray-500 hover:text-gray-700"
            onClick={handleSearch}
          />
        </div>
      </div>

      {/* 검색 결과 영역 */}
      <div className="flex-1 flex flex-col min-h-0">
        {searchResults && searchResults.length > 0 ? (
          <div className="flex-1 overflow-y-auto px-5 pb-5">
            <ul className="space-y-2">
              {searchResults.map((place, index) => (
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
        ) : (
          <div className="flex-1 flex items-center justify-center px-5">
            <div className="text-center text-gray-500">
              검색어를 입력하고 검색 버튼을 클릭하거나 Enter를 눌러주세요
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
