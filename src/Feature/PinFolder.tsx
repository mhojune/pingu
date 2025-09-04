import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faFolder, faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import { createFolder, getUserFolders, updateFolder, deleteFolder } from "../api/folders";

type Folder = {
  id: number;
  name: string;
  postCount: number;
};

const PinFolder = () => {
  const [folders, setFolders] = useState<Folder[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [editingFolder, setEditingFolder] = useState<Folder | null>(null);
  const [loading, setLoading] = useState(true);

  // 폴더 목록 불러오기
  const loadFolders = async () => {
    try {
      setLoading(true);
      // TODO: 실제 로그인 사용자 ID 연동 필요
      const userId = 1;
      const folderData = await getUserFolders(userId);
      
      // API 응답을 Folder 타입에 맞게 변환
      const transformedFolders: Folder[] = folderData.map(folder => ({
        id: folder.id,
        name: folder.name,
        postCount: folder.postIds?.length || 0
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
  }, []);

  // 폴더 생성
  const handleCreateFolder = async () => {
    if (!newFolderName.trim()) {
      alert("폴더 이름을 입력해주세요.");
      return;
    }

    try {
      // TODO: 실제 로그인 사용자 ID 연동 필요
      const userId = 1;
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

  // 폴더 수정
  const handleEditFolder = async () => {
    if (!editingFolder || !newFolderName.trim()) {
      alert("폴더 이름을 입력해주세요.");
      return;
    }

    try {
      // TODO: 실제 로그인 사용자 ID 연동 필요
      const userId = 1;
      await updateFolder({
        id: editingFolder.id,
        name: newFolderName.trim(),
        userId,
        postIds: [], // 기존 포스트 ID들은 유지해야 하지만 현재는 빈 배열로 처리
      });

      setFolders(folders.map(folder => 
        folder.id === editingFolder.id 
          ? { ...folder, name: newFolderName.trim() }
          : folder
      ));
      
      setNewFolderName("");
      setShowEditModal(false);
      setEditingFolder(null);
      alert("폴더가 수정되었습니다.");
    } catch (e) {
      console.error(e);
      alert("폴더 수정에 실패했습니다.");
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

  // 수정 모달 열기
  const openEditModal = (folder: Folder) => {
    setEditingFolder(folder);
    setNewFolderName(folder.name);
    setShowEditModal(true);
  };

  return (
    <div className="w-full h-full flex flex-col">
      <div className="w-full h-full flex flex-col items-center p-10 gap-10 overflow-y-auto">
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
                className="w-full flex items-center p-4 bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
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
                    onClick={() => openEditModal(folder)}
                    className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                    title="폴더 수정"
                  >
                    <FontAwesomeIcon icon={faEdit} />
                  </button>
                  <button
                    onClick={() => handleDeleteFolder(folder.id)}
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

      {/* 폴더 수정 모달 */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <h3 className="text-xl font-bold mb-4">폴더 수정</h3>
            <input
              type="text"
              placeholder="폴더 이름을 입력하세요"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleEditFolder()}
            />
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setNewFolderName("");
                  setEditingFolder(null);
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                취소
              </button>
              <button
                onClick={handleEditFolder}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                수정
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PinFolder;
