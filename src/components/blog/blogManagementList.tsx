"use client";
import React, { useCallback, useEffect, useState } from "react";
import BlogCard from "./blogCard";
import useInfinityQuery from "@/hooks/useInfinityQuery";
import { getBlogWithPage } from "@/lib/blog/blogProcessor";
import {
  Box,
  CircularProgress,
  Divider,
  Grid,
  IconButton,
  Tooltip,
  Typography,
} from "@mui/material";
import { useRef } from "react";
import { useIntersection } from "@mantine/hooks";
import { getFormattedDateWithShortMonth } from "@/lib/utils/getFormattedDate";
import DoneIcon from "@mui/icons-material/Done";
import EditIcon from "@mui/icons-material/Edit";
import BlogDeleteButton from "@/components/blog/blogDeleteButton";
import PublishButton from "./publishButton";

interface BlogManagementListProps {
  tabs: "All" | "Unpublished" | "Published";
  userId: string;
  initData: BlogListItemWithUser[];
  limits: number;
}

function BlogManagementList({
  tabs,
  userId,
  initData,
  limits,
}: BlogManagementListProps) {
  const fetchBlogs = useCallback(
    async (pages: number) => {
      let where = {};
      if (tabs === "All") {
        where = { postBy: userId };
      } else if (tabs === "Published") {
        where = { postBy: userId, published: true };
      } else if (tabs === "Unpublished") {
        where = { postBy: userId, published: false };
      }
      return await getBlogWithPage(pages, limits, where);
    },
    [limits, tabs, userId],
  );

  const { data, setData, fetchNextPage, isFetching, isEnded } =
    useInfinityQuery<BlogListItemWithUser>(limits, fetchBlogs, initData);

  const onDeleted = useCallback(
    (id: string) => {
      setData((prevData) => prevData.filter((item) => item.id !== id));
    },
    [setData],
  );

  const containerRef = useRef<HTMLDivElement>(null);
  const { ref, entry } = useIntersection({
    root: containerRef.current,
    threshold: 1,
  });

  useEffect(() => {
    if (entry?.isIntersecting) fetchNextPage();
  }, [entry, fetchNextPage]);

  return (
    <React.Fragment>
      <Box
        sx={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {data.length !== 0 ? (
          data.map((item: BlogListItemWithUser) => {
            return (
              <React.Fragment key={item.id}>
                <ActionList blog={item} onDeleted={onDeleted} />
                <Grid container spacing={1}>
                  <Grid
                    item
                    xs={0}
                    md={4}
                    display={"flex"}
                    flexDirection={{ xs: "row", md: "column" }}
                    mb={1}
                    sx={{ display: { xs: "none", md: "block" } }}
                  >
                    <Box sx={{ mb: 2, mr: 4 }}>
                      <Typography variant="body2">Created at:</Typography>
                      <Typography variant="body2">
                        {getFormattedDateWithShortMonth(
                          item.createdAt.toISOString(),
                        )}
                      </Typography>
                    </Box>
                    <Box sx={{ mb: 2, mr: 4 }}>
                      <Typography variant="body2">Updated at:</Typography>
                      <Typography variant="body2">
                        {getFormattedDateWithShortMonth(
                          item.updatedAt.toISOString(),
                        )}
                      </Typography>
                    </Box>
                    {item.published && (
                      <Box>
                        <Typography variant="body2">Published at:</Typography>
                        <Typography variant="body2">
                          {getFormattedDateWithShortMonth(
                            item.publishedDate?.toISOString() ?? "error",
                          )}
                        </Typography>
                      </Box>
                    )}
                  </Grid>
                  <Grid item xs={12} md={8}>
                    <BlogCard key={item.id} blog={item} />
                  </Grid>
                </Grid>
                <Divider sx={{ my: 2 }} />
              </React.Fragment>
            );
          })
        ) : (
          <Typography variant="h6">no data</Typography>
        )}

        {isFetching ? (
          <Box sx={{ display: "flex", mx: "auto", mt: 1 }}>
            <CircularProgress />
          </Box>
        ) : isEnded ? (
          <Divider sx={{ mt: 2 }}>Reach Bottom</Divider>
        ) : (
          <div ref={ref}></div>
        )}
      </Box>
    </React.Fragment>
  );
}

export default BlogManagementList;

interface ActionListProps {
  blog: BlogListItemWithUser;
  onDeleted: (id: string) => void;
}
function ActionList({ blog, onDeleted }: ActionListProps) {
  const [published, setPublished] = useState(blog.published);
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",

        mx: 2,
        gap: 2,
        justifyContent: "flex-end",
      }}
    >
      {published ? (
        <Tooltip title="published" arrow placement="bottom">
          <IconButton aria-label="published" color="primary">
            <DoneIcon />
          </IconButton>
        </Tooltip>
      ) : (
        <>
          <Tooltip title="edit" arrow placement="bottom">
            <IconButton
              href={"/management/blog/edit/" + blog.id}
              aria-label="edit blog"
              color="primary"
            >
              <EditIcon />
            </IconButton>
          </Tooltip>

          <PublishButton
            id={blog.id}
            setPublished={setPublished}
            iconOnly={true}
          />
        </>
      )}
      <BlogDeleteButton id={blog.id} onDeleted={onDeleted} iconOnly={true} />
    </Box>
  );
}
