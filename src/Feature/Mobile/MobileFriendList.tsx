import { useState, useEffect, useCallback } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faUser, 
  faUserPlus, 
  faUserCheck, 
  faUserClock,
  faUserMinus,
  faCheck,
  faTimes,
  faTrash,
  faArrowLeft
} from "@fortawesome/free-solid-svg-icons";
import { 
  createFriendshipRequest, 
  getAcceptedFriends, 
  getReceivedFriendshipRequests, 
  getSentFriendshipRequests,
  acceptFriendshipRequest,
  deleteFriendship
} from "../../api/friendships";
import type { FriendshipResponseDTO } from "../../api/types";

type TabType = "friends" | "received" | "sent";

interface MobileFriendListProps {
  setShowMobileFriendList: (value: boolean) => void;
}

const MobileFriendList: React.FC<MobileFriendListProps> = ({ setShowMobileFriendList }) => {
  const [activeTab, setActiveTab] = useState<TabType>("friends");
  const [friends, setFriends] = useState<FriendshipResponseDTO[]>([]);
  const [receivedRequests, setReceivedRequests] = useState<FriendshipResponseDTO[]>([]);
  const [sentRequests, setSentRequests] = useState<FriendshipResponseDTO[]>([]);
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

  // 데이터 새로고침 함수
  const refreshData = useCallback(async () => {
    if (!currentUserId) return;

    setLoading(true);
    
    try {
      // 친구 목록 로드
      console.log("친구 목록 로드 시작");
      const friendsData = await getAcceptedFriends(currentUserId);
      console.log("친구 목록 로드 성공:", friendsData);
      setFriends(friendsData);

      // 받은 친구 요청 로드
      console.log("받은 친구 요청 로드 시작");
      const receivedData = await getReceivedFriendshipRequests(currentUserId);
      console.log("받은 친구 요청 로드 성공:", receivedData);
      setReceivedRequests(receivedData);

      // 보낸 친구 요청 로드
      console.log("보낸 친구 요청 로드 시작");
      const sentData = await getSentFriendshipRequests(currentUserId);
      console.log("보낸 친구 요청 로드 성공:", sentData);
      setSentRequests(sentData);

    } catch (error) {
      console.error("데이터 로드 실패:", error);
      setFriends([]);
      setReceivedRequests([]);
      setSentRequests([]);
    }

    setLoading(false);
  }, [currentUserId]);

  // 친구 목록과 사용자 목록 로드
  useEffect(() => {
    if (!currentUserId) return;
    refreshData();
  }, [currentUserId, refreshData]);


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
      // 데이터 새로고침
      await refreshData();
    } catch (error) {
      console.error("친구 추가 실패:", error);
      alert("친구 추가에 실패했습니다.");
    }
  };

  // 친구 요청 수락
  const handleAcceptRequest = async (requesterId: number) => {
    if (!currentUserId) return;

    try {
      await acceptFriendshipRequest({
        requesterId: requesterId,
        receiverId: currentUserId
      });
      alert("친구 요청을 수락했습니다.");
      // 데이터 새로고침
      await refreshData();
    } catch (error) {
      console.error("친구 요청 수락 실패:", error);
      alert("친구 요청 수락에 실패했습니다.");
    }
  };

  // 친구 요청 거절
  const handleRejectRequest = async (requesterId: number) => {
    if (!currentUserId) return;

    try {
      await deleteFriendship(requesterId, currentUserId);
      alert("친구 요청을 거절했습니다.");
      // 데이터 새로고침
      await refreshData();
    } catch (error) {
      console.error("친구 요청 거절 실패:", error);
      alert("친구 요청 거절에 실패했습니다.");
    }
  };

  // 친구 관계 해제
  const handleRemoveFriend = async (friendId: number) => {
    if (!currentUserId) return;

    if (!confirm("정말로 친구 관계를 해제하시겠습니까?")) {
      return;
    }

    try {
      await deleteFriendship(currentUserId, friendId);
      alert("친구 관계를 해제했습니다.");
      // 데이터 새로고침
      await refreshData();
    } catch (error) {
      console.error("친구 관계 해제 실패:", error);
      alert("친구 관계 해제에 실패했습니다.");
    }
  };

  return (
    <div className="w-full h-full bg-white flex flex-col">
      {/* 헤더 */}
      <div className="flex items-center justify-between p-4 bg-[#fafaf8] border-b border-gray-200">
        <button
          onClick={() => setShowMobileFriendList(false)}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
        >
          <FontAwesomeIcon icon={faArrowLeft} className="text-lg" />
          <span className="text-lg font-medium">뒤로</span>
        </button>
        <h1 className="text-xl font-bold text-gray-800">친구 관리</h1>
        <button
          onClick={() => setShowAddFriendModal(true)}
          className="flex items-center gap-2 px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          <FontAwesomeIcon icon={faUserPlus} />
          <span className="text-sm">친구 추가</span>
        </button>
      </div>

      {/* 탭 메뉴 */}
      <div className="flex border-b border-gray-200 bg-white">
        <button
          onClick={() => setActiveTab("friends")}
          className={`flex-1 px-4 py-3 font-medium text-sm border-b-2 transition-colors ${
            activeTab === "friends"
              ? "border-blue-500 text-blue-600"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          <FontAwesomeIcon icon={faUserCheck} className="mr-2" />
          친구 ({friends.length})
        </button>
        <button
          onClick={() => setActiveTab("received")}
          className={`flex-1 px-4 py-3 font-medium text-sm border-b-2 transition-colors ${
            activeTab === "received"
              ? "border-blue-500 text-blue-600"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          <FontAwesomeIcon icon={faUserClock} className="mr-2" />
          받은 요청 ({receivedRequests.length})
        </button>
        <button
          onClick={() => setActiveTab("sent")}
          className={`flex-1 px-4 py-3 font-medium text-sm border-b-2 transition-colors ${
            activeTab === "sent"
              ? "border-blue-500 text-blue-600"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          <FontAwesomeIcon icon={faUserMinus} className="mr-2" />
          보낸 요청 ({sentRequests.length})
        </button>
      </div>


      {/* 목록 표시 */}
      <div className="flex-1 overflow-y-auto">
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
            {/* 친구 목록 탭 */}
            {activeTab === "friends" && (
              <>
                {friends.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-64 gap-4 p-4">
                    <FontAwesomeIcon icon={faUserCheck} className="text-6xl text-gray-300" />
                    <span className="text-xl text-gray-500">친구가 없습니다</span>
                    <button
                      onClick={() => setShowAddFriendModal(true)}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                    >
                      <FontAwesomeIcon icon={faUserPlus} />
                      친구 추가하기
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2 p-4">
                    {friends.map((friendship) => {
                      const friend = friendship.friend1.userId === currentUserId ? friendship.friend2 : friendship.friend1;
                      return (
                        <div
                          key={friendship.id}
                          className="flex items-center p-4 bg-white rounded-lg shadow-sm border border-gray-200"
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
                          
                          <button 
                            onClick={() => handleRemoveFriend(friend.userId!)}
                            className="flex items-center gap-2 px-3 py-2 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600 transition-colors"
                          >
                            <FontAwesomeIcon icon={faTrash} />
                            친구 해제
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </>
            )}

            {/* 받은 친구 요청 탭 */}
            {activeTab === "received" && (
              <>
                {receivedRequests.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-64 gap-4 p-4">
                    <FontAwesomeIcon icon={faUserClock} className="text-6xl text-gray-300" />
                    <span className="text-xl text-gray-500">받은 친구 요청이 없습니다</span>
                  </div>
                ) : (
                  <div className="space-y-2 p-4">
                    {receivedRequests.map((friendship) => {
                      const requester = friendship.friend1;
                      return (
                        <div
                          key={friendship.id}
                          className="flex items-center p-4 bg-white rounded-lg shadow-sm border border-gray-200"
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
                              <span className="text-lg font-semibold">{requester.username}</span>
                            </div>
                            <span className="text-sm text-gray-500">{requester.phoneNumber}</span>
                          </div>
                          
                          <div className="flex gap-2">
                            <button 
                              onClick={() => handleAcceptRequest(requester.userId!)}
                              className="flex items-center gap-2 px-3 py-2 bg-green-500 text-white text-sm rounded-lg hover:bg-green-600 transition-colors"
                            >
                              <FontAwesomeIcon icon={faCheck} />
                              수락
                            </button>
                            <button 
                              onClick={() => handleRejectRequest(requester.userId!)}
                              className="flex items-center gap-2 px-3 py-2 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600 transition-colors"
                            >
                              <FontAwesomeIcon icon={faTimes} />
                              거절
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </>
            )}

            {/* 보낸 친구 요청 탭 */}
            {activeTab === "sent" && (
              <>
                {sentRequests.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-64 gap-4 p-4">
                    <FontAwesomeIcon icon={faUserMinus} className="text-6xl text-gray-300" />
                    <span className="text-xl text-gray-500">보낸 친구 요청이 없습니다</span>
                  </div>
                ) : (
                  <div className="space-y-2 p-4">
                    {sentRequests.map((friendship) => {
                      const receiver = friendship.friend2;
                      return (
                        <div
                          key={friendship.id}
                          className="flex items-center p-4 bg-white rounded-lg shadow-sm border border-gray-200"
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
                              <span className="text-lg font-semibold">{receiver.username}</span>
                            </div>
                            <span className="text-sm text-gray-500">{receiver.phoneNumber}</span>
                          </div>
                          
                          <div className="flex items-center gap-2 px-3 py-2 bg-gray-100 text-gray-600 text-sm rounded-lg">
                            <FontAwesomeIcon icon={faUserClock} />
                            대기 중
                          </div>
                        </div>
                      );
                    })}
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
          <div className="bg-white rounded-lg p-6 w-96 mx-4">
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

export default MobileFriendList;
