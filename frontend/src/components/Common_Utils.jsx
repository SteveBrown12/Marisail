import React from "react";

export const Loader = () => {
  return (
    <div className="flex justify-center items-center bg-white/50 mt-[100px]">
      <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
};
