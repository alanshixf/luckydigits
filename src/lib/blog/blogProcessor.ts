"use server";
import { authOptions } from "@/lib/auth-options";
import prisma from "@/lib/db/prisma";
import cloudinary from "@/lib/utils/cloudinary";
import { Prisma } from "@prisma/client";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { checkBlogContent } from "./blogAction";
import { NULL_OBJECT_ID } from "../consts";

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

export async function newBlogSubmit(formData: FormData) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/api/auth/signin?callbackUrl=/management/blog/new");
  }
  const userId = session.user.id;

  const title = formData.get("title")?.toString();
  const brief = formData.get("brief")?.toString();
  const tags = formData
    .get("tags")
    ?.toString()
    .split(",")
    .map((item) => item.trim());
  const content = formData.get("content")?.toString();

  if (!title || !brief || !tags || !content) {
    throw new Error(`must provide everything in the form`);
  }

  try {
    await checkBlogContent(content);
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
          tags: tags,
          content,
        },
      });

      if (imgUrls.length > 0) {
        await tx.image.createMany({
          data: imgUrls.map((url) => ({
            blogId: id,
            url: url.url,
            alt: url.alt,
          })),
        });
      }
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
      if (imgUrls.some((img) => img.url === tempFile.imgUrl)) {
        await cloudinary.uploader.replace_tag("lkc", [public_id]);
      } else {
        await cloudinary.uploader.destroy(public_id);
      }
    }

    return newBlogId;
  } catch (error: any) {
    console.log(error);
    throw new Error(error.message);
  }
}

export async function editBlogSubmit(formData: FormData) {
  const session = await getServerSession(authOptions);

  const id = formData.get("id")?.toString();
  if (!id || id === "") {
    return { status: "Error", message: "no blog id" };
  }

  if (!session) {
    redirect("/api/auth/signin?callbackUrl=/management/blog/edit/" + id);
  }

  const userId = session.user.id;

  const oldBlog = await prisma.blog.findUnique({
    where: { id: id },
    select: { postBy: true, published: true, Images: true },
  });

  if (!oldBlog) {
    return { status: "Error", message: "Blog not found" };
  }

  if (oldBlog.postBy !== userId) {
    return { status: "Error", message: "Can't edit other's blog posts" };
  }

  if (oldBlog.published) {
    return { status: "Error", message: "Can't edit published blog posts" };
  }

  const title = formData.get("title")?.toString();
  const brief = formData.get("brief")?.toString();
  const tags = formData
    .get("tags")
    ?.toString()
    .split(",")
    .map((item) => item.trim());
  const content = formData.get("content")?.toString();
  if (!title || !brief || !tags || !content) {
    throw new Error(`must provide everything in the form`);
  }

  try {
    await checkBlogContent(content);
    //get all imgs url from markdown file
    const imgUrls = extractMarkdownImageLinks(content);

    //get all imgs url from CloudinaryTempFile created by current user
    const cloudinaryTempFiles = await prisma.cloudinaryTempFile.findMany({
      where: {
        userId,
      },
    });

    //update blog, then delete temp records in cloudinaryTempFiles
    await prisma.$transaction(async (tx) => {
      const newBlog = await tx.blog.update({
        where: { id },
        data: {
          title,
          brief,
          tags: tags,
          content,
        },
      });

      await tx.image.deleteMany({
        where: { blogId: id },
      });

      if (imgUrls.length > 0) {
        await tx.image.createMany({
          data: imgUrls.map((url) => ({
            blogId: id,
            url: url.url,
            alt: url.alt,
          })),
        });
      }

      await tx.cloudinaryTempFile.deleteMany({
        where: {
          userId,
        },
      });
    });

    //check if exist in blog, change tag from 'temp' to 'lkc' ; otherwise delete
    for (const tempFile of cloudinaryTempFiles) {
      const public_id = tempFile.imgUrl.split("/").pop()?.split(".")[0] || "";
      if (imgUrls.some((img) => img.url === tempFile.imgUrl)) {
        await cloudinary.uploader.replace_tag("lkc", [public_id]);
      } else {
        await cloudinary.uploader.destroy(public_id);
      }
    }

    // Look for each image in the oldBlog within the new blog. If an image does not exist, delete it from Cloudinary (if it is a Cloudinary image).

    for (const img of oldBlog.Images) {
      if (!imgUrls.some((url) => url.url === img.url)) {
        if (img.url.startsWith("https://res.cloudinary.com")) {
          const public_id = img.url.split("/").pop()?.split(".")[0] || "";

          await cloudinary.uploader.destroy(public_id);
        }
      }
    }

    return { status: "success", message: id };
  } catch (error: any) {
    console.log(error);
    return { status: "Error", message: error.message };
  }
}

export async function deleteBlog(id: string) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/api/auth/signin?callbackUrl=/management/blog/" + id);
  try {
    const blog = await prisma.blog.findUnique({
      where: { id: id },
      select: { id: true, postBy: true, Images: true },
    });
    if (!blog) {
      return { status: "Error", message: "No blog found by id:" + id };
    }

    if (blog.postBy !== session.user.id) {
      return { status: "Error", message: "Cant delete other's blog!" };
    }

    await prisma.blog.delete({
      where: { id: id },
    });
    for (const img of blog.Images) {
      if (img.url.startsWith("https://res.cloudinary.com")) {
        const public_id = img.url.split("/").pop()?.split(".")[0] || "";

        await cloudinary.uploader.destroy(public_id);
      }
    }
  } catch (error: any) {
    return { status: "Error", message: error.message };
  }
  return { status: "success", message: "Blog deleted successfully" };
}

export async function getBlogWithPage(
  page: number,
  limits: number,
  where: Prisma.BlogWhereInput,
  // orderBy: Prisma.BlogOrderByWithRelationInput,
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
            userId: NULL_OBJECT_ID,
          },
          select: {
            id: true,
          },
        },
      },

      where: where,
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

function extractMarkdownImageLinks(markdownText: string) {
  const imgRegex = /!\[(.*?)\]\((.*?)\)/g;
  const matches = [];

  let match;
  while ((match = imgRegex.exec(markdownText)) !== null) {
    const url = match[2];
    const alt = match[1];
    matches.push({ url, alt });
  }

  return matches;
}
