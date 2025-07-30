const PhotoFrame = () => {
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
          <div className="absolute top-4 left-5 w-full h-full bg-[#EAEAEA] rounded-lg flex justify-center items-center shadow-sm"></div>
        </div>
      </div>
    </div>
  );
};

export default PhotoFrame;
