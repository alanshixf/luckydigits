"use client";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Paper,
  PaperProps,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { User } from "@prisma/client";
import React, { useEffect, useRef, useState } from "react";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import Draggable from "react-draggable";
import LoadingButton from "@mui/lab/LoadingButton";
import { updateUsername } from "@/lib/user/editProfile";

interface EditableUsernameProps {
  user: User;
}

function PaperComponent(props: PaperProps) {
  const paperRef = useRef(null);

  return (
    <Draggable
      handle="#draggable-dialog-title-username"
      cancel={'[class*="MuiDialogContent-root"]'}
      nodeRef={paperRef}
    >
      <Paper ref={paperRef} {...props} />
    </Draggable>
  );
}

let oldUsername = "";
function EditableUsername({ user }: EditableUsernameProps) {
  const [username, setUsername] = useState<string | null>(user.name);
  const [open, setOpen] = React.useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);

  const handleClickOpen = () => {
    oldUsername = username as string;
    setOpen(true);
  };

  const handleClose = () => {
    setUsername(oldUsername);
    setOpen(false);
  };

  const handleSave = async () => {
    setIsLoading(true);
    if (!username) {
      alert("Name should not be empty");
      setIsLoading(false);
    }

    try {
      await updateUsername(user.id, username as string);
      setOpen(false);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <React.Fragment>
      <Box sx={{ display: "flex", flexDirection: "row", gap: 2 }}>
        <Typography variant="body1">{username}</Typography>
        <Tooltip title="Edit Your Name" arrow placement="right">
          <IconButton
            color="primary"
            aria-label="change avatar"
            sx={{
              position: "relative",
              top: -15,
              left: 20,
              width: "36px",
              height: "36px",
            }}
            onClick={handleClickOpen}
          >
            <EditIcon />
          </IconButton>
        </Tooltip>
      </Box>
      <Dialog open={open} onClose={handleClose} PaperComponent={PaperComponent}>
        <DialogTitle
          style={{ cursor: "move" }}
          id="draggable-dialog-title-username"
        >
          User Name
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Anyone contacting you or viewing the content you create on the Lucky
            Digits service will see this information.
          </DialogContentText>
          <TextField
            error={error}
            autoFocus
            margin="dense"
            id="name"
            label="Your name"
            type="name"
            fullWidth
            value={username}
            variant="standard"
            required
            onChange={(e) => {
              setUsername(e.target.value);
              if (e.target.value === "") {
                setError(true);
              } else {
                setError(false);
              }
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <LoadingButton
            onClick={handleSave}
            loading={isLoading}
            endIcon={<SaveIcon />}
            loadingPosition="end"
          >
            save
          </LoadingButton>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}

export default EditableUsername;
