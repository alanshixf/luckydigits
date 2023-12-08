import * as React from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import AppBar from "@mui/material/AppBar";
import CssBaseline from "@mui/material/CssBaseline";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import MailIcon from "@mui/icons-material/Mail";
import { Avatar, Button, Container, Link, Paper } from "@mui/material";
import prisma from "@/lib/db/prisma";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export async function getProfile(userId: string) {
  try {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    return user;
  } catch (error) {
    throw new Error("Something went wrong!");
  }
}
export default async function ProfilePage() {
  // const session = await getServerSession();
  // if (!session) {
  //   redirect("/api/auth/signin?callbackUrl=/profile");
  // }

  // const user = getProfile(session.user.id);
  return (
    <Box sx={{ width: "100%", maxWidth: 600, margin: "20px auto" }}>
      <Avatar src="https://picsum.photos/200/300?image=10" />
      <Button variant="outlined" sx={{ color: "primary" }}>
        Edit Avatar Pic
      </Button>
      <Typography variant="h4" sx={{ margin: "20px 0" }}>
        John Doe
      </Typography>
      <Button variant="outlined" sx={{ color: "primary" }}>
        Edit Title
      </Button>
      <Typography variant="subtitle1" sx={{ margin: "10px 0" }}>
        Software Engineer
      </Typography>
      <Button variant="outlined" sx={{ color: "primary" }}>
        Edit About Me
      </Button>
      <Box sx={{ marginTop: "20px" }}>
        <Typography variant="body1" sx={{ fontWeight: "bold" }}>
          About Me
        </Typography>
        <Typography variant="body2" sx={{ margin: "10px 0" }}>
          John Doe is a software engineer with 5 years of experience. He is
          passionate about building innovative software solutions. He is also an
          avid traveler and loves to explore new cultures.
        </Typography>
      </Box>
      <Button variant="outlined" sx={{ color: "primary" }}>
        Edit Skills
      </Button>
      <Box sx={{ marginTop: "20px" }}>
        <Typography variant="body1" sx={{ fontWeight: "bold" }}>
          Skills
        </Typography>
        <ul>
          <li>Frontend Development</li>
          <li>Backend Development</li>
          <li>Databases</li>
          <li>Testing</li>
          <li>DevOps</li>
        </ul>
      </Box>
      <Button variant="outlined" sx={{ color: "primary" }}>
        Edit Contact Info
      </Button>
      <Box sx={{ marginTop: "20px" }}>
        <Typography variant="body1" sx={{ fontWeight: "bold" }}>
          Contact Me
        </Typography>
        <Link
          href="mailto:johndoe@example.com"
          className="MuiLink-root MuiLink-underlineNone MuiLink-noUnderline"
        >
          <Typography variant="body2" sx={{ marginLeft: 10 }}>
            johndoe@example.com
          </Typography>
        </Link>
      </Box>
    </Box>
  );
}
