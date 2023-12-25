import { Box, Link, Typography } from "@mui/material";
import React, { useState } from "react";
import ImagesExplorer from "./imagesExplorer";
import CustomImage from "./customImage";

interface BlogCardProps {
  blog: BlogListItemWithUser;
  href?: string;
}

type ImageItem = {
  id: string;
  url: string;
  alt: string | null;
};
function BlogCard({ blog, href }: BlogCardProps) {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);
  const detailHref = href ?? "/management/blog/" + blog.id;
  let showImages: ImageItem[] = [];
  if (!blog.Images) {
    showImages = [];
  } else if (blog.Images.length > 3) {
    showImages = blog.Images.slice(0, 3);
  } else {
    showImages = blog.Images;
  }

  function handleClose() {
    setOpen(false);
  }

  function handleClickOpen(index: number) {
    setOpen(true);
    setIndex(index);
  }

  return (
    <React.Fragment>
      <Box display={"flex"} flexDirection={"column"}>
        <Link href={detailHref} color={"inherit"} underline="hover">
          <Typography variant="h6">{blog.title}</Typography>
        </Link>
        <Typography
          variant="body1"
          style={{ whiteSpace: "pre-wrap" }}
          sx={{ color: "text.secondary" }}
        >
          {blog.brief}
        </Typography>

        <Box
          maxWidth={"100%"}
          display={"flex"}
          flexDirection={"row"}
          overflow="hidden"
          mt={2}
        >
          {showImages.map((image, i) => (
            <Box
              key={image.id}
              width={`calc( 100% / ${showImages.length})`}
              maxHeight={540}
              display={"block"}
              margin={"auto"}
              overflow="hidden"
            >
              <CustomImage
                key={image.id}
                src={image.url}
                alt={image.alt ?? ""}
                width={540}
                height={540}
                style={{
                  // width: `calc( 100% / ${showImages.length})`,
                  width: "100%",
                  height: "auto",
                  cursor: "pointer",
                }}
                onClick={() => handleClickOpen(i)}
              />
              <ImagesExplorer
                open={open}
                handleClose={handleClose}
                index={index}
                setIndex={setIndex}
                imageList={blog.Images ?? []}
              />
            </Box>
          ))}
        </Box>
      </Box>
    </React.Fragment>
  );
}

export default React.memo(BlogCard);
