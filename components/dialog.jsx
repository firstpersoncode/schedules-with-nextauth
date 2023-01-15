import { Dialog as MUIDialog, Alert } from "@mui/material";
import { useState } from "react";

export function useDialog() {
  const [dialog, setDialog] = useState({
    open: false,
    message: "",
    severity: "error",
  });

  function handleOpenDialog(message, severity) {
    setDialog((v) => ({ ...v, open: true, message, severity }));
  }

  function handleCloseDialog() {
    setDialog((v) => ({ ...v, open: false }));
  }

  return { dialog, handleOpenDialog, handleCloseDialog };
}

export default function Dialog({ dialog, onClose }) {
  return (
    <MUIDialog open={dialog.open} onClose={onClose}>
      <Alert severity={dialog.severity}>
        <div dangerouslySetInnerHTML={{ __html: dialog.message }} />
      </Alert>
    </MUIDialog>
  );
}
