import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const sessionToken =
    request.cookies.get("better-auth.session_token")?.value ||
    request.cookies.get("__Secure-better-auth.session_token")?.value;

  const { pathname } = request.nextUrl;

  // ১. প্রোটেক্টেড রাউট গার্ড: লগইন না থাকলে /signin-এ রিডাইরেক্ট করবে
  // (প্রোফাইল পেজ এবং সব প্রোডাক্ট ডিটেইলস পেজ প্রোটেক্টেড)
  const isProtectedPath =
    pathname.startsWith("/profile") || pathname.startsWith("/products");

  if (isProtectedPath && !sessionToken) {
    // লগইন করার পর যাতে সরাসরি ওই পেজেই ফিরতে পারে সেজন্য callbackUrl রাখা হয়েছে
    const signInUrl = new URL("/signin", request.url);
    signInUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(signInUrl);
  }

  // ২. ইউজার ইতোমধ্যে লগইন থাকলে সাইন ইন বা সাইন আপ পেজে ঢুকতে দেবে না
  if ((pathname === "/signin" || pathname === "/signup") && sessionToken) {
    return NextResponse.redirect(new URL("/profile", request.url));
  }

  return NextResponse.next();
}

// ডিফল্ট এক্সপোর্ট
export default middleware;

// যেসব পাথে মিডলওয়্যার রান হবে
export const config = {
  matcher: ["/profile/:path*", "/products/:path*", "/signin", "/signup"],
};