import { authOptions } from "@/lib/auth-options";
import prisma from "@/lib/db/prisma";
import { env } from "@/lib/env";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";
import { NextAuthOptions } from "next-auth";
import { Adapter } from "next-auth/adapters";
import NextAuth from "next-auth/next";
import GoogleProvider from "next-auth/providers/google";
import { signIn } from "next-auth/react";

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
