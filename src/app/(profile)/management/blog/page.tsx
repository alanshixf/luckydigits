import BlogManagementTabs from "@/components/blog/blogManagementTabs";
import { getBlogWithPage } from "@/lib/blog/blogProcessor";
import getServerSession from "@/lib/getServerSeesion";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import React, { cache } from "react";
export const metadata: Metadata = {
  metadataBase: new URL("https://luckydigits.life"),
  title: "Blog Management",
  description: "lucky digits, blogs, fortune games, lucky digits coins, nft",
};

const LIMITS = 10;
const getAllBlogsInitData = async (userId: string) => {
  return await getBlogWithPage(1, LIMITS, { postBy: userId });
};

const getUnpublishBlogsInitData = async (userId: string) => {
  return await getBlogWithPage(1, LIMITS, { postBy: userId, published: false });
};

const getPublishedBlogsInitData = async (userId: string) => {
  return await getBlogWithPage(1, LIMITS, { postBy: userId, published: true });
};

async function BlogManagementPage() {
  const session = await getServerSession();
  if (!session) {
    redirect("/api/auth/signin?callbackUrl=/management/blog");
  }
  const userId = session.user.id;

  const allBlogsInitData = await getAllBlogsInitData(userId);
  const unpublishBlogsInitData = await getUnpublishBlogsInitData(userId);
  const publishedBlogsInitData = await getPublishedBlogsInitData(userId);
  return (
    <BlogManagementTabs
      userId={session.user.id}
      limits={LIMITS}
      allBlogsInitData={allBlogsInitData}
      unpublishedBlogsInitData={unpublishBlogsInitData}
      publishedBlogsInitData={publishedBlogsInitData}
    />
  );
}

export default BlogManagementPage;
