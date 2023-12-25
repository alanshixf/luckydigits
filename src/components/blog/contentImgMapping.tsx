"use client";
import { Dialog, IconButton, Slide } from "@mui/material";
import React from "react";
import CloseIcon from "@mui/icons-material/Close";
import { TransitionProps } from "@mui/material/transitions";

interface ContentImgMappingProps {
  src?: string | undefined;
  alt?: string | undefined;
}

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="left" ref={ref} {...props} />;
});

function ContentImgMapping({ src, alt }: ContentImgMappingProps) {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  return (
    <React.Fragment>
      {src && (
        <>
          <img
            src={src}
            alt={alt ?? ""}
            onClick={handleClickOpen}
            className="blog-img"
          />
          <Dialog
            fullScreen
            open={open}
            onClose={handleClose}
            TransitionComponent={Transition}
          >
            <IconButton
              edge="start"
              color="inherit"
              onClick={handleClose}
              aria-label="close"
              sx={{
                width: 24,
                height: 24,
                top: 0,
                right: 0,
                position: "absolute",
              }}
            >
              <CloseIcon />
            </IconButton>
            <img
              src={src}
              alt={alt ?? ""}
              style={{
                maxWidth: "100%",
                maxHeight: "100%",
                margin: "auto",
              }}
            />
          </Dialog>
        </>
      )}
    </React.Fragment>
  );
}

export default ContentImgMapping;
