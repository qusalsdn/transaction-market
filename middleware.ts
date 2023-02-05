import { NextRequest, NextFetchEvent, userAgent, NextResponse } from "next/server";

export async function middleware(req: NextRequest, ev: NextFetchEvent) {
  const { pathname } = req.nextUrl;
  if (userAgent(req).isBot) {
    return new Response("제발 봇이 아니었으면 좋겠어요...", { status: 403 });
  }
  // 아래 코드가 없으면 syntaxerror: unexpected token '<' 에러가 발생한다.
  if (pathname.startsWith("/_next")) return NextResponse.next();
  if (!req.url.includes("/api")) {
    if (!req.cookies.has("carrotsession") && !req.url.includes("/enter")) {
      return NextResponse.redirect(new URL("/enter", req.url));
    }
  }
}

export const config = {};
