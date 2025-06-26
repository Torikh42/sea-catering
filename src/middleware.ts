import { createServerClient } from "@supabase/ssr";

import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|api|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  const isAuthRoute =
    request.nextUrl.pathname === "/login" ||
    request.nextUrl.pathname === "/sign-up";

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (isAuthRoute && user) {
    // Jika user sudah login dan akses halaman login/sign-up, redirect ke /
    return NextResponse.redirect(
      new URL("/", process.env.NEXT_PUBLIC_BASE_URL),
    );
  }

  // (Opsional) Jika user belum login dan akses halaman lain, redirect ke /login
  if (!isAuthRoute && !user && request.nextUrl.pathname !== "/subscribe") {
    // Tambahkan kondisi untuk halaman subscribe agar bisa diakses tanpa login
    return NextResponse.redirect(
      new URL("/login", process.env.NEXT_PUBLIC_BASE_URL),
    );
  }

  return supabaseResponse;
}
