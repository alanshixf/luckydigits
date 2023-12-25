"use client";
import React, { useCallback, useEffect, useState } from "react";
import BlogCard from "./blogCard";
import useInfinityQuery from "@/hooks/useInfinityQuery";
import {
  Avatar,
  Box,
  CircularProgress,
  Divider,
  Grid,
  Typography,
} from "@mui/material";
import { useRef } from "react";
import { useIntersection } from "@mantine/hooks";
import { getFormattedDateWithShortMonth } from "@/lib/utils/getFormattedDate";
import { LIMITS } from "@/lib/consts";
import { getNewBlogWithPage } from "@/lib/blog/blogPublicProcess";
import { Session } from "next-auth";
import { stringAvatar } from "@/lib/utils/stringAvatar";
import BlogListAuthor from "./blogListAuthor";

interface BlogPublicListProps {
  session: Session | null;
  initData: BlogListItemWithUser[];
  lastRefreshed: Date;
}
function BlogPublicList({
  initData,
  session,
  lastRefreshed,
}: BlogPublicListProps) {
  const fetchBlogs = useCallback(
    async (pages: number) => {
      if (session) {
        return await getNewBlogWithPage(
          pages,
          LIMITS,
          {
            updatedAt: { lt: lastRefreshed },
          },
          session.user.id,
        );
      } else {
        return await getNewBlogWithPage(pages, LIMITS, {
          updatedAt: { lt: lastRefreshed },
        });
      }
    },
    [lastRefreshed, session],
  );

  const { data, fetchNextPage, isFetching, isEnded } =
    useInfinityQuery<BlogListItemWithUser>(LIMITS, fetchBlogs, initData);

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
          maxWidth: "960px",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {data.length !== 0 ? (
          data.map((item: BlogListItemWithUser) => {
            return (
              <React.Fragment key={item.id}>
                <BlogListAuthor blog={item} session={session} />

                <BlogCard key={item.id} blog={item} href={"/blog/" + item.id} />

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

export default BlogPublicList;
