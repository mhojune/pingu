import React from "react";

const BookMark = () => {
  return (
    <div className="flex flex-col items-start gap-2">
      <div className="flex items-start">
        <div className="w-12 h-6 sm:w-16 sm:h-8 md:w-20 md:h-10 lg:w-24 lg:h-12 bg-gray-200"></div>
        <div className="w-4 h-6 sm:w-6 sm:h-8 md:w-8 md:h-10 lg:w-10 lg:h-12 bg-red-300"></div>
      </div>
      <div className="flex items-start">
        <div className="w-12 h-6 sm:w-16 sm:h-8 md:w-20 md:h-10 lg:w-24 lg:h-12 bg-gray-200"></div>
        <div className="w-4 h-6 sm:w-6 sm:h-8 md:w-8 md:h-10 lg:w-10 lg:h-12 bg-red-300"></div>
      </div>
      <div className="flex items-start">
        <div className="w-12 h-6 sm:w-16 sm:h-8 md:w-20 md:h-10 lg:w-24 lg:h-12 bg-gray-200"></div>
        <div className="w-4 h-6 sm:w-6 sm:h-8 md:w-8 md:h-10 lg:w-10 lg:h-12 bg-red-300"></div>
      </div>
    </div>
  );
};

export default BookMark;
