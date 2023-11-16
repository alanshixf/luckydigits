import { PrismaAdapter } from "@auth/prisma-adapter";
import { NextAuthOptions } from "next-auth";
import prisma from "./db/prisma";
import { PrismaClient } from "@prisma/client";
import { Adapter } from "next-auth/adapters";
import { env } from "./env";
import GoogleProvider from "next-auth/providers/google";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma as PrismaClient) as Adapter,
  providers: [
    GoogleProvider({
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  // callbacks: {
  //   session({session, user}) {
  //     session.user.id = user.id
  //   },
  // },
};
