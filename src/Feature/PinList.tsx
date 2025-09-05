import { useEffect, useState } from "react";
import { getPosts, getPostById } from "../api/posts";
import { getUserById } from "../api/users";
import type { PostResponseDTO } from "../api/types";

type PinListProps = {
  onPinSelect?: (post: PostResponseDTO) => void;
  refreshTrigger?: number; // 새로고침 트리거
};

const PinList = ({ onPinSelect, refreshTrigger }: PinListProps) => {
  const [posts, setPosts] = useState<PostResponseDTO[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
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

  useEffect(() => {
    console.log("PinList useEffect 실행, refreshTrigger:", refreshTrigger);
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
    try {
      const postDetail = await getPostById(postId);
      // 상위 컴포넌트에 선택된 핀 정보 전달
      if (onPinSelect) {
        onPinSelect(postDetail);
      }
    } catch (error) {
      console.error("핀 상세 정보 로드 실패:", error);
      alert("핀 정보를 불러올 수 없습니다.");
    }
  };


  return (
    <div className="w-full h-full flex flex-col">
      <div className="w-full h-full flex flex-col items-center p-10 gap-10 overflow-y-auto">
        {loading && <span className="text-xl">불러오는 중...</span>}
        {error && <span className="text-red-600">{error}</span>}
        {!loading && !error && posts.length === 0 && (
          <div className="flex flex-col items-center gap-4 mt-20">
            <div className="text-6xl">📌</div>
            <span className="text-2xl text-gray-500">아직 등록된 핀이 없습니다</span>
            <span className="text-lg text-gray-400">첫 번째 핀을 만들어보세요!</span>
          </div>
        )}
        {!loading &&
          !error &&
          posts.length > 0 &&
          posts.map((post) => {
            const thumb = post.files && post.files.length > 0 ? post.files[0].url : "";
            const { date: extractedDate } = parseContent(post.content);
            return (
              <div 
                key={post.postId} 
                className="w-full flex items-center cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors"
                onClick={() => handlePinClick(post.postId)}
              >
                <div className="relative mr-5">
                  <div className="bg-gray-300 w-25 h-25 absolute -top-1.5 left-1.5"></div>
                  <div className="bg-white w-25 h-25 relative z-10 overflow-hidden flex items-center justify-center">
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
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gray-200 rounded-full mr-2"></div>
                    <span className="text-xl">{currentUserName || "사용자"}</span>
                  </div>
                  <span className="text-xl mt-2">
                    {extractedDate || "날짜 없음"}
                  </span>
                  <span className="text-xl mt-1">{post.title}</span>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default PinList;
