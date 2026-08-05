import { NextResponse, type NextRequest } from "next/server";

// 後台與含客戶個資的 API 都要密碼，客戶端的預約流程（slots / create）維持公開。
export const config = {
  matcher: [
    "/admin/:path*",
    "/api/appointments/:path*",
    "/api/appointment/preview"
  ]
};

const REALM = 'Basic realm="Admin", charset="UTF-8"';

function unauthorized(message: string) {
  return new NextResponse(message, {
    status: 401,
    headers: {
      "WWW-Authenticate": REALM,
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store"
    }
  });
}

// 長度固定的比對，避免用字串 === 造成的時間差判讀。
function safeEqual(a: string, b: string) {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i += 1) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return diff === 0;
}

export function middleware(request: NextRequest) {
  const expectedUser = process.env.ADMIN_USER || "admin";
  const expectedPassword = process.env.ADMIN_PASSWORD;

  // 沒設定密碼就一律擋下，避免部署後忘了設而整個後台裸奔。
  if (!expectedPassword) {
    return new NextResponse(
      "後台尚未設定密碼。請在環境變數設定 ADMIN_PASSWORD 後再開啟。",
      { status: 503, headers: { "Content-Type": "text/plain; charset=utf-8" } }
    );
  }

  const header = request.headers.get("authorization") || "";
  if (!header.startsWith("Basic ")) {
    return unauthorized("需要帳號密碼才能進入後台。");
  }

  let decoded = "";
  try {
    decoded = atob(header.slice(6));
  } catch {
    return unauthorized("授權格式錯誤。");
  }

  const separator = decoded.indexOf(":");
  const user = separator === -1 ? decoded : decoded.slice(0, separator);
  const password = separator === -1 ? "" : decoded.slice(separator + 1);

  if (!safeEqual(user, expectedUser) || !safeEqual(password, expectedPassword)) {
    return unauthorized("帳號或密碼錯誤。");
  }

  return NextResponse.next();
}
