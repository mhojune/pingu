import { faLocationDot, faCalendar, faPencil, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faImage } from "@fortawesome/free-regular-svg-icons";
import { useState, useEffect } from "react";
import { getUserById } from "../api/users";
import type { PostResponseDTO } from "../api/types";

// Kakao Map API 타입 선언
declare global {
  interface Window {
    kakao: any;
  }
}

type PinInfoProps = {
  selectedPost: PostResponseDTO | null;
  onClose: () => void;
  onEdit?: (post: PostResponseDTO) => void;
  onDelete?: (post: PostResponseDTO) => void;
};

const PinInfo = ({ selectedPost, onClose, onEdit, onDelete }: PinInfoProps) => {
  const [postUserName, setPostUserName] = useState<string>("");
  const [address, setAddress] = useState<string>("주소를 불러오는 중...");


  // 선택된 핀의 작성자 정보 로드
  useEffect(() => {
    if (selectedPost) {
      getUserById(selectedPost.userId)
        .then((userInfo) => {
          setPostUserName(userInfo.username || "사용자");
        })
        .catch((error) => {
          console.error("핀 작성자 정보 로드 실패:", error);
          setPostUserName("사용자");
        });
    }
  }, [selectedPost]);

  // 위도/경도를 주소로 변환하는 함수
  const getAddressFromCoords = (lat: number, lng: number) => {
    if (!window.kakao || !window.kakao.maps || !window.kakao.maps.services) {
      setAddress("지도 API를 불러오는 중...");
      return;
    }

    const geocoder = new window.kakao.maps.services.Geocoder();
    
    geocoder.coord2Address(lng, lat, (result: any, status: any) => {
      if (status === window.kakao.maps.services.Status.OK) {
        if (result[0]) {
          const addr = result[0].address;
          const roadAddr = result[0].road_address;
          
          // 도로명 주소가 있으면 도로명 주소를, 없으면 지번 주소를 사용
          const fullAddress = roadAddr 
            ? `${roadAddr.address_name} (${addr.address_name})`
            : addr.address_name;
          
          setAddress(fullAddress);
        } else {
          setAddress("주소를 찾을 수 없습니다");
        }
      } else {
        setAddress("주소 변환에 실패했습니다");
      }
    });
  };

  // 선택된 핀의 위치 정보를 주소로 변환
  useEffect(() => {
    if (selectedPost && selectedPost.latitude && selectedPost.longitude) {
      getAddressFromCoords(selectedPost.latitude, selectedPost.longitude);
    } else {
      setAddress("위치 정보 없음");
    }
  }, [selectedPost]);

  if (!selectedPost) {
    return null;
  }

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

  const { date: extractedDate, content: extractedContent } = selectedPost 
    ? parseContent(selectedPost.content) 
    : { date: null, content: '' };




  return (
    <div className="absolute top-0 left-0 w-full h-full bg-white z-10 flex flex-col items-center">
      <div
        className="w-full max-w-7xl px-5 sm:px-10 md:px-20 lg:px-40 xl:px-60 flex flex-col items-center overflow-y-scroll"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {/* 닫기 버튼 */}
        <div className="w-full flex justify-end mt-4 mb-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
          >
            닫기
          </button>
        </div>

        {/* 핀 이미지 - PhotoFrame 스타일로 직접 표시 */}
        {selectedPost.files && selectedPost.files.length > 0 && (
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
                  <img
                    src={selectedPost.files[0].url}
                    alt={selectedPost.title}
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="w-full flex flex-col items-center md:px-15">
          {/* 편집 버튼들 */}
          <div className="w-full flex justify-end md:text-4xl text-2xl gap-5 mb-4">
            {onEdit && (
              <FontAwesomeIcon 
                icon={faPencil} 
                className="cursor-pointer hover:text-blue-600 transition-colors" 
                onClick={() => selectedPost && onEdit(selectedPost)}
              />
            )}
            {onDelete && (
              <FontAwesomeIcon 
                icon={faTrashCan} 
                className="cursor-pointer hover:text-red-600 transition-colors" 
                onClick={() => selectedPost && onDelete(selectedPost)}
              />
            )}
          </div>

          {/* 작성자 정보 */}
          <div className="w-full flex items-center gap-3 mb-5">
            <div className="md:w-14 md:h-14 w-10 h-10 rounded-full flex items-center justify-center bg-gray-300">
              <FontAwesomeIcon icon={faImage} className="text-gray-500" />
            </div>
            <span className="md:text-3xl text-2xl">{postUserName}</span>
          </div>

          {/* 제목 */}
          <div className="w-full flex flex-col gap-1 md:mb-7 mb-5">
            <label className="md:text-xl text-lg text-gray-600">
              제목
            </label>
            <div className="w-full flex items-center border-1 border-gray-200 rounded-md md:p-3 p-2 bg-gray-50">
              <span className="md:text-xl text-lg">{selectedPost.title}</span>
            </div>
          </div>

          {/* 날짜와 위치 */}
          <div className="w-full flex flex-1 md:gap-15 gap-5 pb-2 md:mb-7 mb-5">
            <div className="flex items-center">
              <FontAwesomeIcon
                icon={faCalendar}
                className="text-black md:text-3xl text-xl mr-2"
              />
              <span className="md:text-2xl text-xl">
                {extractedDate || "날짜 없음"}
              </span>
            </div>
            <div className="flex flex-1 items-center w-1/2">
              <FontAwesomeIcon
                icon={faLocationDot}
                className="text-black md:text-3xl text-xl mr-2 flex-shrink-0"
              />
              <div 
                className="md:text-2xl text-xl text-gray-600 overflow-x-auto whitespace-nowrap"
                style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                onWheel={(e) => {
                  e.preventDefault();
                  const container = e.currentTarget;
                  container.scrollLeft += e.deltaY;
                }}
              >
                {address}
              </div>
            </div>
          </div>

          {/* 내용 */}
          <div className="w-full flex flex-col gap-1 md:mb-7 mb-5">
            <label className="md:text-xl text-lg text-gray-600">
              내용
            </label>
            <div className="w-full border-1 border-gray-200 rounded-md md:p-3 p-2 bg-gray-50">
              <div className="w-full min-h-32 md:text-xl text-lg whitespace-pre-wrap">
                {extractedContent}
              </div>
            </div>
          </div>

          {/* 좋아요 수 */}
          <div className="w-full flex justify-start md:mb-10 mb-6">
            <div className="flex items-center gap-2">
              <span className="md:text-xl text-lg text-gray-600">좋아요:</span>
              <span className="md:text-xl text-lg font-semibold">{selectedPost.likeCount || 0}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PinInfo;
