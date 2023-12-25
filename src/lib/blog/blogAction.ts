"use server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth-options";
import { redirect } from "next/navigation";
import prisma from "../db/prisma";
// import { compileMDX } from "next-mdx-remote/rsc";

// import rehypeAutolinkHeadings from "rehype-autolink-headings";
// import rehypeHighlight from "rehype-highlight";
// import rehypeSlug from "rehype-slug";

export async function publishBlog(id: string) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/api/auth/signin?callbackUrl=/management/blog/" + id);
  try {
    const blog = await prisma.blog.findUnique({
      where: { id: id },
      select: { id: true, postBy: true },
    });
    if (!blog) {
      return { status: "Error", message: "No blog found by id:" + id };
    }

    if (blog.postBy !== session.user.id) {
      return { status: "Error", message: "Cant publish other's blog!" };
    }

    await prisma.blog.update({
      where: { id: id },
      data: { published: true, publishedDate: new Date() },
    });
  } catch (error: any) {
    return { status: "Error", message: error.message };
  }
  return { status: "Success", message: "Blog published successfully" };
}

export async function checkBlogContent(blogTxt: string) {
  // try {
  //   const { content, frontmatter } = await compileMDX<{
  //     title: string;
  //     tags: string[];
  //   }>({
  //     source: blogTxt,

  //     options: {
  //       parseFrontmatter: true,
  //       mdxOptions: {
  //         rehypePlugins: [
  //           //@ts-ignore
  //           // rehypeRaw,
  //           // rehypeSanitize,
  //           //@ts-ignore
  //           rehypeHighlight,
  //           rehypeSlug,
  //           [rehypeAutolinkHeadings, { behavior: "wrap" }],
  //         ],
  //       },
  //     },
  //   });
  // } catch (error: any) {
  //   throw new Error("Illegal syntax: " + error.message);
  // }
  return true;
}
