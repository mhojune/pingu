import { useEffect, useState } from "react";
import { getPosts } from "../api/posts";
import type { PostResponseDTO } from "../api/types";

const PinList = () => {
  const [posts, setPosts] = useState<PostResponseDTO[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await getPosts({
          page: 0,
          size: 20,
          sortBy: "postId",
          direction: "DESC",
        });
        if (!mounted) return;
        setPosts(res.dtoList ?? []);
      } catch (e) {
        setError("목록을 불러오지 못했습니다.");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="w-full h-full flex flex-col">
      <div className="w-full h-full flex flex-col items-center p-10 gap-10 overflow-y-auto">
        {loading && <span className="text-xl">불러오는 중...</span>}
        {error && <span className="text-red-600">{error}</span>}
        {!loading &&
          !error &&
          posts.map((post) => {
            const thumb = post.files && post.files.length > 0 ? post.files[0].url : "";
            return (
              <div key={post.postId} className="w-full flex items-center">
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
                    <span className="text-xl">User {post.userId}</span>
                  </div>
                  <span className="text-xl mt-2">
                    {new Date().toISOString().slice(0, 10)}
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
