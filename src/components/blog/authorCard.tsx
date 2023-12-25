"use client";
import { stringAvatar } from "@/lib/utils/stringAvatar";
import {
  Avatar,
  Box,
  Button,
  Chip,
  IconButton,
  MenuItem,
  Popover,
  Tooltip,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import BookSharpIcon from "@mui/icons-material/BookSharp";
import NotesIcon from "@mui/icons-material/Notes";
import formatNumber from "@/lib/utils/formatNumber";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import { NULL_OBJECT_ID } from "@/lib/consts";
import { usePathname, useRouter } from "next/navigation";
import { setFollowedOrNot } from "@/lib/user/userAction";
import { RiUserFollowFill, RiUserUnfollowFill } from "react-icons/ri";
interface AuthorCardProps {
  author: Author;
  isLogined: boolean;
}

function AuthorCard({ author, isLogined }: AuthorCardProps) {
  const [followers, setFollowers] = useState(author._count?.followings ?? 0);
  const [isFollowed, setIsFollowed] = useState(author.isFollowed ?? false);
  const pathName = usePathname();
  const router = useRouter();

  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null,
  );

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  const handleClickFollow = async () => {
    if (!isLogined) {
      router.push("/api/author/signin?callbackUrl=" + pathName);
      return;
    }

    const oldFollowers = followers;
    const oldIsFollowed = isFollowed;
    if (isFollowed) {
      setFollowers((preValue) => preValue - 1);
    } else {
      setFollowers((preValue) => preValue + 1);
    }
    setIsFollowed((preValue) => !preValue);
    try {
      await setFollowedOrNot(author.id, !oldIsFollowed);
    } catch (err: any) {
      setFollowers(oldFollowers);
      setIsFollowed(oldIsFollowed);
      if (err.message === "authentication failed") {
        router.push("/api/author/signin?callbackUrl=" + pathName);
        return;
      }
    }
  };
  return (
    <Box sx={{ display: "flex", flexDirection: "column" }}>
      <Box sx={{ display: "flex", flexDirection: "row" }}>
        {author.image !== null && author.image !== "" ? (
          <Avatar
            alt={author.name as string}
            src={author.image as string}
            sx={{
              height: { xs: 40, sm: 60 },
              width: { xs: 40, sm: 60 },
            }}
          />
        ) : (
          <Avatar {...stringAvatar(author.name ?? "NaN", 40)} />
        )}
        <Box ml={1} my={"auto"}>
          <Typography variant="body1">{author.name}</Typography>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            {author.title}
          </Typography>
        </Box>
      </Box>

      <Box
        sx={{
          my: 1,
          display: "flex",
          flexDirection: "row",
          gap: 2,
          fontSize: "16px",
          color: "text.secondary",
          alignItems: "center",
        }}
      >
        <Tooltip
          title={"posts: " + author._count?.blogs ?? 0}
          arrow
          placement="top-start"
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              gap: 0.5,
            }}
          >
            <BookSharpIcon fontSize="inherit" />
            <Typography fontSize={"12px"}>
              {formatNumber(author._count?.blogs ?? 0)}
            </Typography>
          </Box>
        </Tooltip>
        <Tooltip
          title={"comments: " + author._count?.Comments ?? 0}
          arrow
          placement="top-start"
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              gap: 0.5,
            }}
          >
            <NotesIcon fontSize="inherit" />
            <Typography fontSize={"12px"}>
              {formatNumber(author._count?.Comments ?? 0)}
            </Typography>
          </Box>
        </Tooltip>
        <Tooltip title={"followers: " + followers} arrow placement="top-start">
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              gap: 0.5,
            }}
          >
            <PeopleAltIcon fontSize="inherit" />
            <Typography fontSize={"12px"}>{formatNumber(followers)}</Typography>
          </Box>
        </Tooltip>
        {isFollowed ? (
          <Tooltip title={"Unfollow"} arrow placement="top-start">
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                gap: 0.5,
              }}
            >
              <IconButton
                aria-describedby={id}
                onClick={handleClick}
                sx={{ fontSize: "14px", padding: "4px" }}
              >
                <RiUserFollowFill />
              </IconButton>
              <Popover
                id={id}
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "center",
                }}
                transformOrigin={{
                  vertical: "top",
                  horizontal: "left",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    gap: 0.5,
                    cursor: "pointer",
                  }}
                  component={MenuItem}
                  onClick={() => {
                    handleClose();
                    handleClickFollow();
                  }}
                >
                  <RiUserUnfollowFill />{" "}
                  <Typography sx={{ fontSize: "10px" }}>
                    Unfollow @{author.name}
                  </Typography>
                </Box>
              </Popover>
            </Box>
          </Tooltip>
        ) : (
          <Chip
            label="Follow"
            onClick={handleClickFollow}
            sx={{ fontSize: "12px", height: "18px" }}
          />
        )}
      </Box>
    </Box>
  );
}

export default AuthorCard;
