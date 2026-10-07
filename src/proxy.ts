import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
  const sessionToken =
    request.cookies.get("better-auth.session_token")?.value ||
    request.cookies.get("__Secure-better-auth.session_token")?.value;

  const { pathname } = request.nextUrl;

  // প্রোটেক্টেড রাউট গার্ড
  if (pathname.startsWith("/profile") && !sessionToken) {
    return NextResponse.redirect(new URL("/signin", request.url));
  }

  // ইউজার লগইন থাকলে সাইন ইন বা সাইন আপ পেজে ঢুকতে দেবে না
  if ((pathname === "/signin" || pathname === "/signup") && sessionToken) {
    return NextResponse.redirect(new URL("/profile", request.url));
  }

  return NextResponse.next();
}

// সেফটির জন্য ডিফল্ট এক্সপোর্টও যুক্ত করে দিন
export default proxy;

export const config = {
  matcher: ["/profile/:path*", "/signin", "/signup"],
};