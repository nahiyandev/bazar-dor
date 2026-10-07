import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // better-auth এর সেশন টোকেন ডিটেকশন
  const sessionToken =
    request.cookies.get("better-auth.session_token")?.value ||
    request.cookies.get("__Secure-better-auth.session_token")?.value ||
    request.cookies.get("token")?.value ||
    request.cookies.get("session")?.value;

  const isProtected =
    pathname.startsWith("/products/") ||
    pathname.startsWith("/product/") ||
    pathname.startsWith("/profile");

  if (isProtected && !sessionToken) {
    const redirectUrl = new URL("/signin", request.url);
    redirectUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(redirectUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/products/:path*", "/product/:path*", "/profile/:path*"],
};