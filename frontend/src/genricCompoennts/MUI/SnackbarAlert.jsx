import React from "react";
import { Snackbar, Alert, Slide } from "@mui/material";

const SlideDown = (props) => <Slide {...props} direction="down" />;

const SnackbarAlert = ({ open, message, severity = "info", onClose }) => {
  return (
    <Snackbar
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
      open={open}
      onClose={onClose}
      TransitionComponent={SlideDown}
      autoHideDuration={4000}
    >
      <Alert onClose={onClose} severity={severity} variant="filled" sx={{ width: "100%" }}>
        {message}
      </Alert>
    </Snackbar>
  );
};

export default SnackbarAlert;
