import prisma from "@/lib/db/prisma";
import { User } from "@nextui-org/react";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import React, { cache } from "react";
import "highlight.js/styles/github-dark.css";
import { compileMDX } from "next-mdx-remote/rsc";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeHighlight from "rehype-highlight";
import rehypeSlug from "rehype-slug";
import Link from "next/link";
import { Roboto_Slab, Cormorant } from "next/font/google";
import Date from "@/components/date";

const roboto_slab = Roboto_Slab({
  subsets: ["latin"],
  variable: "--font-roboto-slab",
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
          rehypeHighlight,
          rehypeSlug,
          [rehypeAutolinkHeadings, { behavior: "wrap" }],
        ],
      },
    },
  });

  // const sanitizedHTML = xss(blog.renderedContent);

  const tags = frontmatter.tags.map((tag, i) => (
    <Link key={i} href={`/tags/${tag}`}>
      {tag}
    </Link>
  ));

  return (
    <div className="prose  prose-slate flex max-w-full flex-col md:prose-xl md:flex-row">
      <div className={"flex-1 p-6 " + roboto_slab.className}>
        <Date date={blog.createdAt.toISOString()} />
        <h1 className={"mb-0 mt-4 text-3xl " + cormorant.className}>
          {frontmatter.title}
        </h1>

        <article className=" bg-[#e6ffff] p-6">{content}</article>
        <section>
          <h3>Related:</h3>
          <div className="flex flex-row gap-4">{tags}</div>
        </section>
      </div>
      <div className="w-full md:w-80">
        <User
          name={blog.user.name}
          avatarProps={{ src: blog.user.image ? blog.user.image : "" }}
        ></User>
      </div>
    </div>
  );
};

export default BlogDetail;
