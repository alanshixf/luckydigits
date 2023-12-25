"use client";
import { Blog } from "@prisma/client";
import React from "react";
import MkEditor from "@/components/blog/MkEditor";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import {
  Box,
  Button,
  DialogActions,
  Divider,
  TextField,
  Typography,
} from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import SaveIcon from "@mui/icons-material/Save";

interface EditBlogFormProps {
  blog: BlogListItemWithUser | null;
  handleSubmit: (formData: FormData) => Promise<string | void>;
}

function EditBlogForm({ blog, handleSubmit }: EditBlogFormProps) {
  const [text, setText] = useState(blog?.content ?? "");
  const [html, setHtml] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!e.target) return;
    setIsLoading(true);
    const formData = new FormData(e.target as HTMLFormElement);
    const title = formData.get("title")?.toString();
    const brief = formData.get("brief")?.toString();
    const tags = formData.get("tags")?.toString();

    const content = formData.get("content")?.toString();

    if (!title) {
      alert("Please enter title!");
      setIsLoading(false);

      return;
    }
    if (!brief) {
      alert("Please enter brief!");
      setIsLoading(false);

      return;
    }
    if (!tags) {
      alert("Please enter lucky digit!");
      setIsLoading(false);

      return;
    }
    if (!content) {
      alert("Please enter content!");
      setIsLoading(false);

      return;
    }

    try {
      const res = await handleSubmit(formData);
      if (res === "Error") {
        alert("Server Error");
        setIsLoading(false);
        return;
      }
    } catch (error: any) {
      setIsLoading(false);

      alert(error.message);
    }
  }

  return (
    <React.Fragment>
      <Box
        component="form"
        onSubmit={onSubmit}
        sx={{
          "& .MuiTextField-root": { m: 1, width: { xs: "100%", sm: "50%" } },
          display: "flex",
          flexDirection: "column",
        }}
      >
        <input type="text" name="id" defaultValue={blog?.id ?? ""} hidden />
        {/* <textarea name="renderedContent" defaultValue={html} hidden /> */}
        <textarea name="content" value={text} hidden readOnly />
        <TextField
          name="title"
          defaultValue={blog?.title ?? ""}
          label="Title"
          required
          className="w-full md:w-1/2"
        />
        <TextField
          name="brief"
          defaultValue={blog?.brief ?? ""}
          label="Brief Description"
          multiline
          rows={2}
          helperText="Brief description will be showed in the blog list"
          required
          className="w-full md:w-1/2"
        />
        <TextField
          name="tags"
          label="Targs"
          defaultValue={blog?.tags ? blog.tags.join(", ") : ""}
          required
          helperText="Multiple targs, separated by comma."
          className="w-full md:w-1/2"
          style={{ whiteSpace: "pre-line" }}
        />
        <Typography variant="h5" sx={{ my: 1 }}>
          Content
        </Typography>
        <MkEditor text={text} setText={setText} html={html} setHtml={setHtml} />
        <DialogActions>
          <Button type="button" onClick={() => router.back()}>
            Back
          </Button>

          <LoadingButton
            type="submit"
            loading={isLoading}
            endIcon={<SaveIcon />}
            loadingPosition="end"
          >
            save
          </LoadingButton>
        </DialogActions>
      </Box>
    </React.Fragment>
  );
}

export default EditBlogForm;
