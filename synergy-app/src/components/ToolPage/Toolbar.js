import React, { useState } from "react";
import IconButton from "@mui/material/IconButton";
import DesignServicesOutlinedIcon from "@mui/icons-material/DesignServicesOutlined";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import CoPresentOutlinedIcon from "@mui/icons-material/CoPresentOutlined";
import AspectRatioOutlinedIcon from "@mui/icons-material/AspectRatioOutlined";
import LightbulbOutlinedIcon from "@mui/icons-material/LightbulbOutlined";
import NavigateNextSharpIcon from "@mui/icons-material/NavigateNextSharp";
import AddSharpIcon from "@mui/icons-material/AddSharp";
import Box from "@mui/material/Box";
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import { motion, AnimatePresence } from "framer-motion";

function Toolbar() {
  const [isBottomNavOpen, setIsBottomNavOpen] = useState(false);

  const handleButtonClick = () => {
    setIsBottomNavOpen((prevState) => !prevState);
  };

  return (
    <div
      className="container"
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundColor: "#f9f9f1",
      }}
    >
      <p>
        <hr />
        {!isBottomNavOpen && (
          <IconButton
            id="button"
            style={{
              position: "fixed",
              bottom: "55px",
              right: "-17px",
              backgroundColor: "rgb(245, 215, 109)",
              border: "none",
              borderRadius: "25px",
              padding: "10px 20px",
              cursor: "pointer",
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
      </p>
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
              right: "-20px",
              width: "80%", // Adjust the width as needed
              maxWidth: "650px", // Max width of the box
              display: "flex",
              justifyContent: "center",
              borderRadius: "25px",
              backgroundColor: "#f9f9f1",
            }}
          >
            <Box
              className="listContainer"
              style={{
                padding: "12px 10px",
                boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.5)",
                borderRadius: "35px",
                width: "100%",
                backgroundColor: "#f9f9f1",
              }}
            >
              <BottomNavigation
                showLabels
                sx={{
                  backgroundColor: "transparent",
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
                      strokeWidth={0.7}
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
                      strokeWidth={0.7}
                    />
                  }
                />
                <BottomNavigationAction
                  label="Whiteboard"
                  icon={
                    <AspectRatioOutlinedIcon
                      class="iconStyle"
                      stroke="#EE964B"
                      strokeWidth={0.7}
                    />
                  }
                />
                <BottomNavigationAction
                  label="Presentation"
                  icon={
                    <CoPresentOutlinedIcon
                      class="iconStyle"
                      stroke="#EE964B"
                      strokeWidth={0.7}
                    />
                  }
                />
                <BottomNavigationAction
                  label="Docs"
                  icon={
                    <DescriptionOutlinedIcon
                      class="iconStyle"
                      stroke="#EE964B"
                      strokeWidth={0.7}
                    />
                  }
                />
                <BottomNavigationAction
                  label="Add"
                  icon={
                    <AddSharpIcon
                      class="iconStyle"
                      stroke="#05284C"
                      strokeWidth={0.7}
                    />
                  }
                />
              </BottomNavigation>
            </Box>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Toolbar;
