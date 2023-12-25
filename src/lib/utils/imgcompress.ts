"use client";
export function compressDataURL(
  dataURL: string,
  quality: number,
): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = dataURL;

    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        alert("2d context not available!");
        reject(new Error("2d context not available")); //
      } else {
        canvas.width = img.width;
        canvas.height = img.height;

        // 绘制图像到 canvas
        ctx.drawImage(img, 0, 0, img.width, img.height);

        // 将 canvas 转换为新的 Data URL，指定压缩质量
        const compressedDataURL = canvas.toDataURL("image/jpeg", quality);

        resolve(compressedDataURL);
      }
    };

    img.onerror = (error) => {
      reject(error);
    };
  });
}
