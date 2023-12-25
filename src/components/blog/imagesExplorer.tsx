import { Box, Dialog, IconButton, Slide } from "@mui/material";
import { TransitionProps } from "@mui/material/transitions";
import CloseIcon from "@mui/icons-material/Close";
import KeyboardDoubleArrowLeftIcon from "@mui/icons-material/KeyboardDoubleArrowLeft";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";
import grey from "@mui/material";
import React, { useState } from "react";
import CustomImage from "./customImage";

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="left" ref={ref} {...props} />;
});

interface ImagesExplorerProps {
  open: boolean;
  imageList: { url: string; alt: string | null }[];
  handleClose: () => void;
  index: number;
  setIndex: React.Dispatch<React.SetStateAction<number>>;
}
function ImagesExplorer({
  open,
  imageList,
  handleClose,
  index,
  setIndex,
}: ImagesExplorerProps) {
  const [direction, setDirection] = useState<"right" | "left">("left");
  const [isIn, setIsIn] = useState(true);
  function handleLeftClick() {
    if (index > 0) {
      setDirection("left");
      setIsIn(false);
      setTimeout(() => {
        setIndex(index - 1);
        setDirection("right");

        setIsIn(true);
      }, 250);
    }
  }

  function handleRightClick() {
    if (index < imageList.length - 1) {
      setDirection("right");
      setIsIn(false);
      setTimeout(() => {
        setIndex(index + 1);
        setDirection("left");

        setIsIn(true);
      }, 250);
    }
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "ArrowLeft") {
      handleLeftClick();
    } else if (event.key === "ArrowRight") {
      handleRightClick();
    }
  };
  return (
    <div>
      <Dialog
        fullScreen
        open={open}
        onClose={handleClose}
        TransitionComponent={Transition}
        sx={{
          "& .MuiDialog-paper": { backgroundImage: "none" },
          overflow: "hidden",
        }}
        onKeyDown={handleKeyDown}
      >
        <IconButton
          edge="start"
          color="inherit"
          onClick={handleClose}
          aria-label="close"
          sx={{
            width: 24,
            height: 24,
            top: "16px",
            right: "16px",
            position: "absolute",
          }}
        >
          <CloseIcon />
        </IconButton>
        <Box
          display="flex"
          flexDirection="row"
          justifyContent="center"
          my={"auto"}
        >
          <IconButton
            disabled={index === 0}
            sx={{
              mx: 1,
              my: "auto",
              flexGrow: 0,
              width: "64px",
              height: "48px",
              borderRadius: 1,
            }}
            onClick={handleLeftClick}
          >
            <KeyboardDoubleArrowLeftIcon />
          </IconButton>
          <Box display="flex" flexGrow={1} margin={"auto"} overflow={"hidden"}>
            <Slide
              direction={direction}
              in={isIn}
              mountOnEnter
              unmountOnExit
              timeout={200}
              appear={false}
            >
              <Box
                width={"90%"}
                maxHeight={"90%"}
                margin={"auto"}
                display={"flex"}
              >
                <CustomImage
                  src={imageList[index].url}
                  alt={imageList[index].alt ?? ""}
                  width={1920}
                  height={1920}
                  style={{
                    width: "auto",
                    height: "auto",
                    maxHeight: "100%",
                    maxWidth: "100%",

                    margin: "auto",
                  }}
                />
              </Box>
            </Slide>
          </Box>
          <IconButton
            disabled={index >= imageList.length - 1}
            sx={{
              mx: 1,
              my: "auto",
              flexGrow: 0,
              width: "64px",
              height: "48px",
              borderRadius: 1,
            }}
            onClick={handleRightClick}
          >
            <KeyboardDoubleArrowRightIcon />
          </IconButton>
        </Box>
      </Dialog>
    </div>
  );
}

export default ImagesExplorer;
