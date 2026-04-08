import { NextResponse } from "next/server";
import {
  AUTH_TOKEN_COOKIE,
  applyAuthCookies,
  clearAuthCookies,
  fetchSessionFromToken,
} from "@/lib/authSession";

export async function POST(request) {
  const token = request.cookies.get(AUTH_TOKEN_COOKIE)?.value;
  const session = await fetchSessionFromToken(token);

  if (!session.success) {
    return clearAuthCookies(
      NextResponse.json(
        {
          success: false,
          message: session.message,
        },
        { status: session.status },
      ),
    );
  }

  const response = NextResponse.json({
    success: true,
    data: {
      role: session.user.role,
    },
  });

  return applyAuthCookies(response, {
    token,
    role: session.user.role,
  });
}
