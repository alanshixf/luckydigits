"use client";

import {
  Avatar,
  Box,
  Button,
  Divider,
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
  Paper,
  Tooltip,
  Typography,
} from "@mui/material";
import { Session } from "next-auth";
import { signOut } from "next-auth/react";
import React from "react";
import Settings from "@mui/icons-material/Settings";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import PostAddIcon from "@mui/icons-material/PostAdd";
import Logout from "@mui/icons-material/Logout";
import { grey } from "@mui/material/colors";
import ThemeSwitch from "./themeSwitch";
import { useRouter } from "next/navigation";
import { stringAvatar } from "@/lib/utils/stringAvatar";
import BookSharpIcon from "@mui/icons-material/BookSharp";
interface UserMenuProps {
  session: Session | null;
}

const MENU_ITEM_PROFILE = "Profile";
const MENU_ITEM_LOGOUT = "Logout";
const MENU_ITEM_NEW_BLOG = "New Blog";
const MENU_ITEM_MY_BLOG = "My Blog";
const UserMenu = ({ session }: UserMenuProps) => {
  const user = session?.user;
  const router = useRouter();
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(
    null,
  );

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };
  const handleCloseUserMenu = (e: any) => {
    setAnchorElUser(null);
    switch (e.target.id) {
      case MENU_ITEM_PROFILE:
        router.push("/management/profile");
        break;
      case MENU_ITEM_NEW_BLOG:
        router.push("/management/blog/new");
        break;
      case MENU_ITEM_MY_BLOG:
        router.push("/management/blog");
        break;
      case MENU_ITEM_LOGOUT:
        signOut({ callbackUrl: "/" });
        break;
    }
  };
  return (
    <div>
      <Tooltip title="Open settings">
        <IconButton
          onClick={handleOpenUserMenu}
          sx={{ p: 0 }}
          id="positioned-button"
          aria-controls={anchorElUser ? "menu-appbar" : undefined}
          aria-haspopup="true"
          aria-expanded={anchorElUser ? "true" : undefined}
        >
          {/* <Avatar
            alt={user?.name ? user.name : ""}
            src={user?.image ? user.image : ""}
          /> */}
          {session?.user.image !== null && session?.user.image !== "" ? (
            <Avatar
              alt={session?.user.name as string}
              src={session?.user.image as string}
            />
          ) : (
            <Avatar {...stringAvatar(session?.user.name ?? "NaN", 40)} />
          )}
        </IconButton>
      </Tooltip>
      <Menu
        id="menu-appbar"
        aria-labelledby="positioned-button"
        anchorEl={anchorElUser}
        sx={{
          mt: "-20px",
          "& .MuiList-root": {
            pt: 0,
          },
        }}
        anchorOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        keepMounted
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: "visible",
            filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
            pt: 0,
            "& .MuiAvatar-root": {
              width: 60,
              height: 60,
            },
            // "&:before": {
            //   content: '""',
            //   display: "block",
            //   position: "absolute",
            //   top: 0,
            //   right: 14,
            //   width: 10,
            //   height: 10,
            //   bgcolor: "background.paper",
            //   transform: "translateY(-50%) rotate(45deg)",
            //   zIndex: 0,
            // },
          },
        }}
        open={Boolean(anchorElUser)}
        onClose={handleCloseUserMenu}
      >
        <Paper sx={{ m: "auto", p: 2, minWidth: 225, borderRadius: 0 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              mb: 2,
            }}
          >
            {session?.user.image !== null && session?.user.image !== "" ? (
              <Avatar
                alt={session?.user.name as string}
                src={session?.user.image as string}
              />
            ) : (
              <Avatar {...stringAvatar(session?.user.name ?? "NaN", 40)} />
            )}
          </Box>
          <Typography align="center">{user?.name}</Typography>
          <Typography align="center" fontSize={"12px"} color={grey[500]}>
            {user?.email}
          </Typography>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
            }}
          >
            <ThemeSwitch />
          </Box>
        </Paper>
        <MenuItem onClick={handleCloseUserMenu} id={MENU_ITEM_PROFILE}>
          <ListItemIcon>
            <ManageAccountsIcon fontSize="small" />
          </ListItemIcon>
          Profile
        </MenuItem>
        <MenuItem onClick={handleCloseUserMenu} id={MENU_ITEM_MY_BLOG}>
          <ListItemIcon>
            <BookSharpIcon fontSize="small" />
          </ListItemIcon>
          My Blog
        </MenuItem>
        <MenuItem onClick={handleCloseUserMenu} id={MENU_ITEM_NEW_BLOG}>
          <ListItemIcon>
            <PostAddIcon fontSize="small" />
          </ListItemIcon>
          New Blog
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleCloseUserMenu} id={MENU_ITEM_LOGOUT}>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
      {/* {user ? (
        <NavbarContent as="div" justify="end">
          <Dropdown placement="bottom-end">
            <DropdownTrigger>
              <Avatar
                isBordered
                // showFallback
                as="button"
                className="transition-transform"
                color="secondary"
                name={user?.name || undefined}
                size="sm"
                src={user?.image || ""}
              />
            </DropdownTrigger>
            <DropdownMenu
              aria-label="Profile Actions"
              variant="flat"
              color="primary"
              className="bg-primary-300 "
            >
              <DropdownItem key="profile" className="gap-2" href="/profile">
                <p className="font-semibold">{user.email}</p>
              </DropdownItem>
              <DropdownItem key="profile" className="gap-2" href="/blog/new">
                <p className="font-semibold">New Blog</p>
              </DropdownItem>

              <DropdownItem
                key="logout"
                color="danger"
                onClick={() => signOut({ callbackUrl: "/" })}
              >
                Log Out
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </NavbarContent>
      ) : (
        <NavbarContent justify="end">
          <NavbarItem>
            <Button
              as={Link}
              color="primary"
              href="/api/auth/signin?callbackUrl=/"
              variant="flat"
            >
              Sign In
            </Button>
          </NavbarItem>
        </NavbarContent>
      )} */}
    </div>
  );
};

export default UserMenu;
