import {jwtDecode} from "jwt-decode";
import {NextRequest, NextResponse} from "next/server";

const scarTechURL =
  process.env.NODE_ENV === "production"
    ? "https://scar-tech.site"
    : "http://127.0.0.1:8000";

export enum ROLE {
  SCHEDULER = "scheduler",
  USER = "user",
}

type DecodedToken = {
  token_type: string;
  exp: number;
  iat: number;
  jti: string;
  user_id: number;
  role: ROLE;
  username: string;
  editable: boolean;
};

export const Auth = {
  decodeToken(token: string): DecodedToken | null {
    try {
      if (!token) return null;
      return jwtDecode<DecodedToken>(token);
    } catch (err) {
      console.error("Failed to decode token", err);
      return null;
    }
  },

  getAuthRole(token: string): ROLE | null {
    const decoded = this.decodeToken(token);
    return decoded?.role ?? null;
  },

  isTokenExpired(token: string): boolean {
    const decoded = this.decodeToken(token);
    if (!decoded?.exp) return true;
    return decoded.exp < Math.floor(Date.now() / 1000);
  },
};

export function middleware(request: NextRequest) {
  const {pathname} = request.nextUrl;
  const token = request.cookies.get("access_token")?.value;

  console.log("🔐 MIDDLEWARE TRIGGERED:", pathname);

  const isUserAvailable = ["/situation"].includes(pathname);
  const isSchedulerAvailable = ["/situation", "/scheduler", "/week"].includes(
    pathname
  );

  if (!token) {
    console.log("🔒 No token — redirecting to login page");
    return NextResponse.redirect(new URL(`${scarTechURL}/login`, request.url));
  }

  const decoded = Auth.decodeToken(token);
  const role = decoded?.role;
  console.log(`🔓 Authenticated! ${role}`);

  switch (role) {
    case ROLE.SCHEDULER:
      console.log("SCHEDULER!");
      if (!isSchedulerAvailable) {
        return NextResponse.redirect(new URL("/scheduler", request.url));
      }
      break;
    case ROLE.USER:
      console.log("USER!");
      if (!isUserAvailable) {
        return NextResponse.redirect(new URL("/situation", request.url));
      }
      break;
  }
}

export const config = {
  matcher: [
    // Match all pages under the root except specific folders
    "/((?!_next/|favicon.ico|robots.txt|images/|fonts/|api/).*)",
  ],
};
