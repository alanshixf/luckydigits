"use client";
import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

/**
 * @param open  state of the dialog
 * @param setOpen control dialog open state
 * @param msg the message of the dialog
 * @param callBack return user chosen action
 */
interface ConfirmingDialogProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  msg: string;
  callBack: (chosen: boolean) => void;
}

export default function ConfirmingDialog({
  open,
  setOpen,
  msg,
  callBack,
}: ConfirmingDialogProps) {
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <React.Fragment>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"⚠️ Warning:"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {msg}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => callBack(false)} autoFocus>
            Cancel
          </Button>
          <Button onClick={() => callBack(true)}>Confirm</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
