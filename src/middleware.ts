// middleware.ts
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest, response: NextResponse) {
  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {};
