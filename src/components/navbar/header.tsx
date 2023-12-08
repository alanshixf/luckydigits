"use server";
import React from "react";

import { getServerSession } from "next-auth";
import AppBar from "@mui/material/AppBar";
import { authOptions } from "@/lib/auth-options";
import UserMenu from "./userMenu";
import {
  Box,
  Button,
  Container,
  Link,
  Toolbar,
  Typography,
} from "@mui/material";
import NavMenu from "./navMenu";
import SmallScreenNavMenu from "./smallScreenNavMenu";
import Logo from "./logo";
import { headers } from "next/headers";

const Header = async () => {
  const session = await getServerSession(authOptions);

  return (
    <AppBar
      position="sticky"
      color="secondary"
      sx={{
        margin: "auto",
        height: { xs: "5em", sm: "8em" },
        justifyContent: "center",
        opacity: 0.98,
      }}
    >
      <Container maxWidth={false}>
        <Toolbar>
          <Box sx={{ flexGrow: 0, display: { xs: "flex", sm: "none" } }}>
            <SmallScreenNavMenu />
          </Box>
          <Box
            sx={{
              flexGrow: 0,
              display: "none",
              flexDirection: "column",
              alignItems: "center",
              marginRight: "16px",
            }}
          >
            <Typography
              sx={{
                ml: "8px",
                fontSize: { xs: "1.75rem", sm: "3.75rem" },
                fontWeight: "bold",
                display: { sm: "block" },
              }}
              className="gradient-text"
            >
              76
            </Typography>

            <Typography sx={{ fontSize: "14px", color: "gray" }}>
              {new Date().getUTCFullYear()} weeks: 44
            </Typography>
          </Box>

          <Box
            sx={{
              flexGrow: 1,
              display: { xs: "flex", sm: "none" },
              justifyContent: "center",
            }}
          >
            <Link href="/" color="inherit" underline="none">
              <Logo size={40} />
            </Link>
          </Box>
          <Box
            sx={{
              flexGrow: 1,
              display: { xs: "none", sm: "flex" },
              justifyContent: "left",
              mr: "10px",
            }}
          >
            <Link href="/" color="inherit" underline="none">
              <Logo size={60} />
            </Link>
          </Box>
          <Box
            sx={{
              flexGrow: 1,
              display: { xs: "none", sm: "flex" },
            }}
          >
            <NavMenu />
          </Box>

          <Box sx={{ flexGrow: 0 }}>
            {session?.user ? (
              <UserMenu session={session} />
            ) : (
              <Button
                LinkComponent="a"
                href="/api/auth/signin?callback=/"
                target="_blank"
              >
                <Typography>Sign in</Typography>
              </Button>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
  // return (
  //   <Navbar
  //     isBordered
  //     maxWidth="full"
  //     height={"8rem"}
  //     className="m-auto min-w-[300px] max-w-[1600px]
  //     bg-warning-100"
  //   >
  //     <NavbarContent justify="start">
  //       <div className="flex flex-col items-center">
  //         <span className="gradient-text ml-2 hidden text-6xl font-bold sm:block">
  //           76
  //         </span>
  //         <span className="text-zinc-400">
  //           {new Date().getUTCFullYear()} weeks: 44
  //         </span>
  //       </div>
  //     </NavbarContent>
  //     <NavbarContent justify="center">
  //       <NavbarBrand className="mr-4">
  //         <Link href={"/"} className="isBlock" size="lg">
  //           <Image src={logo} alt="LKC logo" width={60} height={60} />
  //         </Link>
  //       </NavbarBrand>
  //     </NavbarContent>
  //     <NavbarContent justify="end">
  //       <UserMenu session={session} />
  //     </NavbarContent>
  //   </Navbar>
  // );
};

export default Header;
