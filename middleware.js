import { NextResponse } from "next/server";

export function middleware(req) {
  const loggedIn = req.cookies.get("loggedIn"); // أو إذا تستعمل localStorage، حولها لـ cookies
  const url = req.nextUrl.clone();

  // الصفحات اللي ما تحتاج حماية
  if (url.pathname.startsWith("/login")) {
    return NextResponse.next();
  }

  // أي صفحة ثانية → لازم login
  if (!loggedIn) {
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

// حدد المسارات اللي يشتغل عليها
export const config = {
  matcher: ["/((?!_next|api|favicon.ico).*)"],
};
