import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token");
  const isAuthPage = request.nextUrl.pathname === "/";
  const isPublicPage = ["/"].includes(request.nextUrl.pathname);

  // If trying to access auth page while logged in, redirect to dashboard
  // if (isAuthPage && token) {
  //   return NextResponse.redirect(new URL("/dashboard", request.url));
  // }

  // // If trying to access protected page while logged out, redirect to login
  // if (!isPublicPage && !token) {
  //   return NextResponse.redirect(new URL("/", request.url));
  // }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
