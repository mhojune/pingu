import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faFolder, faTrash, faArrowLeft, faCheck } from "@fortawesome/free-solid-svg-icons";
import { createFolder, getUserFolders, updateFolder, deleteFolder } from "../api/folders";
import { getPosts, getPostById } from "../api/posts";
import { getUserById } from "../api/users";
import type { PostResponseDTO } from "../api/types";

type Folder = {
  id: number;
  name: string;
  postCount: number;
  postIds: number[];
};

type FolderView = 'list' | 'pins' | 'addPins';

type PinFolderProps = {
  onPinSelect?: (post: PostResponseDTO) => void;
};

const PinFolder = ({ onPinSelect }: PinFolderProps) => {
  const [folders, setFolders] = useState<Folder[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentView, setCurrentView] = useState<FolderView>('list');
  const [selectedFolder, setSelectedFolder] = useState<Folder | null>(null);
  const [folderPins, setFolderPins] = useState<PostResponseDTO[]>([]);
  const [allPins, setAllPins] = useState<PostResponseDTO[]>([]);
  const [selectedPinIds, setSelectedPinIds] = useState<number[]>([]);
  const [pinsLoading, setPinsLoading] = useState(false);
  const [currentUserName, setCurrentUserName] = useState<string>("");

  // content에서 날짜와 내용을 분리하는 함수
  const parseContent = (content: string) => {
    // 📅 날짜\n\n내용 또는 📅 날짜\n내용 패턴 모두 처리
    const dateMatch = content.match(/^📅 (.+?)\n\n?(.+)$/s);
    
    if (dateMatch) {
      return {
        date: dateMatch[1].trim(),
        content: dateMatch[2].trim()
      };
    }
    return {
      date: null,
      content: content
    };
  };

  // 폴더 목록 불러오기
  const loadFolders = async () => {
    try {
      setLoading(true);
      // localStorage에서 현재 사용자 ID 로드
      const savedUserId = localStorage.getItem("userId");
      if (!savedUserId) {
        alert("로그인이 필요합니다.");
        setLoading(false);
        return;
      }
      
      const userId = parseInt(savedUserId, 10);
      const folderData = await getUserFolders(userId);
      
      // API 응답을 Folder 타입에 맞게 변환
      const transformedFolders: Folder[] = folderData.map(folder => ({
        id: folder.id,
        name: folder.name,
        postCount: folder.postIds?.length || 0,
        postIds: folder.postIds || []
      }));
      
      setFolders(transformedFolders);
    } catch (e) {
      console.error("폴더 불러오기 실패:", e);
      alert("폴더를 불러오는데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  // 컴포넌트 마운트 시 폴더 목록 불러오기
  useEffect(() => {
    loadFolders();
    
    // 사용자 정보 로드
    const savedUserId = localStorage.getItem("userId");
    if (savedUserId) {
      const userId = parseInt(savedUserId, 10);
      getUserById(userId)
        .then((userInfo) => {
          setCurrentUserName(userInfo.username || "사용자");
        })
        .catch((error) => {
          console.error("사용자 정보 로드 실패:", error);
          setCurrentUserName("사용자");
        });
    }
  }, []);

  // 폴더 생성
  const handleCreateFolder = async () => {
    if (!newFolderName.trim()) {
      alert("폴더 이름을 입력해주세요.");
      return;
    }

    try {
      // localStorage에서 현재 사용자 ID 로드
      const savedUserId = localStorage.getItem("userId");
      if (!savedUserId) {
        alert("로그인이 필요합니다.");
        return;
      }
      
      const userId = parseInt(savedUserId, 10);
      const folderId = await createFolder({
        id: 0,
        name: newFolderName.trim(),
        userId,
        postIds: [],
      });

      const newFolder: Folder = {
        id: folderId || Date.now(),
        name: newFolderName.trim(),
        postCount: 0,
        postIds: []
      };

      setFolders([...folders, newFolder]);
      setNewFolderName("");
      setShowCreateModal(false);
      alert("폴더가 생성되었습니다.");
    } catch (e) {
      console.error(e);
      alert("폴더 생성에 실패했습니다.");
    }
  };

  // 폴더의 핀 목록 불러오기
  const loadFolderPins = async (folder: Folder) => {
    try {
      setPinsLoading(true);
      setSelectedFolder(folder);
      
      // 폴더에 포함된 핀들의 상세 정보 가져오기
      const pinPromises = folder.postIds.map(postId => getPostById(postId));
      const pins = await Promise.all(pinPromises);
      setFolderPins(pins);
      setCurrentView('pins');
    } catch (e) {
      console.error("폴더 핀 불러오기 실패:", e);
      alert("폴더의 핀을 불러오는데 실패했습니다.");
    } finally {
      setPinsLoading(false);
    }
  };

  // 모든 핀 목록 불러오기 (핀 추가용)
  const loadAllPins = async () => {
    try {
      setPinsLoading(true);
      const savedUserId = localStorage.getItem("userId");
      if (!savedUserId) {
        alert("로그인이 필요합니다.");
        return;
      }
      
      const userId = parseInt(savedUserId, 10);
      const response = await getPosts({
        userId: userId,
        page: 1,
        size: 100,
        sortBy: "postId",
        direction: "DESC"
      });
      
      setAllPins(response.dtoList || []);
      setSelectedPinIds([]);
      setCurrentView('addPins');
    } catch (e) {
      console.error("핀 목록 불러오기 실패:", e);
      alert("핀 목록을 불러오는데 실패했습니다.");
    } finally {
      setPinsLoading(false);
    }
  };

  // 핀 선택/해제
  const togglePinSelection = (postId: number) => {
    setSelectedPinIds(prev => 
      prev.includes(postId) 
        ? prev.filter(id => id !== postId)
        : [...prev, postId]
    );
  };

  // 선택된 핀들을 폴더에 추가
  const addPinsToFolder = async () => {
    if (!selectedFolder || selectedPinIds.length === 0) {
      alert("추가할 핀을 선택해주세요.");
      return;
    }

    try {
      const savedUserId = localStorage.getItem("userId");
      if (!savedUserId) {
        alert("로그인이 필요합니다.");
        return;
      }
      
      const userId = parseInt(savedUserId, 10);
      
      // 기존 핀들과 새로 선택된 핀들을 합침
      const updatedPostIds = [...selectedFolder.postIds, ...selectedPinIds];
      
      await updateFolder({
        id: selectedFolder.id,
        name: selectedFolder.name,
        userId,
        postIds: updatedPostIds
      });

      // 폴더 목록 업데이트
      setFolders(folders.map(folder => 
        folder.id === selectedFolder.id 
          ? { ...folder, postIds: updatedPostIds, postCount: updatedPostIds.length }
          : folder
      ));

      alert(`${selectedPinIds.length}개의 핀이 폴더에 추가되었습니다.`);
      setCurrentView('list');
      setSelectedFolder(null);
      setSelectedPinIds([]);
    } catch (e) {
      console.error("핀 추가 실패:", e);
      alert("핀 추가에 실패했습니다.");
    }
  };

  // 폴더 삭제
  const handleDeleteFolder = async (folderId: number) => {
    if (!confirm("정말로 이 폴더를 삭제하시겠습니까?")) {
      return;
    }

    try {
      await deleteFolder(folderId);
      setFolders(folders.filter(folder => folder.id !== folderId));
      alert("폴더가 삭제되었습니다.");
    } catch (e) {
      console.error(e);
      alert("폴더 삭제에 실패했습니다.");
    }
  };

  // 핀 클릭 핸들러
  const handlePinClick = async (postId: number) => {
    try {
      const postDetail = await getPostById(postId);
      if (onPinSelect) {
        onPinSelect(postDetail);
      }
    } catch (error) {
      console.error("핀 상세 정보 로드 실패:", error);
      alert("핀 정보를 불러올 수 없습니다.");
    }
  };

  // 뒤로가기
  const goBack = () => {
    setCurrentView('list');
    setSelectedFolder(null);
    setFolderPins([]);
    setAllPins([]);
    setSelectedPinIds([]);
  };

  return (
    <div className="w-full h-full flex flex-col">
      <div className="w-full h-full flex flex-col items-center p-10 gap-10 overflow-y-auto">
        {currentView === 'list' && (
          <>
            {loading ? (
              <div className="flex flex-col items-center justify-center h-full gap-6">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                <span className="text-xl text-gray-500">폴더를 불러오는 중...</span>
              </div>
            ) : folders.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full gap-6">
                <FontAwesomeIcon icon={faFolder} className="text-6xl text-gray-300" />
                <span className="text-xl text-gray-500">폴더가 없습니다</span>
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="flex items-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  <FontAwesomeIcon icon={faPlus} />
                  폴더 추가
                </button>
              </div>
            ) : (
              <>
                <div className="w-full flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-bold">내 폴더</h2>
                  <button
                    onClick={() => setShowCreateModal(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    <FontAwesomeIcon icon={faPlus} />
                    폴더 추가
                  </button>
                </div>

                {folders.map((folder) => (
                  <div
                    key={folder.id}
                    className="w-full flex items-center p-4 bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => loadFolderPins(folder)}
                  >
                    <div className="relative mr-5">
                      <div className="bg-blue-300 w-25 h-25 absolute -top-1.5 left-1.5"></div>
                      <div className="bg-blue-100 w-25 h-25 relative z-10 flex items-center justify-center">
                        <FontAwesomeIcon icon={faFolder} className="text-blue-600 text-lg" />
                      </div>
                    </div>
                    <div className="flex flex-col items-start flex-1">
                      <span className="text-xl font-semibold">{folder.name}</span>
                      <span className="text-sm text-gray-500 mt-1">
                        {folder.postCount}개의 핀
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteFolder(folder.id);
                        }}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        title="폴더 삭제"
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    </div>
                  </div>
                ))}
              </>
            )}
          </>
        )}

        {currentView === 'pins' && selectedFolder && (
          <div className="w-full h-full flex flex-col">
            <div className="flex items-center gap-4 mb-6">
              <button
                onClick={goBack}
                className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <FontAwesomeIcon icon={faArrowLeft} />
              </button>
              <h2 className="text-2xl font-bold">{selectedFolder.name}</h2>
              <button
                onClick={loadAllPins}
                className="ml-auto flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
              >
                <FontAwesomeIcon icon={faPlus} />
                핀 추가
              </button>
            </div>

            {pinsLoading ? (
              <div className="flex flex-col items-center justify-center h-full gap-6">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                <span className="text-xl text-gray-500">핀을 불러오는 중...</span>
              </div>
            ) : folderPins.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full gap-6">
                <span className="text-xl text-gray-500">이 폴더에는 핀이 없습니다</span>
                <button
                  onClick={loadAllPins}
                  className="flex items-center gap-2 px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                >
                  <FontAwesomeIcon icon={faPlus} />
                  핀 추가하기
                </button>
              </div>
            ) : (
              <div className="w-full">
                {folderPins.map((pin) => {
                  const thumb = pin.files && pin.files.length > 0 ? pin.files[0].url : "";
                  const { date: extractedDate } = parseContent(pin.content);
                  return (
                    <div 
                      key={pin.postId} 
                      className="w-full flex items-center cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors mb-2"
                      onClick={() => handlePinClick(pin.postId)}
                    >
                      <div className="relative mr-5">
                        <div className="bg-gray-300 w-25 h-25 absolute -top-1.5 left-1.5"></div>
                        <div className="bg-white w-25 h-25 relative z-10 overflow-hidden flex items-center justify-center">
                          {thumb ? (
                            <img
                              src={thumb}
                              alt={pin.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-gray-100"></div>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-col items-start">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-gray-200 rounded-full mr-2"></div>
                          <span className="text-xl">{currentUserName || "사용자"}</span>
                        </div>
                        <span className="text-xl mt-2">
                          {extractedDate || "날짜 없음"}
                        </span>
                        <span className="text-xl mt-1">{pin.title}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {currentView === 'addPins' && selectedFolder && (
          <div className="w-full h-full flex flex-col">
            <div className="flex items-center gap-4 mb-6">
              <button
                onClick={goBack}
                className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <FontAwesomeIcon icon={faArrowLeft} />
              </button>
              <h2 className="text-xl font-bold">{selectedFolder.name}에 핀 추가</h2>
              <button
                onClick={addPinsToFolder}
                disabled={selectedPinIds.length === 0}
                className="ml-auto flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed text-sm"
              >
                <FontAwesomeIcon icon={faCheck} />
                {selectedPinIds.length}개 핀 추가
              </button>
            </div>

            {pinsLoading ? (
              <div className="flex flex-col items-center justify-center h-full gap-6">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                <span className="text-xl text-gray-500">핀을 불러오는 중...</span>
              </div>
            ) : allPins.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full gap-6">
                <span className="text-xl text-gray-500">추가할 핀이 없습니다</span>
              </div>
            ) : (
              <div className="w-full">
                {allPins.map((pin) => {
                  const isSelected = selectedPinIds.includes(pin.postId);
                  const isAlreadyInFolder = selectedFolder.postIds.includes(pin.postId);
                  const thumb = pin.files && pin.files.length > 0 ? pin.files[0].url : "";
                  const { date: extractedDate } = parseContent(pin.content);
                  
                  return (
                    <div
                      key={pin.postId}
                      className={`w-full flex items-center p-2 rounded-lg transition-all cursor-pointer mb-2 ${
                        isAlreadyInFolder 
                          ? 'bg-gray-100 opacity-50 cursor-not-allowed'
                          : isSelected 
                            ? 'bg-blue-100 hover:bg-blue-200' 
                            : 'hover:bg-gray-50'
                      }`}
                      onClick={() => !isAlreadyInFolder && togglePinSelection(pin.postId)}
                    >
                      <div className="relative mr-5">
                        <div className="bg-gray-300 w-25 h-25 absolute -top-1.5 left-1.5"></div>
                        <div className="bg-white w-25 h-25 relative z-10 overflow-hidden flex items-center justify-center">
                          {thumb ? (
                            <img
                              src={thumb}
                              alt={pin.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-gray-100"></div>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-col items-start flex-1">
                        <div className="flex items-center gap-2 w-full">
                          <div className="w-8 h-8 bg-gray-200 rounded-full mr-2"></div>
                          <span className="text-xl">{currentUserName || "사용자"}</span>
                          {isSelected && (
                            <FontAwesomeIcon icon={faCheck} className="text-blue-500 ml-auto" />
                          )}
                          {isAlreadyInFolder && (
                            <span className="text-xs text-gray-500 ml-auto">이미 추가됨</span>
                          )}
                        </div>
                        <span className="text-xl mt-2">
                          {extractedDate || "날짜 없음"}
                        </span>
                        <span className="text-xl mt-1">{pin.title}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {/* 폴더 생성 모달 */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <h3 className="text-xl font-bold mb-4">새 폴더 만들기</h3>
            <input
              type="text"
              placeholder="폴더 이름을 입력하세요"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleCreateFolder()}
            />
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  setNewFolderName("");
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                취소
              </button>
              <button
                onClick={handleCreateFolder}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                생성
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default PinFolder;
