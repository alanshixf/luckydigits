import * as React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import prisma from "@/lib/db/prisma";
import { redirect } from "next/navigation";
import EditableAvatar from "@/components/profile/editableAvatar";
import { Metadata } from "next";
import EditableUsername from "@/components/profile/editableUsername";
import EditableUserTitle from "@/components/profile/editableUserTitle";
import EditableAboutMe from "@/components/profile/editableAboutMe";
import getServerSession from "@/lib/getServerSeesion";

export const metadata: Metadata = {
  metadataBase: new URL("https://luckydigits.life"),
  title: "Profile Settings -- LKC",
  description: "Profile description and settings",
};

async function getProfile(userId: string) {
  try {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new Error("Something went wrong!");
    }
    return user;
  } catch (error) {
    throw new Error("Something went wrong!");
  }
}
export default async function ProfilePage() {
  const session = await getServerSession();
  if (!session) {
    redirect("/api/auth/signin?callbackUrl=/management/profile");
  }

  const user = await getProfile(session.user.id);

  return (
    <React.Fragment>
      <Box
        sx={{
          margin: "20px",
        }}
      >
        <Box ml="20px" mt="50px">
          <EditableAvatar user={user} />
        </Box>

        <Typography variant="h6" mt="30px" fontWeight={400}>
          Email
        </Typography>
        <Typography variant="body1" mt="10px" ml="20px">
          {user.email}
        </Typography>

        <Typography variant="h6" mt="30px" fontWeight={400}>
          Name
        </Typography>
        <Box mt="10px" ml="20px">
          <EditableUsername user={user} />
        </Box>

        <Typography variant="h6" mt="30px" fontWeight={400}>
          Title
        </Typography>
        <Box mt="10px" ml="20px">
          <EditableUserTitle user={user} />
        </Box>

        <Typography variant="h6" mt="30px" fontWeight={400}>
          About Me
        </Typography>
        <Box mt="10px" ml="20px">
          <EditableAboutMe user={user} />
        </Box>

        <Typography variant="body1" mt="10px" ml="20px"></Typography>
      </Box>
    </React.Fragment>
  );
}
