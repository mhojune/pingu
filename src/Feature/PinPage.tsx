import { faPencil, faLocationDot } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import PhotoFrame from "../common/PhotoFrame";
import { faTrashCan, faImage, faCalendar } from "@fortawesome/free-regular-svg-icons";
import { useMemo, useState, useEffect } from "react";
import { createPost } from "../api/posts";

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
};

const PinPage = ({ selectedLocation, onLocationEdit, pinPageState, setPinPageState }: PinPageProps) => {
  const { title, content, dateStr, files } = pinPageState;
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  
  const setTitle = (value: string) => setPinPageState(prev => ({ ...prev, title: value }));
  const setContent = (value: string) => setPinPageState(prev => ({ ...prev, content: value }));
  const setDateStr = (value: string) => setPinPageState(prev => ({ ...prev, dateStr: value }));
  const setFiles = (value: File[]) => setPinPageState(prev => ({ ...prev, files: value }));

  // localStorage에서 현재 사용자 ID 로드
  useEffect(() => {
    const savedUserId = localStorage.getItem("userId");
    if (savedUserId) {
      const userId = parseInt(savedUserId, 10);
      setCurrentUserId(userId);
    }
  }, []);
  
  const isSubmittable = useMemo(
    () => title.trim().length > 0 && content.trim().length > 0,
    [title, content]
  );

  return (
    <div className="absolute top-0 left-0 w-full h-full bg-white z-10 flex flex-col items-center">
      <div
        className="w-full max-w-7xl px-5 sm:px-10 md:px-20 lg:px-40 xl:px-60 flex flex-col items-center overflow-y-scroll"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        <PhotoFrame files={files} onFilesChange={setFiles} />
        <div className="w-full flex flex-col items-center md:px-15">
          <div className="w-full flex justify-end md:text-4xl text-2xl gap-5">
            <FontAwesomeIcon icon={faPencil} className="cursor-pointer" />
            <FontAwesomeIcon icon={faTrashCan} className="cursor-pointer" />
          </div>
          <div className="w-full flex items-center gap-3 mb-5">
            <div className="md:w-14 md:h-14 w-10 h-10 rounded-full flex items-center justify-center bg-gray-300">
              <FontAwesomeIcon icon={faImage} className="text-gray-500" />
            </div>
            <span className="md:text-3xl text-2xl">This is name space</span>
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
                  const form = new FormData();
                  const payload = {
                    title,
                    content,
                    userId: currentUserId,
                    longitude: selectedLocation?.lng ?? null,
                    latitude: selectedLocation?.lat ?? null,
                  };
                  form.append(
                    "request",
                    new Blob([JSON.stringify(payload)], { type: "application/json" })
                  );
                  
                  // 파일이 있을 때만 추가 (백엔드 업로드 디렉토리 문제 해결 전까지)
                  if (files.length > 0) {
                    console.log("파일 업로드 시도:", files.map((f) => ({ name: f.name, type: f.type, size: f.size })));
                    files.forEach((f) => form.append("files", f));
                  } else {
                    console.log("파일 없이 게시글 등록 시도");
                  }

                  // 전송 데이터 콘솔 확인
                  console.log("[PinPage] payload:", payload);
                  
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

                  await createPost(form);
                  alert("등록되었습니다.");
                  
                  // 제출 성공 후 상태 초기화
                  setPinPageState({
                    title: "",
                    content: "",
                    dateStr: "",
                    files: []
                  });
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
              제출
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PinPage;
