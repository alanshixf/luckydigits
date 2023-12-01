"use server";

import { authOptions } from "@/lib/auth-options";
import prisma from "@/lib/db/prisma";
import cloudinary from "@/lib/utils/cloudinary";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

/**
 * upload file to cloudinary with "temp" tag, then record to mongoDB
 */
export async function uploadImagesToTemp(file: string): Promise<string> {
  const session = await getServerSession(authOptions);
  if (!session) {
    return "not login";
  }
  const userId = session.user.id;
  try {
    const { fileType, fileData } = JSON.parse(file);
    const uploadedImageResponse = await cloudinary.uploader.upload(fileData, {
      tags: "temp",
    });
    const imgUrl = uploadedImageResponse.secure_url;
    await prisma.cloudinaryTempFile.create({
      data: {
        imgUrl: imgUrl,
        userId: userId,
      },
    });
    // var base64Data = fileData.replace(/^data:image\/\w+;base64,/, "");
    // const binaryData = Buffer.from(base64Data, "base64");
    // const fileName = uuidv4() + "." + fileType.split("/")[1];

    // fs.writeFileSync(path.join(tempDir, fileName), binaryData);
    return imgUrl;
  } catch (err) {
    console.error("Error creating temporary file:", err);
    return "server error";
  }
}

export async function newBlogSubmit(
  title: string,
  brief: string,
  luckyDigit: number,
  content: string,
  renderedContent: string,
) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/api/auth/signin?callbackUrl=/blog/new");
  }
  const userId = session.user.id;

  if (!title || !brief || !luckyDigit || !content || !renderedContent) {
    throw new Error(`must provide everything in the form`);
  }

  try {
    //get all imgs url from markdown file
    const imgUrls = extractMarkdownImageLinks(content);

    //get all imgs url from CloudinaryTempFile created by current user
    const cloudinaryTempFiles = await prisma.cloudinaryTempFile.findMany({
      where: {
        userId,
      },
    });

    //create new blog and delete temp records in cloudinaryTempFiles
    let newBlogId = "";
    await prisma.$transaction(async (tx) => {
      const { id } = await tx.blog.create({
        data: {
          postBy: userId,
          title,
          brief,
          luckyDigit,
          content,
          renderedContent,
          images: imgUrls,
        },
      });
      newBlogId = id;

      await tx.cloudinaryTempFile.deleteMany({
        where: {
          userId,
        },
      });
    });

    //check if exist in blog, change tag from 'temp' to 'lkc' ; otherwise delete
    for (const tempFile of cloudinaryTempFiles) {
      const public_id = tempFile.imgUrl.split("/").pop()?.split(".")[0] || "";
      if (imgUrls.includes(tempFile.imgUrl)) {
        await cloudinary.uploader.replace_tag("lkc", [public_id]);
      } else {
        await cloudinary.uploader.destroy(public_id);
      }
    }

    return newBlogId;
  } catch (error) {
    console.log(error);
    return "Error";
  }
}

function extractMarkdownImageLinks(markdownText: string) {
  const imgRegex = /!\[.*?\]\((.*?)\)/g;
  const matches = [];

  let match;
  while ((match = imgRegex.exec(markdownText)) !== null) {
    matches.push(match[1]);
  }

  return matches;
}
