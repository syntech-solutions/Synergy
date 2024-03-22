import * as React from "react";
import PropTypes from "prop-types";
import Typography from "@mui/material/Typography";

function Title(props: any) {
  return (
    <Typography component="h2" variant="h6" color="#05284C" gutterBottom>
      {props.children}
    </Typography>
  );
}

Title.propTypes = {
  children: PropTypes.node,
};

export default Title;
