import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const dashboardAccess = request.cookies.get("dashboard_access");

  if (dashboardAccess?.value !== "granted") {
    return NextResponse.redirect(
      new URL("/login", request.url)
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard"],
};