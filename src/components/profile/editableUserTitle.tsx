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
import React, { useRef, useState } from "react";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import Draggable from "react-draggable";
import LoadingButton from "@mui/lab/LoadingButton";
import { updateUserTitle } from "@/lib/user/editProfile";

interface EditableUserTitleProps {
  user: User;
}

function PaperComponent(props: PaperProps) {
  const paperRef = useRef(null);

  return (
    <Draggable
      handle="#draggable-dialog-title-userTitle"
      cancel={'[class*="MuiDialogContent-root"]'}
      nodeRef={paperRef}
    >
      <Paper ref={paperRef} {...props} />
    </Draggable>
  );
}

let oldUserTitle = "";
function EditableUserTitle({ user }: EditableUserTitleProps) {
  const [userTitle, setUserTitle] = useState<string | null>(user.title);
  const [open, setOpen] = React.useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleClickOpen = () => {
    oldUserTitle = userTitle as string;
    setOpen(true);
  };

  const handleClose = () => {
    setUserTitle(oldUserTitle);
    setOpen(false);
  };

  const handleSave = async () => {
    setIsLoading(true);

    try {
      await updateUserTitle(user.id, userTitle as string);
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
        <Typography variant="body1">
          {userTitle ? userTitle : "(empty)"}
        </Typography>
        <Tooltip title="Update Title" arrow placement="right">
          <IconButton
            color="primary"
            aria-label="update title"
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
          id="draggable-dialog-title-userTitle"
        >
          Title Setting
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Anyone contacting you or viewing the content you create on the Lucky
            Digits service will see this information.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="title"
            label="Title"
            type="text"
            fullWidth
            value={userTitle}
            variant="standard"
            onChange={(e) => {
              setUserTitle(e.target.value);
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

export default EditableUserTitle;
