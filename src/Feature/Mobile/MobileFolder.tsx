import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleLeft, faPlus, faFolder, faTrash } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import { createFolder, getUserFolders, updateFolder, deleteFolder } from "../../api/folders";
import { getPosts, getPostById } from "../../api/posts";
import { getUserById } from "../../api/users";
import type { PostResponseDTO } from "../../api/types";

type Folder = {
  id: number;
  name: string;
  postCount: number;
  postIds: number[];
};

type FolderView = 'list' | 'pins' | 'addPins';

type MobileFolderProps = {
  setShowMobileFolder: (value: boolean) => void;
  onPinSelect?: (post: PostResponseDTO) => void;
  refreshTrigger?: number;
};

const MobileFolder = ({ setShowMobileFolder, onPinSelect, refreshTrigger }: MobileFolderProps) => {
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
  const [error, setError] = useState<string>("");

  // content에서 날짜와 내용을 분리하는 함수
  const parseContent = (content: string) => {
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
      const savedUserId = localStorage.getItem("userId");
      if (!savedUserId) {
        setError("로그인이 필요합니다.");
        setLoading(false);
        return;
      }

      const userId = parseInt(savedUserId, 10);
      const userInfo = await getUserById(userId);
      setCurrentUserName(userInfo.username || "사용자");

      const foldersData = await getUserFolders(userId);
      // PostFolderDTO를 Folder 타입으로 변환
      const folders = foldersData.map(folder => ({
        id: folder.id,
        name: folder.name,
        postCount: folder.postIds.length,
        postIds: folder.postIds
      }));
      setFolders(folders);
    } catch (e) {
      console.error("폴더 목록 로드 실패:", e);
      setError("폴더 목록을 불러오지 못했습니다.");
    } finally {
      setLoading(false);
    }
  };

  // 모든 핀 불러오기
  const loadAllPins = async () => {
    try {
      const savedUserId = localStorage.getItem("userId");
      if (!savedUserId) return;

      const userId = parseInt(savedUserId, 10);
      const res = await getPosts({
        userId: userId,
        page: 1,
        size: 100,
        sortBy: "postId",
        direction: "DESC",
      });
      setAllPins(res.dtoList ?? []);
    } catch (e) {
      console.error("핀 목록 로드 실패:", e);
    }
  };

  // 폴더의 핀들 불러오기
  const loadFolderPins = async (folder: Folder) => {
    setPinsLoading(true);
    try {
      const pins = [];
      for (const postId of folder.postIds) {
        try {
          const post = await getPostById(postId);
          pins.push(post);
        } catch (e) {
          console.error(`핀 ${postId} 로드 실패:`, e);
        }
      }
      setFolderPins(pins);
    } catch (e) {
      console.error("폴더 핀 로드 실패:", e);
    } finally {
      setPinsLoading(false);
    }
  };

  useEffect(() => {
    loadFolders();
  }, [refreshTrigger]);

  useEffect(() => {
    if (currentView === 'addPins') {
      loadAllPins();
    }
  }, [currentView]);

  // 폴더 생성
  const handleCreateFolder = async () => {
    if (!newFolderName.trim()) {
      alert("폴더 이름을 입력해주세요.");
      return;
    }

    try {
      const savedUserId = localStorage.getItem("userId");
      if (!savedUserId) return;

      const userId = parseInt(savedUserId, 10);
      await createFolder({
        id: 0, // 새 폴더이므로 0으로 설정
        userId: userId,
        name: newFolderName.trim(),
        postIds: []
      });
      
      setNewFolderName("");
      setShowCreateModal(false);
      loadFolders();
      alert("폴더가 생성되었습니다.");
    } catch (e) {
      console.error("폴더 생성 실패:", e);
      alert("폴더 생성에 실패했습니다.");
    }
  };

  // 폴더 삭제
  const handleDeleteFolder = async (folderId: number) => {
    if (!confirm("정말로 이 폴더를 삭제하시겠습니까?")) return;

    try {
      await deleteFolder(folderId);
      loadFolders();
      alert("폴더가 삭제되었습니다.");
    } catch (e) {
      console.error("폴더 삭제 실패:", e);
      alert("폴더 삭제에 실패했습니다.");
    }
  };

  // 폴더 선택
  const handleFolderSelect = (folder: Folder) => {
    setSelectedFolder(folder);
    setCurrentView('pins');
    loadFolderPins(folder);
  };

  // 핀 선택
  const handlePinClick = async (postId: number) => {
    console.log("핀 클릭됨:", postId);
    try {
      const postDetail = await getPostById(postId);
      console.log("핀 상세 정보 로드됨:", postDetail);
      if (onPinSelect) {
        console.log("onPinSelect 호출됨");
        onPinSelect(postDetail);
      } else {
        console.log("onPinSelect가 없습니다");
      }
    } catch (error) {
      console.error("핀 상세 정보 로드 실패:", error);
      alert("핀 정보를 불러올 수 없습니다.");
    }
  };

  // 뒤로가기
  const handleBack = () => {
    if (currentView === 'list') {
      setShowMobileFolder(false);
    } else if (currentView === 'pins') {
      setCurrentView('list');
      setSelectedFolder(null);
      setFolderPins([]);
    } else if (currentView === 'addPins') {
      setCurrentView('pins');
      setSelectedPinIds([]);
    }
  };

  // 폴더에 핀 추가
  const handleAddPinsToFolder = async () => {
    if (!selectedFolder || selectedPinIds.length === 0) return;

    try {
      const savedUserId = localStorage.getItem("userId");
      if (!savedUserId) {
        alert("로그인이 필요합니다.");
        return;
      }
      
      const userId = parseInt(savedUserId, 10);
      const updatedPostIds = [...selectedFolder.postIds, ...selectedPinIds];
      
      await updateFolder({
        id: selectedFolder.id,
        name: selectedFolder.name,
        userId: userId,
        postIds: updatedPostIds
      });
      
      setSelectedPinIds([]);
      setCurrentView('pins');
      loadFolders();
      loadFolderPins({ ...selectedFolder, postIds: updatedPostIds });
      alert("핀이 폴더에 추가되었습니다.");
    } catch (e) {
      console.error("핀 추가 실패:", e);
      alert("핀 추가에 실패했습니다.");
    }
  };

  return (
    <div className="w-full h-full bg-[#fafaf8] flex md:hidden">
      <div className="w-full h-full flex flex-col">
        {/* 헤더 영역 */}
        <div className="w-full flex items-center justify-between p-3 mt-3">
          <FontAwesomeIcon
            icon={faAngleLeft}
            className="text-xl cursor-pointer"
            onClick={handleBack}
          />
          <span className="absolute left-1/2 text-lg transform -translate-x-1/2">
            {currentView === 'list' ? '폴더' : 
             currentView === 'pins' ? selectedFolder?.name || '폴더' : 
             '핀 추가'}
          </span>
          {currentView === 'list' && (
            <FontAwesomeIcon
              icon={faPlus}
              className="text-xl cursor-pointer"
              onClick={() => setShowCreateModal(true)}
            />
          )}
          {currentView === 'addPins' && (
            <button
              className="text-sm bg-blue-500 text-white px-3 py-1 rounded"
              onClick={handleAddPinsToFolder}
              disabled={selectedPinIds.length === 0}
            >
              추가 ({selectedPinIds.length})
            </button>
          )}
        </div>

        {/* 내용 영역 */}
        <div className="flex-1 p-3 overflow-y-auto">
          {loading && <span className="text-xl">불러오는 중...</span>}
          {error && <span className="text-red-600">{error}</span>}
          
          {/* 폴더 목록 뷰 */}
          {!loading && !error && currentView === 'list' && (
            <>
              {folders.length === 0 ? (
                <div className="flex flex-col items-center gap-4 mt-20">
                  <div className="text-6xl">📁</div>
                  <span className="text-2xl text-gray-500">아직 폴더가 없습니다</span>
                  <span className="text-lg text-gray-400">첫 번째 폴더를 만들어보세요!</span>
                </div>
              ) : (
                <div className="space-y-3">
                  {folders.map((folder) => (
                    <div
                      key={folder.id}
                      className="bg-white p-4 rounded-lg shadow-sm border cursor-pointer hover:bg-gray-50 transition-colors"
                      onClick={() => handleFolderSelect(folder)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <FontAwesomeIcon icon={faFolder} className="text-2xl text-blue-500" />
                          <div>
                            <h3 className="text-lg font-semibold">{folder.name}</h3>
                            <p className="text-sm text-gray-500">{folder.postCount}개의 핀</p>
                          </div>
                        </div>
                        <FontAwesomeIcon
                          icon={faTrash}
                          className="text-red-500 cursor-pointer hover:text-red-700"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteFolder(folder.id);
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {/* 폴더 내 핀 목록 뷰 */}
          {!loading && !error && currentView === 'pins' && (
            <>
              {pinsLoading ? (
                <span className="text-xl">불러오는 중...</span>
              ) : folderPins.length === 0 ? (
                <div className="flex flex-col items-center gap-4 mt-20">
                  <div className="text-6xl">📌</div>
                  <span className="text-2xl text-gray-500">이 폴더에 핀이 없습니다</span>
                  <button
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg"
                    onClick={() => setCurrentView('addPins')}
                  >
                    핀 추가하기
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold">핀 목록</span>
                    <button
                      className="bg-blue-500 text-white px-3 py-1 rounded text-sm"
                      onClick={() => setCurrentView('addPins')}
                    >
                      핀 추가
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {folderPins.map((post) => {
                      const thumb = post.files && post.files.length > 0 ? post.files[0].url : "";
                      const { date } = parseContent(post.content);
                      return (
                        <div 
                          key={post.postId} 
                          className="w-full flex items-center p-2 cursor-pointer hover:bg-gray-100 rounded-lg transition-colors"
                          onClick={() => handlePinClick(post.postId)}
                        >
                          <div className="relative mr-2">
                            <div className="bg-gray-300 w-16 h-16 absolute -top-1 left-1"></div>
                            <div className="bg-white w-16 h-16 relative z-10 overflow-hidden flex items-center justify-center">
                              {thumb ? (
                                <img
                                  src={thumb}
                                  alt={post.title}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full bg-gray-100"></div>
                              )}
                            </div>
                          </div>
                          <div className="flex flex-col items-start">
                            <div className="flex items-center gap-1">
                              <div className="w-5 h-5 bg-gray-200 rounded-full mr-1"></div>
                              <span className="text-xs">{currentUserName || "사용자"}</span>
                            </div>
                            <span className="text-xs mt-1">
                              {date || new Date().toISOString().slice(0, 10)}
                            </span>
                            <span className="text-xs mt-1">{post.title}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </>
          )}

          {/* 핀 추가 뷰 */}
          {!loading && !error && currentView === 'addPins' && (
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold">핀 선택</span>
                <span className="text-sm text-gray-500">{selectedPinIds.length}개 선택됨</span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {allPins.map((post) => {
                  const thumb = post.files && post.files.length > 0 ? post.files[0].url : "";
                  const { date } = parseContent(post.content);
                  const isSelected = selectedPinIds.includes(post.postId);
                  return (
                    <div 
                      key={post.postId} 
                      className={`w-full flex items-center p-2 cursor-pointer rounded-lg transition-colors ${
                        isSelected ? 'bg-blue-100 border-2 border-blue-500' : 'hover:bg-gray-100'
                      }`}
                      onClick={() => {
                        if (isSelected) {
                          setSelectedPinIds(prev => prev.filter(id => id !== post.postId));
                        } else {
                          setSelectedPinIds(prev => [...prev, post.postId]);
                        }
                      }}
                    >
                      <div className="relative mr-2">
                        <div className="bg-gray-300 w-16 h-16 absolute -top-1 left-1"></div>
                        <div className="bg-white w-16 h-16 relative z-10 overflow-hidden flex items-center justify-center">
                          {thumb ? (
                            <img
                              src={thumb}
                              alt={post.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-gray-100"></div>
                          )}
                        </div>
                        {isSelected && (
                          <div className="absolute top-0 right-0 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                            <span className="text-white text-xs">✓</span>
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col items-start">
                        <div className="flex items-center gap-1">
                          <div className="w-5 h-5 bg-gray-200 rounded-full mr-1"></div>
                          <span className="text-xs">{currentUserName || "사용자"}</span>
                        </div>
                        <span className="text-xs mt-1">
                          {date || new Date().toISOString().slice(0, 10)}
                        </span>
                        <span className="text-xs mt-1">{post.title}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 폴더 생성 모달 */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowCreateModal(false)} />
          <div className="relative z-10 w-full max-w-md rounded-lg bg-white p-6 shadow-xl mx-4">
            <h3 className="text-lg font-semibold mb-4">새 폴더 만들기</h3>
            <input
              type="text"
              placeholder="폴더 이름을 입력하세요"
              className="w-full rounded border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-400 mb-4"
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleCreateFolder()}
            />
            <div className="flex gap-2">
              <button
                className="flex-1 bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
                onClick={handleCreateFolder}
              >
                생성
              </button>
              <button
                className="flex-1 bg-gray-300 text-gray-700 py-2 rounded hover:bg-gray-400"
                onClick={() => setShowCreateModal(false)}
              >
                취소
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MobileFolder;
