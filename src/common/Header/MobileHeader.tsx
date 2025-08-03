import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faBars, faTimes } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";

type MobileHeaderProps = {
  onSearchClick?: () => void;
  onMenuClick?: () => void;
  setSearchKeyword?: (keyword: string) => void;
  searchResults?: any[];
};

function MobileHeader({
  onSearchClick,
  onMenuClick,
  setSearchKeyword,
  searchResults,
}: MobileHeaderProps) {
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [searchValue, setSearchValue] = useState("");

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

  return (
    <div className="md:hidden w-full h-full">
      <div
        className="flex bg-[#fafaf8] w-full h-full items-end p-3 justify-between"
        style={{
          boxShadow: hasSearchResults ? "none" : "1px 0 12px 0 rgba(0,0,0,0.4)",
        }}
      >
        <img src="/logo.png" alt="logo" className="w-1/3 h-[90%]" />
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
            onClick={onMenuClick}
          >
            <FontAwesomeIcon icon={faBars} className="text-lg text-white" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default MobileHeader;
