import { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import React from "react";
import { Box, Divider, Typography } from "@mui/material";
import { getBlog } from "@/lib/blog/getBlog";
import EditBlogForm from "@/components/blog/editBlogForm";
import { editBlogSubmit, newBlogSubmit } from "@/lib/blog/blogProcessor";
import getServerSession from "@/lib/getServerSeesion";
interface BlogEditPageProps {
  params: {
    id: string;
  };
}

export const generateMetadata = async ({
  params: { id },
}: BlogEditPageProps): Promise<Metadata> => {
  const blog = await getBlog(id);
  if (!blog) {
    return {
      title: "Blog not fetched",
    };
  }
  return {
    title: blog.title + " - LKC Blog ",
    description: "blog edit",
  };
};

const BlogEditPage = async ({ params: { id } }: BlogEditPageProps) => {
  const session = await getServerSession();
  if (!session) return <>Error</>;
  const blog = await getBlog(id);
  if (!blog || session.user.id !== blog.postBy) {
    notFound();
  }
  if (blog.published) redirect("/management/blog/" + blog.id);

  async function handleSubmit(formData: FormData) {
    "use server";

    try {
      const res = await editBlogSubmit(formData);
      if (res.status === "Error") {
        throw new Error(res.message);
      }
    } catch (error: any) {
      console.log(error);
      throw new Error(error.message);
    }
    redirect("/management/blog/" + id);
  }

  return (
    <Box sx={{ m: 4 }}>
      <Typography variant="h4" mb={2}>
        Edit Blog
      </Typography>

      <Divider sx={{ mb: 2 }} />
      <EditBlogForm blog={blog} handleSubmit={handleSubmit} />
    </Box>
  );
};

export default BlogEditPage;
