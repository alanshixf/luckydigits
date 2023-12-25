"use client"; // Error components must be Client components

import { useEffect } from "react";
import Link from "next/link";
import { Box, Button, Typography } from "@mui/material";

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <Box
      mx={"auto"}
      minHeight={"100vh"}
      maxWidth={"32rem"}
      bgcolor={"warning"}
      px={"1rem"}
      py={"0.25rem"}
    >
      <Typography variant="h4" my={"1rem"}>
        Something went wrong!
      </Typography>
      <Typography>{error.message}</Typography>
      <Button
        sx={{ bgcolor: "danger", mb: "1rem", p: "1rem" }}
        onClick={
          // Attempt to recover by trying to re-render the segment
          () => reset()
        }
      >
        Try again
      </Button>
      <Typography variant="h6">
        Or go back to{" "}
        <Link href="/" className="underline">
          Home 🏠
        </Link>
      </Typography>
    </Box>
  );
}
