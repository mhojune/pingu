import { useMemo, useRef, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faImage } from "@fortawesome/free-regular-svg-icons";

type PhotoFrameProps = {
  files: File[];
  onFilesChange: (files: File[]) => void;
  editable?: boolean;
};

const PhotoFrame = ({ files, onFilesChange, editable = true }: PhotoFrameProps) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const previewUrl = useMemo(() => {
    if (!files || files.length === 0) return "";
    return URL.createObjectURL(files[0]);
  }, [files]);

  // Object URL 정리
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  return (
    <div className="relative w-11/12 md:w-4/5 h-64 md:h-96 flex justify-center items-start pt-8 mb-10">
      <div className="relative w-full max-w-2xl h-48 md:h-80">
        {/* 핀과 줄 */}
        <div className="absolute -top-8 left-[20%] w-0.5 h-8 bg-[#D8847F] z-10">
          <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 w-12 h-8 bg-[#D8847F] z-15"></div>
        </div>
        <div className="absolute -top-8 right-[20%] w-0.5 h-8 bg-[#D8847F] z-10">
          <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 w-12 h-8 bg-[#D8847F] z-15"></div>
        </div>

        {/* 카드 전경 (회색) */}
        <div className="absolute top-3 left-0 w-full h-full bg-[#D6BDA8] rounded-lg flex justify-center items-center shadow-sm">
          <div className="absolute top-4 left-5 w-full h-full bg-[#EAEAEA] rounded-lg flex justify-center items-center shadow-sm overflow-hidden p-3 md:p-5">
            {previewUrl ? (
              <div
                className={`w-full h-full ${
                  editable ? "cursor-pointer" : "cursor-default"
                }`}
                onClick={() => editable && inputRef.current?.click()}
                title="이미지 변경"
              >
                <img
                  src={previewUrl}
                  alt="preview"
                  className="w-full h-full object-contain"
                />
              </div>
            ) : (
              <button
                type="button"
                className={`text-gray-600 flex flex-col items-center justify-center ${
                  editable ? "cursor-pointer" : "cursor-default"
                }`}
                onClick={() => editable && inputRef.current?.click()}
                aria-label="이미지 업로드"
                title="이미지 업로드"
              >
                <FontAwesomeIcon className="text-4xl md:text-6xl mb-2" icon={faImage} />
                <span className="sr-only">이미지 업로드</span>
              </button>
            )}
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const fileList = e.target.files ? Array.from(e.target.files) : [];
                onFilesChange(fileList);
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhotoFrame;
