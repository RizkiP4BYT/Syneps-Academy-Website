import React from "react";
import { Snackbar, Alert, Slide } from "@mui/material";

interface CustomSnackbarProps {
  open: boolean;
  onClose: () => void;
  message: string;
  severity: "success" | "error" | "info" | "warning";
}

const CustomSnackbar: React.FC<CustomSnackbarProps> = ({
  open,
  onClose,
  message,
  severity,
}) => {
  return (
    <Snackbar
      open={open}
      onClose={onClose}
      autoHideDuration={5000}
      TransitionComponent={Slide}
    >
      <Alert
        severity={severity}
        sx={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          padding: "16px",
          fontSize: "1rem",
        }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
};

export default CustomSnackbar;
