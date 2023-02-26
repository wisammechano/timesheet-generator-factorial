import React from "react";

const FAB = ({ onClick, text }) => {
  return (
    <div
      className="fixed flex justify-center bottom-[30px] right-[100px] z-[994] rounded-[30px] h-[60px]"
      style={{
        backgroundImage:
          "linear-gradient(318.72deg,#FF355E 31.4%,#FFD7DF 178.48%),linear-gradient(316.92deg,#FF355E 15.62%,#FFD7DF 172.1%)",
      }}
    >
      <div
        role="button"
        className="cursor-pointer h-[60px] mx-5 font-semibold text-base leading-[60px] outline-none text-white"
        style={{ boxShadow: "0 5px 15px rgb(0 0 0 / 5%)" }}
        onClick={onClick}
      >
        {text}
      </div>
    </div>
  );
};

export default FAB;
