"use server";
import { Prisma } from "@prisma/client";
import prisma from "../db/prisma";
import { NULL_OBJECT_ID } from "../consts";

export async function getNewBlogWithPage(
  page: number,
  limits: number,
  where: Prisma.BlogWhereInput,
  userId?: string,
): Promise<BlogListItemWithUser[]> {
  try {
    const blogs = await prisma.blog.findMany({
      select: {
        id: true,
        postBy: true,
        title: true,
        brief: true,
        tags: true,
        published: true,
        publishedDate: true,
        showedCount: true,
        createdAt: true,
        updatedAt: true,
        Images: {
          select: {
            id: true,
            url: true,
            alt: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            image: true,
            title: true,
          },
        },
        _count: {
          select: {
            Likes: true,
            Comments: true,
          },
        },
        Likes: {
          where: {
            userId: userId ?? NULL_OBJECT_ID,
          },
          select: {
            id: true,
          },
        },
      },

      where: { ...where, published: true },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limits,
      take: limits,
    });

    return blogs;
  } catch (e: any) {
    console.log(e.message);
    throw new Error(e.message);
  }
}
