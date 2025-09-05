import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleLeft } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import { getPosts, getPostById } from "../../api/posts";
import { getUserById } from "../../api/users";
import type { PostResponseDTO } from "../../api/types";

type MobilePinListProps = {
  setShowMobilePinList: (value: boolean) => void;
  onPinSelect?: (post: PostResponseDTO) => void;
  refreshTrigger?: number;
};

const MobilePinList = ({ setShowMobilePinList, onPinSelect, refreshTrigger }: MobilePinListProps) => {
  const [posts, setPosts] = useState<PostResponseDTO[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [currentUserName, setCurrentUserName] = useState<string>("");

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        // 현재 사용자 ID 로드
        const savedUserId = localStorage.getItem("userId");
        if (!savedUserId) {
          setError("로그인이 필요합니다.");
          setLoading(false);
          return;
        }

        const userId = parseInt(savedUserId, 10);

        // 사용자 정보 가져오기
        const userInfo = await getUserById(userId);
        if (!mounted) return;
        setCurrentUserName(userInfo.username || "사용자");

        // 현재 사용자의 핀들 가져오기
        const res = await getPosts({
          userId: userId,
          page: 1,
          size: 10,
          sortBy: "postId",
          direction: "DESC",
        });
        if (!mounted) return;
        setPosts(res.dtoList ?? []);
      } catch (e) {
        console.error("핀 목록 로드 실패:", e);
        setError("목록을 불러오지 못했습니다.");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [refreshTrigger]);

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

  return (
    <div className="w-full h-full bg-[#fafaf8] flex md:hidden">
      <div className="w-full h-full flex flex-col">
        {/* 헤더 영역 */}
        <div className="w-full flex items-center justify-between p-3 mt-3">
          <FontAwesomeIcon
            icon={faAngleLeft}
            className="text-xl cursor-pointer"
            onClick={() => setShowMobilePinList(false)}
          />
          <span className="absolute left-1/2 text-lg transform -translate-x-1/2">
            핀 선택
          </span>
          <div className="w-6"></div>
        </div>
        {/* 내용 영역 */}
        <div className="flex-1 p-3 overflow-y-auto">
          {loading && <span className="text-xl">불러오는 중...</span>}
          {error && <span className="text-red-600">{error}</span>}
          {!loading && !error && posts.length === 0 && (
            <div className="flex flex-col items-center gap-4 mt-20">
              <div className="text-6xl">📌</div>
              <span className="text-2xl text-gray-500">아직 등록된 핀이 없습니다</span>
              <span className="text-lg text-gray-400">첫 번째 핀을 만들어보세요!</span>
            </div>
          )}
          {!loading && !error && posts.length > 0 && (
            <div className="grid grid-cols-2 gap-3">
              {posts.map((post) => {
                const thumb = post.files && post.files.length > 0 ? post.files[0].url : "";
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
                        {new Date().toISOString().slice(0, 10)}
                      </span>
                      <span className="text-xs mt-1">{post.title}</span>
              </div>
            </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MobilePinList;
