import React from "react";

const Pagination = ({ pageNo, handlePrevious, handleNext, setPageNo }) => {
  return (
    <div className="text-white  text-2xl flex justify-center items-center p-4 h-[60px] mt-2 gap-5 ">
      <div onClick={() => handlePrevious(setPageNo)}>
        <i className="fa-solid fa-arrow-left cursor-pointer"></i>
      </div>
      <div>{pageNo}</div>
      <div onClick={() => handleNext(setPageNo)}>
        <i className="fa-solid fa-arrow-right cursor-pointer"></i>
      </div>
    </div>
  );
};

export default Pagination;