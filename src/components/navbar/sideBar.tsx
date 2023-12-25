"use client";
import * as React from "react";
import { styled, Theme, CSSObject } from "@mui/material/styles";
import MuiDrawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import BookSharpIcon from "@mui/icons-material/BookSharp";
import { Roboto } from "next/font/google";

const roboto = Roboto({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});
const drawerWidth = 240;

const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerWidth,
  position: "fixed",
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
  zIndex: 100,
  top: "128px",
  left: "0px",

  [theme.breakpoints.down("sm")]: {
    width: `calc(${theme.spacing(7)} + 1px)`,
    top: "80px",
  },

  [theme.breakpoints.up(1600)]: {
    left: `calc((100% - 1600px) / 2)`,
  },
});

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",

  ...openedMixin(theme),
  "& .MuiDrawer-paper": openedMixin(theme),
}));

export default function SideBar() {
  const [open, setOpen] = React.useState(true);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const menuItems = [
    {
      name: "Profile",
      icon: <ManageAccountsIcon />,
      url: "/management/profile",
    },
    { name: "My Blogs", icon: <BookSharpIcon />, url: "/management/blog" },
  ];

  return (
    <Drawer variant="permanent" open={open}>
      <Divider />
      <List>
        {menuItems.map((item) => (
          <ListItem
            key={item.name}
            disablePadding
            sx={{ display: "block", mx: 0 }}
          >
            <ListItemButton
              sx={{
                minHeight: 48,
                justifyContent: { sm: "initial", xs: "center" },
                px: 1,
              }}
              href={item.url}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  justifyContent: "center",
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.name}
                sx={{
                  "& .MuiTypography-root": {
                    fontFamily: roboto.style.fontFamily,
                  },

                  opacity: { sm: 1, xs: 0 },
                  display: { xs: "none", sm: "block" },
                  pl: 1,
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      {/* <List>
          {["All mail", "Trash", "Spam"].map((text, index) => (
            <ListItem key={text} disablePadding sx={{ display: "block" }}>
              <ListItemButton
                sx={{
                  minHeight: 48,
                  justifyContent: { sm: "initial", xs: "center" },
                  px: 1,
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    justifyContent: "center",
                  }}
                >
                  {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
                </ListItemIcon>
                <ListItemText
                  primary={text}
                  sx={{
                    opacity: { sm: 1, xs: 0 },
                    display: { xs: "none", sm: "block" },
                  }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List> */}
    </Drawer>
  );
}
