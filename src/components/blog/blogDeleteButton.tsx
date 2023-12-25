"use client";
import LoadingButton from "@mui/lab/LoadingButton";
import React, { useState } from "react";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import ConfirmingDialog from "../confirmingDialog";
import { deleteBlog } from "@/lib/blog/blogProcessor";
import { useRouter } from "next/navigation";
import { CircularProgress, IconButton, Tooltip } from "@mui/material";

/**
 * Props for the BlogDeleteButton component.
 *
 * @param id - The ID of the blog to be deleted.
 * @param nextUrl - The URL to redirect to after the blog is deleted.
 */
interface BlogDeleteButtonProps {
  id: string;
  onDeleted: (blogId: string) => void;
  iconOnly?: boolean;
}

function BlogDeleteButton({
  id,
  onDeleted,
  iconOnly = false,
}: BlogDeleteButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const warningMsg =
    "Deleting this blog is irreversible and will permanently remove all associated content. Are you sure you want to proceed with the deletion? This action cannot be undone.";

  const handleDelete = async (chosen: boolean) => {
    setOpen(false);
    if (chosen) {
      setIsLoading(true);
      try {
        const res = await deleteBlog(id);
        if (res.status === "success") onDeleted(id);
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
          color="warning"
          loading={isLoading}
          startIcon={<DeleteForeverIcon />}
          loadingPosition="start"
        >
          delete
        </LoadingButton>
      ) : (
        <Tooltip title="delete" arrow placement="bottom">
          <IconButton
            onClick={() => setOpen(true)}
            disabled={isLoading}
            aria-label="delete"
            color="primary"
          >
            {isLoading ? (
              <CircularProgress size={24} />
            ) : (
              <DeleteForeverIcon color="warning" />
            )}
          </IconButton>
        </Tooltip>
      )}
      <ConfirmingDialog
        open={open}
        setOpen={setOpen}
        msg={warningMsg}
        callBack={handleDelete}
      />
    </React.Fragment>
  );
}

export default BlogDeleteButton;
