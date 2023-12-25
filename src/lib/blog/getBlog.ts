import "server-only";
import prisma from "@/lib/db/prisma";
import { notFound } from "next/navigation";
import { cache } from "react";
import { NULL_OBJECT_ID } from "../consts";
import getServerSession from "../getServerSeesion";

export const getBlog = cache(async (id: string) => {
  const session = await getServerSession();
  const userId = session?.user.id ?? NULL_OBJECT_ID;
  try {
    const firsttime = Date.now();

    const blog = await prisma.blog.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        postBy: true,
        title: true,
        brief: true,
        content: true,
        tags: true,
        published: true,
        publishedDate: true,
        showedCount: true,
        createdAt: true,
        updatedAt: true,
        // Images: {
        //   select: {
        //     id: true,
        //     url: true,
        //     alt: true,
        //   },
        // },
        // user: {
        //   select: {
        //     id: true,
        //     name: true,
        //     image: true,
        //     title: true,
        //     aboutMe: true,
        //     _count: {
        //       select: {
        //         blogs: true,
        //         Comments: true,
        //         followers: true,
        //         followings: true,
        //       },
        //     },
        //   },
        // },
        _count: {
          select: {
            Likes: true,
            Comments: true,
          },
        },
        // Likes: {
        //   where: {
        //     userId: userId,
        //   },
        //   select: {
        //     id: true,
        //   },
        // },
      },
    });

    if (!blog) return notFound();
    const secondtime = Date.now();
    console.log("time1: " + (secondtime - firsttime).toString());
    const userQuery = prisma.user.findUnique({
      where: { id: blog.postBy },
      select: {
        id: true,
        name: true,
        image: true,
        title: true,
        aboutMe: true,
        _count: {
          select: {
            blogs: { where: { published: true } },
            Comments: true,
            followers: true,
            followings: true,
          },
        },
      },
    });
    const ImagesQuery = prisma.image.findMany({
      where: { blogId: id },
      select: {
        id: true,
        url: true,
        alt: true,
      },
    });

    const LikesQuery = prisma.like.findMany({
      where: { likedId: id, userId },
    });
    const time1 = Date.now();
    const [user, Images, Likes] = await Promise.all([
      userQuery,
      ImagesQuery,
      LikesQuery,
    ]);
    if (!user) {
      notFound();
    }
    const time2 = Date.now();
    console.log("time3: " + (time2 - time1));
    return { ...blog, user, Images, Likes };
  } catch (error) {
    console.log(error);
    return null;
  }
});

export async function getIsFollowed(followerId: string, followingId: string) {
  const follow = await prisma.follow.findFirst({
    where: { followerId: followerId, followingId: followingId },
    select: { id: true },
  });

  return follow !== null;
}
