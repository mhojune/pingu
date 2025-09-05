import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faUserPlus, faSearch, faUsers } from "@fortawesome/free-solid-svg-icons";
import { getUsers } from "../api/users";
import { createFriendshipRequest } from "../api/friendships";
import type { UserDTO } from "../api/types";

type TabType = "friends" | "users";

const FriendList = () => {
  const [activeTab, setActiveTab] = useState<TabType>("users");
  const [users, setUsers] = useState<UserDTO[]>([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [showAddFriendModal, setShowAddFriendModal] = useState(false);
  const [newFriendId, setNewFriendId] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);

  // localStorage에서 현재 사용자 ID 로드
  useEffect(() => {
    const savedUserId = localStorage.getItem("userId");
    if (savedUserId) {
      const userId = parseInt(savedUserId, 10);
      setCurrentUserId(userId);
    }
  }, []);

  // 친구 목록과 사용자 목록 로드
  useEffect(() => {
    if (!currentUserId) return;

    const loadData = async () => {
      setLoading(true);
      
      // 먼저 사용자 목록부터 로드 (더 안정적인 API)
      try {
        console.log("사용자 목록 로드 시작");
        const usersData = await getUsers({ page: 1, size: 100 });
        console.log("사용자 목록 로드 성공:", usersData);
        setUsers(usersData.dtoList);
      } catch (error) {
        console.error("사용자 목록 로드 실패:", error);
        setUsers([]);
      }

      // 친구 목록 API는 임시로 비활성화됨 (500 에러 해결 후 활성화 예정)

      setLoading(false);
    };

    loadData();
  }, [currentUserId]);

  // 사용자 검색 (현재 사용자 제외)
  const filteredUsers = users.filter(user => 
    user.userId !== currentUserId && 
    (user.username.toLowerCase().includes(searchKeyword.toLowerCase()) ||
     user.phoneNumber.includes(searchKeyword))
  );

  // 친구 추가
  const handleAddFriend = async () => {
    if (!currentUserId) {
      alert("로그인이 필요합니다.");
      return;
    }

    if (!newFriendId.trim()) {
      alert("사용자 ID를 입력해주세요.");
      return;
    }

    const targetUserId = parseInt(newFriendId);
    if (isNaN(targetUserId)) {
      alert("올바른 사용자 ID를 입력해주세요.");
      return;
    }

    try {
      await createFriendshipRequest({
        requesterId: currentUserId,
        receiverId: targetUserId
      });
      alert("친구 요청을 보냈습니다.");
      setNewFriendId("");
      setShowAddFriendModal(false);
    } catch (error) {
      console.error("친구 추가 실패:", error);
      alert("친구 추가에 실패했습니다.");
    }
  };

  return (
    <div className="w-full h-full flex flex-col">
      <div className="w-full h-full flex flex-col p-6 gap-4 overflow-y-auto">
        {/* 헤더 */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">사용자 목록</h2>
          <button
            onClick={() => setShowAddFriendModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            <FontAwesomeIcon icon={faUserPlus} />
            친구 추가
          </button>
        </div>

        {/* 탭 메뉴 */}
        <div className="flex border-b border-gray-200 mb-4">
          {/* 친구 목록 탭 임시 비활성화 */}
          {/* <button
            onClick={() => setActiveTab("friends")}
            className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
              activeTab === "friends"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            <FontAwesomeIcon icon={faUser} className="mr-2" />
            친구 목록 (0)
          </button> */}
          <button
            onClick={() => setActiveTab("users")}
            className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
              activeTab === "users"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            <FontAwesomeIcon icon={faUsers} className="mr-2" />
            전체 사용자 ({filteredUsers.length})
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

        {/* 목록 표시 */}
        {!currentUserId ? (
          <div className="flex flex-col items-center justify-center h-64 gap-4">
            <FontAwesomeIcon icon={faUser} className="text-6xl text-gray-300" />
            <span className="text-xl text-gray-500">로그인이 필요합니다</span>
          </div>
        ) : loading ? (
          <div className="flex flex-col items-center justify-center h-64 gap-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            <span className="text-gray-500">데이터를 불러오는 중...</span>
          </div>
        ) : (
          <>
            {/* 친구 목록 탭 - 임시 비활성화 */}
            {/* {activeTab === "friends" && (
              <>
                {filteredFriends.length === 0 ? (
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
                    {filteredFriends.map((friendship) => {
                      const friend = friendship.friend1.userId === currentUserId ? friendship.friend2 : friendship.friend1;
                      return (
                        <div
                          key={friendship.id}
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
                      );
                    })}
                  </div>
                )}
              </>
            )} */}

            {/* 전체 사용자 목록 탭 */}
            {activeTab === "users" && (
              <>
                {filteredUsers.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-64 gap-4">
                    <FontAwesomeIcon icon={faUsers} className="text-6xl text-gray-300" />
                    <span className="text-xl text-gray-500">
                      {searchKeyword ? "검색 결과가 없습니다" : "사용자가 없습니다"}
                    </span>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {filteredUsers.map((user) => (
                      <div
                        key={user.userId}
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
                            <span className="text-lg font-semibold">{user.username}</span>
                          </div>
                          <span className="text-sm text-gray-500">{user.phoneNumber}</span>
                        </div>
                        
                        <button 
                          onClick={() => {
                            setNewFriendId(user.userId?.toString() || "");
                            setShowAddFriendModal(true);
                          }}
                          className="flex items-center gap-2 px-3 py-1 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 transition-colors"
                        >
                          <FontAwesomeIcon icon={faUserPlus} />
                          친구 추가
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </>
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
