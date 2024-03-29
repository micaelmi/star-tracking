import { NextRequest, NextResponse } from "next/server";
import AuthService from "./modules/auth/auth-service";
import { cookies } from "next/headers";
import api from "./lib/axios";

export const config = {
  matcher: "/((?!_next/static|_next/image|favicon.ico).*)",
};

const publicRoutes = [
  "/",
  "/logo.svg",
  "/login",
  "/api/users/login",
  "/api/users/logout",
  "/api/users/signup",
];

export async function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;

  const sessionCookie = cookies().get("session");
  if (pathname === "/login" && sessionCookie) {
    return NextResponse.redirect(new URL("api/logout", req.url));
  }

  if (publicRoutes.includes(pathname)) {
    return NextResponse.next();
  }
  const session = await AuthService.isSessionValid();
  if (!session) {
    const isAPIRoute = pathname.startsWith("/api");
    if (isAPIRoute) {
      // return NextResponse.next();
      return NextResponse.json({ message: "Não autorizado" }, { status: 401 });
    }
    return NextResponse.redirect(new URL("login", req.url));
  }
  const isAdminRoute = pathname.startsWith("/usuarios");
  if (isAdminRoute) {
    const user = await AuthService.getPayload();
    if (user) {
      if (user.type === "ADMIN") {
        return NextResponse.next();
      }
      return NextResponse.redirect(new URL("painel", req.url));
    }
  }

  return NextResponse.next();
}
