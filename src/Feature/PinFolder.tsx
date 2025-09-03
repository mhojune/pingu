import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faFolder } from "@fortawesome/free-solid-svg-icons";
import { createFolder } from "../api/folders";

type Folder = {
  id: number;
  name: string;
  postCount: number;
};

const PinFolder = () => {
  // 더미 데이터 - 폴더가 없는 상태로 시작
  const [folders, setFolders] = useState<Folder[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");

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

  return (
    <div className="w-full h-full flex flex-col">
      <div className="w-full h-full flex flex-col items-center p-10 gap-10 overflow-y-auto">
        {folders.length === 0 ? (
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
    </div>
  );
};

export default PinFolder;
