import { Blog } from "@prisma/client";
import React from "react";
import Date from "../date";
import { Cormorant, Source_Code_Pro } from "next/font/google";
import "highlight.js/styles/github-dark.css";
import { compileMDX } from "next-mdx-remote/rsc";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeHighlight from "rehype-highlight";
import rehypeSlug from "rehype-slug";
import gfm from "remark-gfm";
import ContentImgMapping from "@/components/blog/contentImgMapping";

import { Box, Link, Paper, Table, Typography } from "@mui/material";
import { blueGrey } from "@mui/material/colors";
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

interface ShowBlogProps {
  blog: BlogListItemWithUser;
}

async function ShowBlog({ blog }: ShowBlogProps) {
  let result;
  try {
    const { content, frontmatter } = await compileMDX<{
      title: string;
      tags: string[];
    }>({
      source: blog.content ?? "",
      components: {
        CustomImage: ContentImgMapping,
        img: ContentImgMapping,
      },
      options: {
        parseFrontmatter: true,
        mdxOptions: {
          remarkPlugins: [gfm],
          rehypePlugins: [
            //@ts-ignore
            // rehypeRaw,
            // rehypeSanitize,
            //@ts-ignore
            rehypeHighlight,
            rehypeSlug,
            [rehypeAutolinkHeadings, { behavior: "wrap" }],
          ],
        },
      },
    });
    result = content;
  } catch (error) {
    console.log(error);
    return (
      <div>Oops! Something went wrong while trying to display this blog.</div>
    );
  }

  const tags = blog.tags.map((tag, i) => (
    <Link
      key={i}
      href={`/tags/${tag}`}
      underline="always"
      // fontFamily={roboto.style.fontFamily}
      sx={{
        // color: "black",
        bgcolor: blueGrey[500],
        px: 1,
        borderRadius: 2,
        textDecorationColor: blueGrey[500],
      }}
    >
      {tag}
    </Link>
  ));
  return (
    <Paper
      sx={{
        flexGrow: 1,
        px: { xs: 2, md: 4 },
        py: 4,
        maxWidth: { xs: "100%", md: "calc(100% - 300px)" },
        height: "100%",
      }}
    >
      <Date
        date={
          blog.publishedDate
            ? blog.publishedDate.toISOString()
            : blog.createdAt.toISOString()
        }
      />
      <Typography
        variant="h3"
        fontFamily={cormorant.style.fontFamily}
        sx={{ mt: 4 }}
      >
        {blog.title}
      </Typography>

      <Box
        sx={{ display: "block", color: "text.secondary" }}
        className={sourceCodePro.variable + " blog-content"}
      >
        {result}
      </Box>

      <Typography variant="h6">Related:</Typography>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          gap: 2,
          mt: 1,
          width: "100%",
          flexWrap: "wrap",
        }}
      >
        {tags}
      </Box>
    </Paper>
  );
}

export default ShowBlog;
