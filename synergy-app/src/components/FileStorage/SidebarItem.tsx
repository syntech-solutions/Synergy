import React from "react";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import "../../styles/SidebarItem.css";

const SidebarItem = ({ arrow, icon, label }: any) => {
  return (
    <div className="sidebarItem">
      <div className="sidebarItem__arrow">{arrow && <ArrowRightIcon />}</div>
      <div className="sidebarItem__main">
        {icon}
        <p>{label}</p>
      </div>
    </div>
  );
};

export default SidebarItem;
