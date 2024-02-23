import { NextRequest, NextResponse } from "next/server";
import AuthService from "./modules/auth/auth-service";

export const config = {
  matcher: "/((?!_next/static|_next/image|favicon.ico).*)",
};

const publicRoutes = [
  "/",
  "/logo.svg",
  "/login",
  "/api/users/login",
  "/api/users/signup",
];

export async function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;
  if (publicRoutes.includes(pathname)) {
    return NextResponse.next();
  }
  const session = await AuthService.isSessionValid();
  if (!session) {
    const isAPIRoute = pathname.startsWith("/api");
    if (isAPIRoute) {
      return NextResponse.json({ message: "Não autorizado" }, { status: 401 });
    }

    return NextResponse.redirect(new URL("login", req.url));
  }
  return NextResponse.next();
}