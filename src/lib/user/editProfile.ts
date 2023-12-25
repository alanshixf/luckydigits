"use server";
import { authOptions } from "@/lib/auth-options";
import prisma from "@/lib/db/prisma";
import cloudinary from "@/lib/utils/cloudinary";
import { getServerSession } from "next-auth";

export async function changeUserAvatar(
  userId: string,
  imgData: string,
): Promise<string> {
  const session = await getServerSession(authOptions);
  if (!session) {
    throw new Error("not login");
  }
  if (session.user.id !== userId) {
    throw new Error("Illegal operation");
  }

  // const userId = session.user.id;
  try {
    const userImg = session.user.image;
    //if img on cloud, delete it
    if (userImg?.startsWith("https://res.cloudinary.com")) {
      const public_id = userImg.split("/").pop()?.split(".")[0] || "";
      await cloudinary.uploader.destroy(public_id);
    }

    if (imgData !== "") {
      const uploadedImageResponse = await cloudinary.uploader.upload(imgData, {
        tags: "avatar",
      });
      const imgUrl = uploadedImageResponse.secure_url;
      await prisma.user.update({
        where: { id: userId },
        data: { image: imgUrl },
      });
      return "success";
    } else {
      await prisma.user.update({
        where: { id: userId },
        data: { image: "" },
      });
      return "success";
    }
  } catch (err) {
    console.log(err);
    throw new Error("something went wrong");
  }
}

export async function updateUsername(
  userId: string,
  username: string,
): Promise<string> {
  const session = await getServerSession(authOptions);
  if (!session) {
    throw new Error("not login");
  }
  if (session.user.id !== userId) {
    throw new Error("Illegal operation");
  }

  if (username === "") {
    throw new Error("user name is required");
  }

  try {
    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        name: username,
      },
    });
  } catch (err) {
    return "something went wrong";
  }

  return "successfully updated";
}

export async function updateUserTitle(
  userId: string,
  userTitle: string,
): Promise<string> {
  const session = await getServerSession(authOptions);
  if (!session) {
    throw new Error("not login");
  }
  if (session.user.id !== userId) {
    throw new Error("Illegal operation");
  }

  try {
    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        title: userTitle,
      },
    });
  } catch (err) {
    throw err;
  }

  return "successfully updated";
}

export async function updateAboutMe(
  userId: string,
  aboutMe: string,
): Promise<string> {
  const session = await getServerSession(authOptions);
  if (!session) {
    throw new Error("not login");
  }
  if (session.user.id !== userId) {
    throw new Error("Illegal operation");
  }

  try {
    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        aboutMe: aboutMe,
      },
    });
  } catch (err) {
    throw err;
  }

  return "successfully updated";
}
