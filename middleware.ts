import { NextRequest, NextFetchEvent, userAgent, NextResponse } from "next/server";

export async function middleware(req: NextRequest, ev: NextFetchEvent) {
  const { pathname } = req.nextUrl;
  if (userAgent(req).isBot) {
    return new Response("제발 봇이 아니었으면 좋겠어요...", { status: 403 });
  }
  if (!req.url.includes("/api")) {
    if (!req.cookies.has("carrotsession") && !req.url.includes("/enter")) {
      return NextResponse.redirect(new URL("/enter", req.url));
    }
  }
}

export const config = {
  // api, _next/static, _next/image favicon.ico 경로를 제외한 모든 경로에 미들웨어 적용
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
