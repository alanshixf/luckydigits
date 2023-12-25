import prisma from "@/lib/db/prisma";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import React, { cache } from "react";
import { Avatar, Box, Typography } from "@mui/material";
import ShowBlog from "@/components/blog/showBlog";
import "./index.css";
import { getBlog, getIsFollowed } from "@/lib/blog/getBlog";
import AuthorCard from "@/components/blog/authorCard";
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

const setShowedCounts = async (id: string) => {
  await prisma.blog.update({
    where: { id: id },
    data: { showedCount: { increment: 1 } },
    select: { id: true },
  });
};
const BlogDetail = async ({ params: { id } }: BlogDetailPageProps) => {
  const session = await getServerSession();
  const blog = await getBlog(id);
  if (!blog || !blog.published) {
    notFound();
  }
  const time1 = Date.now();

  await setShowedCounts(id);
  const time2 = Date.now();

  console.log("time4: " + (time2 - time1));
  const author = { ...blog.user, isFollowed: false };
  if (session) {
    const isFollowed = await getIsFollowed(session.user.id, author.id);
    author.isFollowed = isFollowed;
  }

  // const sanitizedHTML = xss(blog.renderedContent);

  return (
    <Box
      sx={{
        mx: 0,
        display: "flex",
        flexGrow: 1,
        flexDirection: { xs: "column-reverse", md: "row" },
      }}
    >
      <ShowBlog blog={blog} />
      <Box
        sx={{
          flexGrow: 0,
          width: { xs: "100%", md: "300px" },
          p: 2,
        }}
      >
        <AuthorCard author={author} isLogined={session !== null} />
      </Box>
    </Box>
  );
};

export default BlogDetail;
