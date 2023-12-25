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
  TextFieldProps,
  Tooltip,
  Typography,
  TypographyProps,
} from "@mui/material";
import { User } from "@prisma/client";
import React, { useRef, useState } from "react";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import Draggable from "react-draggable";
import LoadingButton from "@mui/lab/LoadingButton";
import { updateAboutMe } from "@/lib/user/editProfile";

interface EditableAboutMeProps {
  user: User;
}

function PaperComponent(props: PaperProps) {
  const paperRef = useRef(null);

  return (
    <Draggable
      handle="#draggable-dialog-title-aboutMe"
      cancel={'[class*="MuiDialogContent-root"]'}
      nodeRef={paperRef}
    >
      <Paper ref={paperRef} {...props} />
    </Draggable>
  );
}

let oldAboutMe = "";
const MAX_CHARS = 500;
function EditableAboutMe({ user }: EditableAboutMeProps) {
  const [aboutMe, setAboutMe] = useState<string | null>(user.aboutMe);
  const [open, setOpen] = React.useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [error, setError] = useState(false);
  const [color, setColor] = useState("primary");

  const handleClickOpen = () => {
    oldAboutMe = aboutMe as string;
    setOpen(true);
  };

  const handleClose = () => {
    setAboutMe(oldAboutMe);
    setOpen(false);
  };

  const handleSave = async () => {
    setIsLoading(true);

    if ((aboutMe?.length ?? 0) > MAX_CHARS) {
      alert("Too many chars ");
      setIsLoading(false);
      return;
    }
    try {
      await updateAboutMe(user.id, aboutMe as string);
      setOpen(false);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <React.Fragment>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          gap: 2,
          maxWidth: "600px",
        }}
      >
        <Typography variant="body1" style={{ whiteSpace: "pre-wrap" }}>
          {aboutMe ? aboutMe : "(empty)"}
        </Typography>

        <Tooltip title="About Me" arrow placement="right">
          <IconButton
            color="primary"
            aria-label="About Me"
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
          id="draggable-dialog-title-aboutMe"
        >
          About Me
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
            id="aboutme"
            label="About Me"
            fullWidth
            multiline
            rows={4}
            value={aboutMe}
            variant="standard"
            onChange={(e) => {
              setAboutMe(e.target.value);
              if (e.target.value.length > MAX_CHARS) {
                setError(true);
                setColor("error");
              } else {
                setError(false);
                setColor("primary");
              }
            }}
          />
          <Typography variant="body2" color={color}>
            {aboutMe?.length ?? 0}/{MAX_CHARS}
          </Typography>
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

export default EditableAboutMe;
