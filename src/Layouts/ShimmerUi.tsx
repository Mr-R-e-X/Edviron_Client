import React from "react";

const ShimmerUi = () => {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center">
      <div className="space-y-4">
        <div className="h-8 w-1/2 mb-6 mx-auto bg-gray-700 rounded-md animate-pulse" />
        <div className="h-8 w-3/4 mb-6 mx-auto bg-gray-700 rounded-md animate-pulse" />
        <div className="h-8 w-3/4 mb-6 mx-auto bg-gray-700 rounded-md animate-pulse" />
        <div className="h-8 w-full mb-6 mx-auto bg-gray-700 rounded-md animate-pulse" />
      </div>
      <div className="space-y-4">
        <div className="h-8 w-1/2 mb-6 mx-auto bg-gray-700 rounded-md animate-pulse" />
        <div className="h-8 w-3/4 mb-6 mx-auto bg-gray-700 rounded-md animate-pulse" />
        <div className="h-8 w-3/4 mb-6 mx-auto bg-gray-700 rounded-md animate-pulse" />
        <div className="h-8 w-full mb-6 mx-auto bg-gray-700 rounded-md animate-pulse" />
      </div>
    </div>
  );
};

export default ShimmerUi;
