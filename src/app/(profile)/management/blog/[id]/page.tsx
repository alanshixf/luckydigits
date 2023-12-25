import { BlogDetailPageOperators } from "./../../../../../components/blog/blogDetailPageOperators";
import { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import React from "react";
import { Avatar, Box, Button, Typography } from "@mui/material";
import ShowBlog from "@/components/blog/showBlog";
import "../../../../(main)/blog/[id]/index.css";
import { getBlog } from "../../../../../lib/blog/getBlog";
import getServerSession from "@/lib/getServerSeesion";

interface BlogDetailPageProps {
  params: {
    id: string;
  };
}

export const generateMetadata = async ({
  params: { id },
}: BlogDetailPageProps): Promise<Metadata> => {
  const blog = await getBlog(id);
  if (!blog) {
    return {
      title: "Blog not fetched",
    };
  }
  const img = blog.Images?.length > 0 ? blog.Images[0] : { url: "" };
  return {
    title: blog.title + " - LKC Blog ",
    description: blog.brief,
    openGraph: { images: [{ url: img.url }] },
  };
};

const BlogDetail = async ({ params: { id } }: BlogDetailPageProps) => {
  const session = await getServerSession();
  if (!session) redirect("/api/auth/signin?callbackUrl=/management/blog/" + id);
  const blog = await getBlog(id);
  if (!blog || session.user.id !== blog.postBy) {
    notFound();
  }

  // const sanitizedHTML = xss(blog.renderedContent);

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        mx: 0,
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
      }}
    >
      <ShowBlog blog={blog} />
      <BlogDetailPageOperators blog={blog} />
    </Box>
  );
};

export default BlogDetail;
