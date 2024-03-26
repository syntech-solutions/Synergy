import React from "react";
import Checkbox from "@mui/material/Checkbox";
import Chip from "@mui/material/Chip";
import Typography from "@mui/material/Typography";

const getPriorityColor = (priority) => {
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

const getPriorityTextColor = (priority) => {
  switch (priority.toLowerCase()) {
    case "high":
      return "white";
    case "medium":
    case "low":
      return "black";
    default:
      return "black";
  }
};

const TaskBox = ({
  title,
  assignee,
  priority,
  deadline,
  description,
  onTaskCompleted,
  completed,
  onTaskIncompleted,
}) => {
  const priorityColor = getPriorityColor(priority);
  const priorityTextColor = getPriorityTextColor(priority);

  const handleCheckboxChange = (event) => {
    if (event.target.checked) {
      onTaskCompleted();
    } else {
      onTaskIncompleted();
    }
  };

  return (
    <div
      style={{
        backgroundColor: "#fff",
        border: "1px solid #dcdcdc",
        borderRadius: "5px",
        padding: "20px",
        marginBottom: "20px",
        width: "100%",
        maxWidth: "450px",
        minWidth: "300px",
      }}
    >
      <Typography variant="h5" style={{ marginBottom: "10px" }}>
        {title}
      </Typography>
      <div style={{ marginBottom: "10px" }}>
        <strong>Assignee:</strong> {assignee}
      </div>
      <div style={{ marginBottom: "10px" }}>
        <strong>Priority:</strong>{" "}
        <Chip
          label={priority}
          sx={{
            color: priorityTextColor,
            backgroundColor: priorityColor,
          }}
        />
      </div>
      <div style={{ marginBottom: "10px" }}>
        <strong>Deadline:</strong> {deadline}
      </div>
      <div style={{ marginBottom: "10px" }}>
        <strong>Task Description:</strong> {description}
      </div>
      <div>
        <strong>Completed:</strong>{" "}
        <Checkbox
          checked={completed}
          color="success"
          onChange={handleCheckboxChange}
        />
      </div>
    </div>
  );
};

export default TaskBox;
