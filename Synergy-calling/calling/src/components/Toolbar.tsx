import { useState } from "react";
import IconButton from "@mui/material/IconButton";
import DesignServicesOutlinedIcon from "@mui/icons-material/DesignServicesOutlined";
import DescriptionSharpIcon from "@mui/icons-material/DescriptionSharp";
import CoPresentOutlinedIcon from "@mui/icons-material/CoPresentOutlined";
import AspectRatioOutlinedIcon from "@mui/icons-material/AspectRatioOutlined";
import LightbulbOutlinedIcon from "@mui/icons-material/LightbulbOutlined";
import NavigateNextSharpIcon from "@mui/icons-material/NavigateNextSharp";
import AddSharpIcon from "@mui/icons-material/AddSharp";
import Box from "@mui/material/Box";
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import { motion, AnimatePresence } from "framer-motion";

interface ToolbarProps {
  changeToolType: any;
  buttonPressed: any;
  showTool: any;
  sendSocketMessage: any;
}
function Toolbar2({
  changeToolType,
  buttonPressed,
  showTool,
  sendSocketMessage,
}: ToolbarProps) {
  const [isBottomNavOpen, setIsBottomNavOpen] = useState(false);

  const handleButtonClick = () => {
    setIsBottomNavOpen((prevState) => !prevState);
  };

  return (
    <Box sx={{ position: "absolute" }}>
      {" "}
      <hr />
      {!isBottomNavOpen && (
        <IconButton
          id="button"
          style={{
            position: "fixed",
            bottom: "55px",
            right: "-5px",
            backgroundColor: "rgb(245, 215, 109)",
            border: "none",
            // borderRadius: "25px",
            padding: "10px 20px",
            cursor: "pointer",
            borderRadius: "20px 0 0 20px",
            color: "black",
            stroke: "0.1em",
          }}
          onClick={handleButtonClick}
        >
          <DesignServicesOutlinedIcon
            style={{ color: "black", fontSize: 50 }}
            fontSize="large"
            stroke="#F5D76D"
            strokeWidth={1}
          />
        </IconButton>
      )}
      <AnimatePresence>
        {isBottomNavOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: "0%" }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
            style={{
              position: "fixed",
              bottom: "55px",
              right: "-5px",
              width: "80%", // Adjust the width as needed
              maxWidth: "650px", // Max width of the box
              display: "flex",
              justifyContent: "center",
              borderRadius: "25px",
              backgroundColor: "rgb(256, 256, 256)",
            }}
          >
            <Box
              class="listContainer"
              style={{
                padding: "12px 10px",
                boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.5)",
                borderRadius: "35px",
                width: "100%",
              }}
            >
              <BottomNavigation
                showLabels
                sx={{
                  "& .Mui-selected": {
                    "& .MuiBottomNavigationAction-label": {
                      color: "black",
                      fontSize: "30px",
                    },
                  },
                }}
              >
                <BottomNavigationAction
                  label=" "
                  icon={
                    <NavigateNextSharpIcon
                      class="iconStyle"
                      stroke="#05284C"
                      strokeWidth={0.6}
                      onClick={handleButtonClick}
                    />
                  }
                />
                <BottomNavigationAction
                  label="Brain Board"
                  icon={
                    <LightbulbOutlinedIcon
                      class="iconStyle"
                      stroke="#EE964B"
                      strokeWidth={0.6}
                      onClick={() => {
                        changeToolType("brainBoard");
                        buttonPressed();
                        showTool();
                        console.log("Brain Board");
                      }}
                    />
                  }
                />
                <BottomNavigationAction
                  label="Whiteboard"
                  icon={
                    <AspectRatioOutlinedIcon
                      class="iconStyle"
                      stroke="#EE964B"
                      strokeWidth={0.6}
                      onClick={() => {
                        changeToolType("whiteboard");
                        buttonPressed();
                        showTool();
                        sendSocketMessage("whiteboard", "whiteboard");
                        console.log("Brain Board");
                      }}
                    />
                  }
                />
                <BottomNavigationAction
                  label="Presentation"
                  icon={
                    <CoPresentOutlinedIcon
                      class="iconStyle"
                      stroke="#EE964B"
                      strokeWidth={0.6}
                    />
                  }
                />
                <BottomNavigationAction
                  label="Docs"
                  icon={
                    <DescriptionSharpIcon
                      class="iconStyle"
                      stroke="#EE964B"
                      strokeWidth={0.6}
                    />
                  }
                  onClick={() => {
                    changeToolType("doc");
                    buttonPressed();
                    showTool();
                    sendSocketMessage("doc", "doc");
                    console.log("Brain Board");
                  }}
                />
                <BottomNavigationAction
                  label="Add"
                  icon={
                    <AddSharpIcon
                      class="iconStyle"
                      stroke="#05284C"
                      strokeWidth={0.6}
                    />
                  }
                />
              </BottomNavigation>
            </Box>
          </motion.div>
        )}
      </AnimatePresence>
    </Box>
  );
}

export default Toolbar2;
