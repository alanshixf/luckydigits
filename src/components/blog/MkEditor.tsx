"use client";
import { MdEditor } from "md-editor-rt";
import React, { useState } from "react";
import "md-editor-rt/lib/style.css";
import { uploadImagesToTemp } from "@/lib/blog/blogProcessor";
import { compressDataURL } from "@/lib/utils/imgcompress";
import { CircularProgress, LinearProgress } from "@mui/material";

interface MkEditorProps {
  text: string;
  setText: React.Dispatch<React.SetStateAction<string>>;
  html: string;
  setHtml: React.Dispatch<React.SetStateAction<string>>;
}

const MkEditor = ({ text, setText, html, setHtml }: MkEditorProps) => {
  const [isUploading, setIsUploading] = useState(false);
  async function uploadImg(
    files: Array<File>,
    callback: (urls: Array<string>) => void,
  ) {
    if (files.length === 0) return;

    //check file type and size
    for (let file of files) {
      // if (file.size >= 1000000) {
      //   alert("File too large! Should be less than 1 MB");
      //   callback(["File too large"]);
      //   return;
      // }
      if (!file.type.startsWith("image/")) {
        alert("Only image files are allowed");
        callback(["File type not allowed"]);
        return;
      }
    }

    //read each file and upload it
    // let tempFiles: Array<string> = [];
    // files.forEach(async (file) => {
    //   const reader = new FileReader();
    //   reader.onloadend = async () => {
    //     const url = await uploadImagesToTemp(
    //       JSON.stringify({ fileType: file.type, fileData: reader.result }),
    //     );
    //     tempFiles.push(url);
    //   };
    //   reader.readAsDataURL(file);
    // });
    // console.log(tempFiles[0]);
    let tempFiles: Array<string> = [];

    try {
      setIsUploading(true);
      const uploadPromises = files.map(async (file) => {
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = async () => {
            const imgData = await compressDataURL(reader.result as string, 0.8);
            const url = await uploadImagesToTemp(
              JSON.stringify({ fileType: file.type, fileData: imgData }),
            );
            tempFiles.push(url);
            resolve(true);
          };
          reader.readAsDataURL(file);
        });
      });

      // wait for all files to be uploaded
      await Promise.all(uploadPromises);
    } catch (error) {
      tempFiles.push("server error");
    } finally {
      setIsUploading(false);
    }

    callback(tempFiles);
  }

  return (
    <React.Fragment>
      <MdEditor
        modelValue={text}
        onChange={setText}
        language="en-US"
        theme="light"
        previewTheme="github"
        toolbarsExclude={[
          "save",
          "fullscreen",
          "github",
          "mermaid",
          "task",
          "katex",
        ]}
        onHtmlChanged={setHtml}
        onUploadImg={uploadImg}
      />
      {isUploading && (
        <LinearProgress
          sx={{
            position: "relative",
            top: "50%",
            left: 0,
            width: "100%",
          }}
        />
      )}
    </React.Fragment>
  );
};

export default MkEditor;
