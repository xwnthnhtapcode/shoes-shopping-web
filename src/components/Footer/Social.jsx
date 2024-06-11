import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

const Social = ({ color, icon, href }) => {
  return (
    <a
      href={href}
      target="_blank"
      style={{
        backgroundColor: `${color}`,
      }}
      className={`mb-[10px] hover:brightness-75 hover:transition-all hover:delay-[0.05s] w-[40px] h-[40px] inline-flex items-center mr-[10px] justify-center rounded-[100rem] no-underline text-white `}
      rel="noreferrer"
    >
      <FontAwesomeIcon className="text-[24px] mt-0" icon={icon} />
    </a>
  );
};

export default Social;
