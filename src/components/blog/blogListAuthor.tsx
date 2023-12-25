import { getFormattedDateWithShortMonth } from "@/lib/utils/getFormattedDate";
import { stringAvatar } from "@/lib/utils/stringAvatar";
import { Avatar, Box, Typography } from "@mui/material";
import { Session } from "next-auth";
import React from "react";

interface BlogListAuthorProps {
  blog: BlogListItemWithUser;
  session: Session | null;
}
function BlogListAuthor({ blog, session }: BlogListAuthorProps) {
  return (
    <Box sx={{ display: "flex", flexDirection: "row", mb: 2, mr: 4 }}>
      {blog.user.image !== null && blog.user.image !== "" ? (
        <Avatar
          alt={blog.user.name as string}
          src={blog.user.image as string}
          sx={{
            height: { xs: 40, sm: 60 },
            width: { xs: 40, sm: 60 },
          }}
        />
      ) : (
        <Avatar {...stringAvatar(blog.user.name ?? "NaN", 40)} />
      )}
      <Box ml={1}>
        <Typography variant="body1">{blog.user.name}</Typography>
        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          {blog.user.title}
        </Typography>
      </Box>
      <Box sx={{ flexGrow: 1 }}>
        <Typography variant="body2" textAlign={"end"}>
          {getFormattedDateWithShortMonth(
            blog.publishedDate ? blog.publishedDate.toISOString() : "",
          )}
        </Typography>
      </Box>
    </Box>
  );
}

export default React.memo(BlogListAuthor);
