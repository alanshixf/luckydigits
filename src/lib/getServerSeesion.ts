import "server-only";
import { NextAuthOptions, getServerSession as getAuthSession } from "next-auth";
import { cache } from "react";
import { authOptions } from "./auth-options";

const getServerSession = cache(async () => {
  return await getAuthSession(authOptions);
});

export default getServerSession;
