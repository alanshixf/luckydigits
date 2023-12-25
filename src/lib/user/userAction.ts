"use server";

import prisma from "../db/prisma";
import getServerSession from "../getServerSeesion";

export async function setFollowedOrNot(
  followingId: string,
  setFollowed: boolean,
) {
  const session = await getServerSession();

  if (!session) {
    throw new Error("authentication failed");
  }

  try {
    if (setFollowed)
      await prisma.follow.create({
        data: {
          followerId: session.user.id,
          followingId: followingId,
        },
      });
    else
      await prisma.follow.deleteMany({
        where: {
          followerId: session.user.id,
          followingId: followingId,
        },
      });
  } catch (error) {
    throw new Error("db error");
  }
}
