import { faLocationDot } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import PhotoFrame from "../common/PhotoFrame";
import { faCalendar } from "@fortawesome/free-regular-svg-icons";
import { useMemo, useState, useEffect, useCallback } from "react";
import { createPost, updatePost } from "../api/posts";
import { getUserById } from "../api/users";
import type { PostResponseDTO } from "../api/types";

type PinPageProps = {
  selectedLocation: {
    address: string;
    lat: number;
    lng: number;
  } | null;
  onLocationEdit: () => void;
  pinPageState: {
    title: string;
    content: string;
    dateStr: string;
    files: File[];
  };
  setPinPageState: React.Dispatch<React.SetStateAction<{
    title: string;
    content: string;
    dateStr: string;
    files: File[];
  }>>;
  selectedPost?: PostResponseDTO | null;
  isEditMode?: boolean;
  onSuccess?: () => void;
};

const PinPage = ({ selectedLocation, onLocationEdit, pinPageState, setPinPageState, selectedPost, isEditMode = false, onSuccess }: PinPageProps) => {
  const { title, content, dateStr, files } = pinPageState;
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const [currentUserName, setCurrentUserName] = useState<string>("");
  
  const setTitle = useCallback((value: string) => setPinPageState(prev => ({ ...prev, title: value })), [setPinPageState]);
  const setContent = useCallback((value: string) => setPinPageState(prev => ({ ...prev, content: value })), [setPinPageState]);
  const setDateStr = useCallback((value: string) => setPinPageState(prev => ({ ...prev, dateStr: value })), [setPinPageState]);
  const setFiles = useCallback((value: File[]) => setPinPageState(prev => ({ ...prev, files: value })), [setPinPageState]);

  // localStorage에서 현재 사용자 ID 로드 및 사용자 정보 가져오기
  useEffect(() => {
    const savedUserId = localStorage.getItem("userId");
    if (savedUserId) {
      const userId = parseInt(savedUserId, 10);
      setCurrentUserId(userId);
      
      // 사용자 정보 가져오기
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

  // 선택된 핀의 내용을 pinPageState에 설정 (초기 로드 시에만)
  useEffect(() => {
    if (selectedPost && isEditMode && pinPageState.title === "" && pinPageState.content === "") {
      console.log("PinPage - 초기 데이터 로드:", selectedPost);
      const { date: extractedDate, content: extractedContent } = parseContent(selectedPost.content);
      
      setPinPageState({
        title: selectedPost.title,
        content: extractedContent, // 날짜를 제외한 내용만
        dateStr: extractedDate || "", // 추출된 날짜
        files: [] // 파일은 선택된 핀에서 가져올 수 없으므로 빈 배열
      });
    }
  }, [selectedPost, isEditMode, setPinPageState, pinPageState.title, pinPageState.content]);

  
  const isSubmittable = useMemo(
    () => title.trim().length > 0 && content.trim().length > 0,
    [title, content]
  );

  return (
    <div className="absolute top-0 left-0 w-full h-full bg-white z-20 flex flex-col items-center">
      <div
        className="w-full max-w-7xl px-5 sm:px-10 md:px-20 lg:px-40 xl:px-60 flex flex-col items-center overflow-y-scroll"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        <PhotoFrame 
          files={files} 
          onFilesChange={setFiles} 
          existingImageUrl={isEditMode && selectedPost?.files && selectedPost.files.length > 0 ? selectedPost.files[0].url : undefined}
        />
        <div className="w-full flex flex-col items-center md:px-15">
          <div className="w-full flex items-center mb-5">
            <span className="md:text-3xl text-2xl">{currentUserName || "사용자"}</span>
          </div>
          <div className="w-full flex flex-col gap-1 md:mb-7 mb-5">
            <label htmlFor="title" className="md:text-xl text-lg">
              제목
            </label>
            <div className="w-full flex items-center border-1 border-gray-200 rounded-md md:p-3 p-2">
              <input
                type="text"
                placeholder="핀 제목을 입력해주세요"
                id="title"
                className="w-full outline-none focus:outline-none md:text-xl text-lg"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
          </div>
          <div className="w-full flex flex-1 md:gap-15 gap-5 pb-2 md:mb-7 mb-5">
            <div className="flex items-center">
              <FontAwesomeIcon
                icon={faCalendar}
                className="text-black md:text-3xl text-xl mr-2"
              />
              <input
                type="date"
                className="appearance-none focus:outline-none md:text-2xl text-xl"
                style={{
                  WebkitAppearance: "none",
                  MozAppearance: "textfield",
                  appearance: "none",
                  backgroundColor: "transparent",
                  position: "relative",
                  zIndex: 2,
                }}
                value={dateStr}
                onChange={(e) => setDateStr(e.target.value)}
              />
            </div>
            <div className="flex flex-1 items-center w-1/2">
              <FontAwesomeIcon
                icon={faLocationDot}
                className="text-black md:text-3xl text-xl mr-2 flex-shrink-0"
              />
              <div
                className="md:text-2xl text-xl underline underline-offset-7 overflow-x-auto whitespace-nowrap cursor-pointer hover:text-blue-600 transition-colors"
                style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                onWheel={(e) => {
                  e.preventDefault();
                  const container = e.currentTarget;
                  container.scrollLeft += e.deltaY;
                }}
                onClick={onLocationEdit}
              >
                {selectedLocation ? selectedLocation.address : "위치를 입력해 주세요"}
              </div>
            </div>
          </div>
          <div className="w-full flex flex-col gap-1 md:mb-7 mb-5">
            <label htmlFor="content" className="md:text-xl text-lg">
              내용
            </label>
            <div className="w-full border-1 border-gray-200 rounded-md md:p-3 p-2">
              <textarea
                placeholder="핀 내용을 입력해주세요"
                id="content"
                className="w-full min-h-32 resize-none outline-none focus:outline-none md:text-xl text-lg"
                rows={6}
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
            </div>
          </div>
          <div className="w-full flex justify-end md:mb-10 mb-6">
            <button
              className={`px-5 py-2 rounded-md text-white md:text-xl text-lg ${
                isSubmittable ? "bg-black" : "bg-gray-400 cursor-not-allowed"
              }`}
              disabled={!isSubmittable}
              onClick={async () => {
                if (!currentUserId) {
                  alert("로그인이 필요합니다.");
                  return;
                }

                try {
                  // 사용자 ID 유효성 확인
                  try {
                    const userInfo = await getUserById(currentUserId);
                    console.log("사용자 ID 유효성 확인 완료:", currentUserId, userInfo);
                  } catch (userError) {
                    console.error("사용자 ID 유효성 확인 실패:", userError);
                    alert("유효하지 않은 사용자입니다. 다시 로그인해주세요.");
                    return;
                  }
                  const form = new FormData();
                  
                  // 날짜가 있으면 content에 포함
                  const contentWithDate = dateStr 
                    ? `📅 ${dateStr}\n\n${content}`
                    : content;
                  
                  // curl 예제와 같은 방식으로 개별 필드 추가
                  form.append("userId", currentUserId.toString());
                  form.append("title", title);
                  form.append("content", contentWithDate);
                  form.append("longitude", selectedLocation?.lng?.toString() ?? "");
                  form.append("latitude", selectedLocation?.lat?.toString() ?? "");
                  form.append("scope", "PUBLIC");
                  
                  // 파일이 있을 때만 추가
                  if (files.length > 0) {
                    console.log("파일 업로드 시도:", files.map((f) => ({ name: f.name, type: f.type, size: f.size })));
                    files.forEach((f) => form.append("files", f));
                  } else {
                    console.log("파일 없이 게시글 등록 시도");
                  }

                  // 전송 데이터 콘솔 확인
                  const fdPreview: Record<string, unknown[]> = {};
                  for (const [key, value] of form.entries()) {
                    if (!fdPreview[key]) fdPreview[key] = [];
                    if (value instanceof File) {
                      fdPreview[key].push({
                        name: value.name,
                        type: value.type,
                        size: value.size,
                      });
                    } else {
                      fdPreview[key].push(
                        typeof value === "string" ? value : "(non-string value)"
                      );
                    }
                  }
                  console.log("[PinPage] FormData entries:", fdPreview);

                  if (isEditMode && selectedPost) {
                    await updatePost(selectedPost.postId, form);
                    alert("수정되었습니다.");
                  } else {
                    await createPost(form);
                    alert("등록되었습니다.");
                  }
                  
                  // 제출 성공 후 상태 초기화
                  setPinPageState({
                    title: "",
                    content: "",
                    dateStr: "",
                    files: []
                  });
                  
                  // 상위 컴포넌트에 성공 알림
                  if (onSuccess) {
                    onSuccess();
                  }
                } catch (e) {
                  console.error("게시글 등록 실패:", e);
                  
                  // 에러 메시지에 따라 다른 알림 표시
                  if (e instanceof Error && e.message.includes("FileNotFoundException")) {
                    alert("파일 업로드에 실패했습니다. 백엔드 업로드 디렉토리를 확인해주세요.");
                  } else if (e instanceof Error && e.message.includes("500")) {
                    alert("서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
                  } else {
                    alert("등록에 실패했습니다. 다시 시도해주세요.");
                  }
                }
              }}
            >
              {isEditMode ? "수정" : "제출"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PinPage;
