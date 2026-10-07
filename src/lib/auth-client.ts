import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  // নিশ্চিত করুন baseURL শুধুমাত্র ডোমেইন অরিজিন নিচ্ছে (কোনো রাউট পাথ ছাড়া)
  baseURL:
    process.env.NEXT_PUBLIC_APP_URL ||
    (typeof window !== "undefined" ? window.location.origin : "http://localhost:3000"),
});

export const { signIn, signUp, signOut, useSession } = authClient;