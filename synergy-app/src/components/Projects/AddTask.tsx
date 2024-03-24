import {
  Autocomplete,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import React, { useState } from "react";

const AddTask = () => {
  const [openAddTaskOverlay, setOpenAddTaskOverlay] = useState(false);
  const handleClickOpen = () => {
    setOpenAddTaskOverlay(true);
  };

  const handleCloseAddEventOverlay = () => {
    setOpenAddTaskOverlay(false);
  };

  return (
    <div>
      <div style={{ flexShrink: "0" }}>
        {/*BUTTON FOR TESTING! Please use clickOpen on the Add Task Button*/}

        {/* <Button
          variant="outlined"
          style={{
            backgroundColor: "#1e394c",
            color: "#fff",
            borderColor: "#1e394c",
            marginTop: "2%",
            fontFamily: "sans-serif",
            fontWeight: "bold",
          }}
          onClick={handleClickOpen}
        >
          Add Task
        </Button> */}
      </div>
      <Dialog // Add Event Overlay
        open={openAddTaskOverlay}
        onClose={handleCloseAddEventOverlay}
        sx={{
          "& .MuiPaper-root": { color: "#1e394c" },
        }}
      >
        <DialogTitle>Add New Task</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="title"
            label="Task Title"
            type="text"
            fullWidth
            variant="standard"
          />
          <TextField
            margin="dense"
            id="date"
            label="Deadline"
            type="date"
            fullWidth
            variant="standard"
            InputLabelProps={{
              shrink: true,
            }}
          />
          <FormControl
            variant="standard"
            fullWidth
            sx={{ marginBottom: "10px" }}
          >
            <InputLabel id="priority-label">Priority</InputLabel>
            <Select labelId="priority-label" id="priority">
              <MenuItem value={"Low Priority"} style={{ color: "green" }}>
                Low Priority
              </MenuItem>
              <MenuItem value={"Medium Priority"} style={{ color: "orange" }}>
                Medium Priority
              </MenuItem>
              <MenuItem value={"High Priority"} style={{ color: "red" }}>
                High Priority
              </MenuItem>
            </Select>
          </FormControl>

          {/* <Autocomplete
            fullWidth={true}
            multiple
            id="members"
            // name="syncDesc"
            // type="syncDesc"
            // options={memberSearch}
            // getOptionLabel={(option) => option.userName}
            // defaultValue={[top100Films[13]]}
            filterSelectedOptions
            // onChange={(events, value) => setMemberArray(value)}
            renderInput={(params) => (
              <TextField
                margin="dense"
                {...params}
                label="Assign Members"
                placeholder="Members"
                type="member"
              />
            )}
          /> */}

          <TextField
            margin="dense"
            id="description"
            label="Description"
            type="text"
            fullWidth
            variant="standard"
          />
        </DialogContent>

        <DialogActions>
          <Button
            onClick={handleCloseAddEventOverlay}
            style={{ color: "#1e394c" }}
          >
            Cancel
          </Button>
          <Button
            //  onClick={handleSave}
            style={{ color: "#1e394c" }}
          >
            Create Task
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default AddTask;
