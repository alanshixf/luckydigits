"use client";
import {
  Avatar,
  Box,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Tooltip,
  Typography,
} from "@mui/material";
import React from "react";

function NavMenu() {
  const pages = ["Products", "Pricing", "Blog"];

  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(
    null,
  );

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  return (
    <Box sx={{ display: "flex" }}>
      {pages.map((page) => (
        <Button key={page} sx={{ my: 2, color: "white", display: "block" }}>
          {page}
        </Button>
      ))}
    </Box>
  );
}

export default NavMenu;
