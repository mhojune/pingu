import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faUserPlus, faSearch, faEllipsisV } from "@fortawesome/free-solid-svg-icons";

type Friend = {
  id: number;
  username: string;
  phoneNumber: string;
};

const FriendList = () => {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [showAddFriendModal, setShowAddFriendModal] = useState(false);
  const [newFriendId, setNewFriendId] = useState("");
  const [loading, setLoading] = useState(true);

  // 더미 데이터 - 실제로는 API에서 불러올 예정
  useEffect(() => {
    // TODO: 실제 친구 목록 API 연동
    const dummyFriends: Friend[] = [
      {
        id: 1,
        username: "김철수",
        phoneNumber: "010-1234-5678",
      },
      {
        id: 2,
        username: "이영희",
        phoneNumber: "010-2345-6789",
      },
      {
        id: 3,
        username: "박민수",
        phoneNumber: "010-3456-7890",
      },
    ];
    
    setTimeout(() => {
      setFriends(dummyFriends);
      setLoading(false);
    }, 1000);
  }, []);

  // 친구 검색
  const filteredFriends = friends.filter(friend =>
    friend.username.toLowerCase().includes(searchKeyword.toLowerCase()) ||
    friend.phoneNumber.includes(searchKeyword)
  );

  // 친구 추가
  const handleAddFriend = () => {
    if (!newFriendId.trim()) {
      alert("사용자 ID를 입력해주세요.");
      return;
    }

    // TODO: 실제 친구 추가 API 연동
    console.log("친구 추가:", newFriendId);
    alert("친구 추가 기능은 준비 중입니다.");
    setNewFriendId("");
    setShowAddFriendModal(false);
  };

  return (
    <div className="w-full h-full flex flex-col">
      <div className="w-full h-full flex flex-col p-6 gap-4 overflow-y-auto">
        {/* 헤더 */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">친구 목록</h2>
          <button
            onClick={() => setShowAddFriendModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            <FontAwesomeIcon icon={faUserPlus} />
            친구 추가
          </button>
        </div>

        {/* 검색 바 */}
        <div className="relative mb-4">
          <FontAwesomeIcon 
            icon={faSearch} 
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" 
          />
          <input
            type="text"
            placeholder="친구 검색..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
          />
        </div>

        {/* 친구 목록 */}
        {loading ? (
          <div className="flex flex-col items-center justify-center h-64 gap-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            <span className="text-gray-500">친구 목록을 불러오는 중...</span>
          </div>
        ) : filteredFriends.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 gap-4">
            <FontAwesomeIcon icon={faUser} className="text-6xl text-gray-300" />
            <span className="text-xl text-gray-500">
              {searchKeyword ? "검색 결과가 없습니다" : "친구가 없습니다"}
            </span>
            {!searchKeyword && (
              <button
                onClick={() => setShowAddFriendModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                <FontAwesomeIcon icon={faUserPlus} />
                친구 추가하기
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {filteredFriends.map((friend) => (
              <div
                key={friend.id}
                className="flex items-center p-4 bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
              >
                <div className="mr-4">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center bg-gray-100">
                    <FontAwesomeIcon 
                      icon={faUser} 
                      className="text-lg text-gray-400" 
                    />
                  </div>
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-semibold">{friend.username}</span>
                  </div>
                  <span className="text-sm text-gray-500">{friend.phoneNumber}</span>
                </div>
                
                <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                  <FontAwesomeIcon icon={faEllipsisV} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 친구 추가 모달 */}
      {showAddFriendModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <h3 className="text-xl font-bold mb-4">친구 추가</h3>
            <input
              type="text"
              placeholder="사용자 ID를 입력하세요"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
              value={newFriendId}
              onChange={(e) => setNewFriendId(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleAddFriend()}
            />
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => {
                  setShowAddFriendModal(false);
                  setNewFriendId("");
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                취소
              </button>
              <button
                onClick={handleAddFriend}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                추가
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FriendList;
