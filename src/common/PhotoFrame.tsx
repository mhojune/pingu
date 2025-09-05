import { useRef, useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faImage } from "@fortawesome/free-regular-svg-icons";

type PhotoFrameProps = {
  files: File[];
  onFilesChange: (files: File[]) => void;
  editable?: boolean;
  existingImageUrl?: string; // 기존 이미지 URL
};

const PhotoFrame = ({ files, onFilesChange, editable = true, existingImageUrl }: PhotoFrameProps) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");

  // 이미지 압축 함수
  const compressImage = (file: File, maxWidth: number = 1920, maxHeight: number = 1080, quality: number = 0.7): Promise<File> => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = () => {
        // 원본 비율 유지하면서 크기 조정
        let { width, height } = img;
        
        if (width > height) {
          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = (width * maxHeight) / height;
            height = maxHeight;
          }
        }
        
        canvas.width = width;
        canvas.height = height;
        
        // 이미지 그리기
        ctx?.drawImage(img, 0, 0, width, height);
        
        // 압축된 이미지를 Blob으로 변환
        canvas.toBlob((blob) => {
          if (blob) {
            const compressedFile = new File([blob], file.name, {
              type: file.type,
              lastModified: Date.now(),
            });
            console.log(`이미지 압축: ${file.size} -> ${compressedFile.size} bytes`);
            resolve(compressedFile);
          } else {
            resolve(file); // 압축 실패 시 원본 파일 반환
          }
        }, file.type, quality);
      };
      
      img.src = URL.createObjectURL(file);
    });
  };

  // 파일이 변경될 때 미리보기 URL 업데이트
  useEffect(() => {
    // 새 파일이 있으면 새 URL 생성 (우선순위 1)
    if (files && files.length > 0) {
      const newUrl = URL.createObjectURL(files[0]);
      setPreviewUrl(newUrl);
    } else if (existingImageUrl) {
      // 파일이 없고 기존 이미지 URL이 있으면 기존 URL 사용 (우선순위 2)
      setPreviewUrl(existingImageUrl);
    } else {
      // 둘 다 없으면 빈 문자열
      setPreviewUrl("");
    }
  }, [files, existingImageUrl]);

  // cleanup 함수를 별도 useEffect로 분리
  useEffect(() => {
    return () => {
      if (previewUrl && previewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(previewUrl);
      }
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
              onChange={async (e) => {
                const fileList = e.target.files ? Array.from(e.target.files) : [];
                
                if (fileList.length > 0) {
                  const file = fileList[0];
                  
                  // 파일 크기 검증 (10MB 제한)
                  if (file.size > 10 * 1024 * 1024) {
                    alert('파일 크기가 너무 큽니다. 10MB 이하의 파일을 선택해주세요.');
                    return;
                  }
                  
                  try {
                    // 이미지 압축
                    const compressedFile = await compressImage(file);
                    onFilesChange([compressedFile]);
                  } catch (error) {
                    console.error('이미지 압축 실패:', error);
                    onFilesChange(fileList);
                  }
                } else {
                  onFilesChange(fileList);
                }
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhotoFrame;
