// TaskBox.js
import React from "react";
import Checkbox from "@mui/material/Checkbox";
import Chip from "@mui/material/Chip";

const getPriorityColor = (priority: string) => {
  switch (priority.toLowerCase()) {
    case "high":
      return "#FD151B";
    case "medium":
      return "yellow";
    case "low":
      return "#00FF00";
    default:
      return "#ccc";
  }
};

const getPriorityTextColor = (priority: string) => {
  switch (priority.toLowerCase()) {
    case "high":
      return "white";
    case "medium":
      return "black";
    case "low":
      return "black";
    default:
      return "black";
  }
};

const label = { inputProps: { "aria-label": "Checkbox" } };

const TaskBox = ({
  task,
  assignee,
  priority,
  deadline,
  description,
}: {
  task: string;
  assignee: string;
  priority: string;
  deadline: string;
  description: string;
}) => {
  const priorityColor = getPriorityColor(priority);
  const priorityTextColor = getPriorityTextColor(priority);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
        minWidth: "300px",
        padding: "10px",
        border: "2px solid #05284C",
        backgroundColor: "#fff",
        borderRadius: "5px",
        marginBottom: "20px",
      }}
    >
      <h3>{task}</h3>
      <p>
        <strong>Assigned To:</strong> {assignee}
      </p>
      <p>
        <strong>Priority:</strong>{" "}
        <Chip
          label={priority}
          sx={{ color: priorityTextColor, backgroundColor: priorityColor }}
        />
      </p>
      <p>
        <strong>Deadline:</strong> {deadline}
      </p>
      <p>
        <strong>Task Description:</strong> {description}
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

export default TaskBox;
