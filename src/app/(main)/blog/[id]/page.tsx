import prisma from "@/lib/db/prisma";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import React, { cache } from "react";
import "highlight.js/styles/github-dark.css";
import { compileMDX } from "next-mdx-remote/rsc";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeHighlight from "rehype-highlight";
import rehypeSlug from "rehype-slug";
import { Roboto, Cormorant, Source_Code_Pro } from "next/font/google";
import "./index.css";
import Date from "@/components/date";
import {
  Avatar,
  Box,
  Card,
  Container,
  Link,
  Paper,
  Typography,
} from "@mui/material";
import { grey } from "@mui/material/colors";

const sourceCodePro = Source_Code_Pro({
  subsets: ["latin"],
  variable: "--font-Source_Code_Pro",
  weight: "400",
  display: "swap",
});

const cormorant = Cormorant({
  subsets: ["latin"],
  variable: "--font-cormorant",
  display: "swap",
  weight: "700",
});

interface BlogDetailPageProps {
  params: {
    id: string;
  };
}

const getBlog = cache(async (id: string) => {
  try {
    const blog = await prisma.blog.findUnique({
      where: {
        id,
      },
      include: { user: true },
    });
    if (!blog) {
      notFound();
    }
    return blog;
  } catch (error) {
    console.log(error);
    return null;
  }
});

export const generateMetadata = async ({
  params: { id },
}: BlogDetailPageProps): Promise<Metadata> => {
  const blog = await getBlog(id);
  if (!blog) {
    return {
      title: "Blog not fetched",
    };
  }
  const img = blog.images?.length > 0 ? blog.images[0] : "";
  return {
    title: blog.title + " - LKC Blog ",
    description: blog.brief,
    openGraph: { images: [{ url: img }] },
  };
};

const BlogDetail = async ({ params: { id } }: BlogDetailPageProps) => {
  const blog = await getBlog(id);
  if (!blog) {
    notFound();
  }

  const { content, frontmatter } = await compileMDX<{
    title: string;
    tags: string[];
  }>({
    source: blog.content,
    options: {
      parseFrontmatter: true,
      mdxOptions: {
        rehypePlugins: [
          //@ts-ignore
          rehypeHighlight,
          rehypeSlug,
          [rehypeAutolinkHeadings, { behavior: "wrap" }],
        ],
      },
    },
  });

  // const sanitizedHTML = xss(blog.renderedContent);

  const tags = frontmatter.tags.map((tag, i) => (
    <Link
      key={i}
      href={`/tags/${tag}`}
      underline="always"
      // fontFamily={roboto.style.fontFamily}
      sx={{
        color: "black",
        bgcolor: grey[200],
        px: 1,
        borderRadius: 2,
        textDecorationColor: grey[500],
      }}
    >
      {tag}
    </Link>
  ));

  return (
    <Box
      sx={{
        mx: 0,
        px: { xs: 0, sm: 4 },
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
      }}
    >
      <Paper
        sx={{
          flexGrow: 0,
          p: 6,
          mb: 4,
          maxWidth: { xs: "100%", md: "calc(100% - 300px)" },
        }}
      >
        <Date date={blog.createdAt.toISOString()} />
        <Typography
          variant="h2"
          fontFamily={cormorant.style.fontFamily}
          sx={{ mt: 4 }}
        >
          {frontmatter.title}
        </Typography>

        <Box
          sx={{ display: "block", color: "text.secondary" }}
          className={sourceCodePro.variable}
        >
          {content}
        </Box>

        <Typography variant="h6">Related:</Typography>
        <Box sx={{ display: "flex", flexDirection: "row", gap: 2, mt: 1 }}>
          {tags}
        </Box>
      </Paper>
      <Box
        sx={{
          flexGrow: 0,
          width: { xs: "100%", md: "300px" },
          p: 2,
        }}
      >
        <Avatar alt={blog.user.name || ""} src={blog.user.image || ""}></Avatar>
        <Typography>Compiled in 2.4s (2969 modules)</Typography>
      </Box>
    </Box>
  );
};

export default BlogDetail;
