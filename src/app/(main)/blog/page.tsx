import BlogPublicList from "@/components/blog/blogPublicList";
import { getNewBlogWithPage } from "@/lib/blog/blogPublicProcess";
import { LIMITS } from "@/lib/consts";
import prisma from "@/lib/db/prisma";
import getServerSession from "@/lib/getServerSeesion";
import { Box } from "@mui/material";
import React from "react";

async function setLastRefreshed(userId: string, lastRefreshed: Date) {
  await prisma.user.update({
    where: { id: userId },
    data: { lastRefreshed: lastRefreshed },
  });
}
async function BlogListPage() {
  const session = await getServerSession();
  const user = session?.user;
  let lastRefreshed = new Date();
  let toShowBlogList: BlogListItemWithUser[] = [];
  if (user) {
    const firsttime = Date.now();
    await setLastRefreshed(user.id, lastRefreshed);
    toShowBlogList = await getNewBlogWithPage(
      1,
      LIMITS,
      {
        updatedAt: { lt: lastRefreshed },
      },
      user.id,
    );
    const secondtime = Date.now();
    console.log("listTime: " + (secondtime - firsttime));
  } else {
    toShowBlogList = await getNewBlogWithPage(1, LIMITS, {
      updatedAt: { lt: lastRefreshed },
    });
  }
  return (
    <Box
      sx={{
        padding: 2,
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <BlogPublicList
        initData={toShowBlogList}
        lastRefreshed={lastRefreshed}
        session={session}
      ></BlogPublicList>
    </Box>
  );
}

export default BlogListPage;
