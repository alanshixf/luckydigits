import { redirect } from "next/navigation";
import { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  // Call our authentication function to check the request
  const cookies = request.cookies;
  const sessionToken = cookies.get("next-auth.session-token");
  if (!sessionToken) {
    const callbackUrl = request.nextUrl.pathname;
    NextResponse.rewrite(
      new URL("/api/auth/signin/?callbackUrl=" + callbackUrl, request.url),
    );
  }
}

export const config = {
  matcher: ["/management/:path*"],
};
