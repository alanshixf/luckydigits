"use server";

import prisma from "@/lib/db/prisma";
import cloudinary from "@/lib/utils/cloudinary";

/**
 * upload file to cloudinary with "temp" tag, then record to mongoDB
 */
export async function uploadImagesToTemp(file: string): Promise<string> {
  try {
    const { fileType, fileData } = JSON.parse(file);
    const uploadedImageResponse = await cloudinary.uploader.upload(fileData, {
      tags: "temp",
    });
    const imgUrl = uploadedImageResponse.secure_url;
    await prisma.cloudinaryTempFile.create({
      data: {
        imgUrl: imgUrl,
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
