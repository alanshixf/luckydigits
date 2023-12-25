"use client";
import { stringAvatar } from "@/lib/utils/stringAvatar";
import {
  Avatar,
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
  Slider,
  Tooltip,
  styled,
} from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import ImageIcon from "@mui/icons-material/Image";
import { User } from "@prisma/client";
import React, { useRef, useState } from "react";
import FaceRetouchingNaturalIcon from "@mui/icons-material/FaceRetouchingNatural";
import Draggable from "react-draggable";
import AvatarEditor from "react-avatar-editor";

import Dropzone from "react-dropzone";
import UploadIcon from "@mui/icons-material/Upload";
import { changeUserAvatar } from "@/lib/user/editProfile";
import { compressDataURL } from "@/lib/utils/imgcompress";

interface EditableAvatarProps {
  user: User;
}

function PaperComponent(props: PaperProps) {
  const paperRef = useRef(null);

  return (
    <Draggable
      handle="#draggable-dialog-title"
      cancel={'[class*="MuiDialogContent-root"]'}
      nodeRef={paperRef}
    >
      <Paper ref={paperRef} {...props} />
    </Draggable>
  );
}

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

function EditableAvatar({ user }: EditableAvatarProps) {
  const avatarSize = 80;
  const [open, setOpen] = useState(false);
  const [imgUrl, setImgUrl] = useState<string | File>("");
  const [scale, setScale] = useState(1.5);

  const [isLoading, setIsLoading] = useState(false);
  const editor = useRef<AvatarEditor>(null);
  const [avatarImg, setAvatarImg] = useState(user.image);

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setImgUrl("");
    setOpen(false);
  };

  const handleChangeAvatar = async () => {
    setIsLoading(true);

    let imgData = "";
    try {
      if (editor.current && imgUrl !== "") {
        const canvasScaled = editor.current.getImageScaledToCanvas();
        const editorData = canvasScaled.toDataURL();
        imgData = await compressDataURL(editorData, 0.8);
        setAvatarImg(imgData);
      } else {
        setAvatarImg("");
      }

      await changeUserAvatar(user.id, imgData);
    } catch (err: any) {
      alert(err.message);
      return;
    } finally {
      setIsLoading(false);
    }

    setImgUrl("");
    setOpen(false);
  };

  const handleDrop = (dropped: File[]) => {
    setImgUrl(dropped[0]);
  };

  return (
    <>
      <Box sx={{ display: "flex", flexDirection: "row", gap: 2 }}>
        {avatarImg !== null && avatarImg !== "" ? (
          <Avatar
            alt={user.name as string}
            src={avatarImg as string}
            sx={{
              width: avatarSize,
              height: avatarSize,
              bgcolor: "primary.main",
            }}
          />
        ) : (
          <Avatar {...stringAvatar(user.name ?? "NaN", avatarSize)} />
        )}
        <Tooltip title="change avatar" arrow placement="right">
          <IconButton
            color="primary"
            aria-label="change avatar"
            sx={{
              position: "relative",
              top: 0,
              left: 0,
              width: "36px",
              height: "36px",
            }}
            onClick={handleClickOpen}
          >
            <FaceRetouchingNaturalIcon />
          </IconButton>
        </Tooltip>
      </Box>

      <Dialog open={open} onClose={handleClose} PaperComponent={PaperComponent}>
        <DialogTitle style={{ cursor: "move" }} id="draggable-dialog-title">
          Avatar Setting
        </DialogTitle>
        <DialogContent>
          <DialogContentText fontSize={14} mb={1}>
            <li>Click "select" or drag your image into the designated area.</li>
            <li> Leave empty to remove the avatar image</li>
            *Ensure your image is in a supported format (JPEG, PNG, etc.).
          </DialogContentText>

          <Button
            component="label"
            variant="text"
            startIcon={<ImageIcon />}
            sx={{ mb: 1 }}
          >
            select
            <VisuallyHiddenInput
              type="file"
              onChange={(e) => {
                if (e.target.files) {
                  const file = e.target.files[0];
                  setImgUrl(file);
                }
              }}
            />
          </Button>
          <Box display={"flex"} flexDirection={"row"}>
            <Dropzone
              onDrop={handleDrop}
              noClick
              noKeyboard

              // style={{ width: "250px", height: "250px" }}
            >
              {({ getRootProps, getInputProps }) => (
                <div {...getRootProps()}>
                  <AvatarEditor
                    width={240}
                    height={240}
                    image={imgUrl}
                    border={50}
                    scale={scale}
                    ref={editor}
                  />
                  <input {...getInputProps()} />
                </div>
              )}
            </Dropzone>
            <Slider
              min={1}
              step={0.01}
              max={5}
              getAriaLabel={() => "Zoom"}
              getAriaValueText={(value) => `${Math.round(value * 100)}%`}
              valueLabelFormat={(value) => `${Math.round(value * 100)}%`}
              orientation="vertical"
              value={scale}
              valueLabelDisplay="auto"
              marks={[
                { value: 1, label: "1x" },
                { value: 5, label: "5x" },
              ]}
              sx={{ ml: 2, height: "340px" }}
              onChange={(e, value) => setScale(value as number)}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} sx={{ mr: 2 }}>
            Cancel
          </Button>
          <LoadingButton
            onClick={handleChangeAvatar}
            loading={isLoading}
            endIcon={<UploadIcon />}
            loadingPosition="end"
          >
            upload
          </LoadingButton>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default EditableAvatar;
