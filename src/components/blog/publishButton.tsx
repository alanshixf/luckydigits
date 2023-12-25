"use client";
import LoadingButton from "@mui/lab/LoadingButton";
import React, { useState } from "react";
import ConfirmingDialog from "../confirmingDialog";
import PublishIcon from "@mui/icons-material/Publish";
import { publishBlog } from "@/lib/blog/blogAction";
import { CircularProgress, IconButton, Tooltip } from "@mui/material";

interface PublishBlogButtonProps {
  id: string;
  setPublished: React.Dispatch<React.SetStateAction<boolean>>;
  iconOnly?: boolean;
}

function PublishButton({
  id,
  setPublished,
  iconOnly = false,
}: PublishBlogButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const warningMsg =
    "Warning: By publishing this blog, you are making it publicly accessible to all users. Please review and ensure that the content adheres to our community guidelines and standards. Once published, the blog cannot be unpublished or edited. Are you sure you want to proceed?";
  const handlePublish = async (chosen: boolean) => {
    setOpen(false);
    if (chosen) {
      setIsLoading(true);
      try {
        const res = await publishBlog(id);
        if (res.status === "Success") setPublished(true);
        else {
          alert(res.message);
        }
      } catch (error: any) {
        alert(error.message);
      } finally {
        setIsLoading(false);
      }
    }
  };
  return (
    <React.Fragment>
      {!iconOnly ? (
        <LoadingButton
          onClick={() => setOpen(true)}
          loading={isLoading}
          startIcon={<PublishIcon />}
          loadingPosition="start"
        >
          publish
        </LoadingButton>
      ) : (
        <Tooltip title="publish" arrow placement="bottom">
          <IconButton
            onClick={() => setOpen(true)}
            disabled={isLoading}
            color="primary"
            aria-label="publish"
          >
            {isLoading ? <CircularProgress size={24} /> : <PublishIcon />}
          </IconButton>
        </Tooltip>
      )}
      <ConfirmingDialog
        open={open}
        setOpen={setOpen}
        msg={warningMsg}
        callBack={handlePublish}
      />
    </React.Fragment>
  );
}

export default PublishButton;
