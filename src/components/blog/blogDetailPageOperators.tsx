"use client";
import {
  Box,
  Button,
  CSSObject,
  Theme,
  Typography,
  styled,
} from "@mui/material";
import { Blog } from "@prisma/client";
import React, { useState } from "react";
import DoneIcon from "@mui/icons-material/Done";
import EditIcon from "@mui/icons-material/Edit";
import PublishIcon from "@mui/icons-material/Publish";
import BlogDeleteButton from "@/components/blog/blogDeleteButton";
import PublishButton from "./publishButton";
import { useRouter } from "next/navigation";
interface BlogDetailPageOperatorsProps {
  blog: BlogListItemWithUser;
}

const drawerWidth = 300;
const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerWidth,
  position: "fixed",
  overflowX: "hidden",
  zIndex: 100,
  top: "128px",
  right: "0px",

  [theme.breakpoints.down("md")]: {
    top: "0px",
  },

  [theme.breakpoints.up(1600)]: {
    right: `calc((100% - 1600px) / 2)`,
  },
});

const Operators = styled(Box, {
  shouldForwardProp: (prop) => true,
})(({ theme }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",

  ...openedMixin(theme),
  "& .MuiDrawer-paper": openedMixin(theme),
}));

export function BlogDetailPageOperators({
  blog,
}: BlogDetailPageOperatorsProps) {
  const [published, setPublished] = useState(blog.published);
  const router = useRouter();
  const onDeleted = (id: string) => {
    router.push("/management/blog");
  };

  return (
    <Operators
      sx={{
        flexGrow: 0,
        width: {
          xs: "100%",
          md: "300px",
        },
        mt: { xs: 0, md: 2 },
        mb: 4,
        position: {
          xs: "relative",
          md: "fixed",
        },
        overflowX: "hidden",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: {
            xs: "row",
            md: "column",
          },
          mx: 2,
          gap: 2,
          alignItems: "start",
        }}
      >
        {published ? (
          <Typography variant="body2" pb="8px">
            published
            <DoneIcon color="primary" />
          </Typography>
        ) : (
          <>
            <Button
              startIcon={<EditIcon />}
              href={"/management/blog/edit/" + blog.id}
            >
              edit
            </Button>

            <PublishButton id={blog.id} setPublished={setPublished} />
          </>
        )}
        <BlogDeleteButton id={blog.id} onDeleted={onDeleted} />
      </Box>
    </Operators>
  );
}
