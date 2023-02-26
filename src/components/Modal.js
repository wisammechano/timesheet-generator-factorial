import React, { useRef } from "react";

const Modal = ({
  children,
  show,
  title,
  onClose,
  closeOnClickOutside = false,
}) => {
  const wrapperRef = useRef();

  const onWrapperClick = (e) => {
    if (e.target === wrapperRef.current && closeOnClickOutside) {
      onClose();
    }
  };
  return (
    <div className={show ? "block" : "hidden"}>
      <div
        className="fixed inset-0 z-[1500] bg-[rgba(0,0,0,0.5)] overflow-auto"
        ref={wrapperRef}
        onClick={onWrapperClick}
      >
        <div className="w-[600px] p-4 mx-auto my-14 bg-white rounded-lg flex flex-col">
          <div className="flex justify-between mb-1 items-center">
            <h3 className="m-2 text-2xl">{title}</h3>
            <div
              className="p-2 cursor-pointer font-semibold "
              role="button"
              onClick={onClose}
            >
              <svg
                className="hover:fill-gray-500 fill-gray-300 stroke-transparent stroke-[2px] w-6 h-6"
                viewBox="0 0 24 24"
              >
                <path
                  xmlns="http://www.w3.org/2000/svg"
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M5.293 5.293a1 1 0 0 1 1.414 0L12 10.586l5.293-5.293a1 1 0 1 1 1.414 1.414L13.414 12l5.293 5.293a1 1 0 0 1-1.414 1.414L12 13.414l-5.293 5.293a1 1 0 0 1-1.414-1.414L10.586 12 5.293 6.707a1 1 0 0 1 0-1.414z"
                />
              </svg>
            </div>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
