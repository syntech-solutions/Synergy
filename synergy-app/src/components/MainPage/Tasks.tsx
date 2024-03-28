import React from "react";
import Checkbox from "@mui/material/Checkbox";

const label = { inputProps: { "aria-label": "Checkbox" } };

const DashboardTaskBox = ({ task, priority, dueDate }) => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
        minWidth: "250px",
        maxWidth: "370px",
        padding: "10px",
        border: "1px solid #EE964B",
        backgroundColor: "#fff",
        margin: "20px",
      }}
    >
      <p>
        <strong>Task:</strong> {task}
      </p>
      <p>
        <strong>Priority:</strong> {priority}
      </p>
      <p>
        <strong>Deadline:</strong> {dueDate}
      </p>
      <p>
        <strong>Completed:</strong>
        <Checkbox
          {...label}
          color="success"
          sx={{ "& .MuiSvgIcon-root": { fontSize: 32 } }}
        />
      </p>
    </div>
  );
};

export default DashboardTaskBox;
