// middleware.ts
import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const response = NextResponse.next({
    request: {
      headers: request.headers,
    },
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
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value);
            response.cookies.set(name, value, options);
          });
        },
      },
    },
  );

  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  if (authError) {
    console.error("[Middleware] Auth error:", authError.message);
  }

  const pathname = request.nextUrl.pathname;
  const isAuthRoute = pathname === "/login" || pathname === "/sign-up";
  const isAdminRoute = pathname.startsWith("/dashboard-admin");
  const isPublicRoute =
    pathname === "/" ||
    pathname === "/subscription" ||
    pathname.startsWith("/api");

  let userRole: string = "user";

  if (user) {
    if (user.user_metadata?.role) {
      userRole = user.user_metadata.role;
    } else {
      try {
        const { data: userData, error: dbError } = await supabaseAdmin
          .from("User")
          .select("role")
          .eq("id", user.id)
          .maybeSingle();

        if (dbError) {
          console.error("[Middleware] Database error:", dbError.message);
          if (dbError.code === "PGRST116") {
            console.log("[Middleware] Creating new user in database...");
            const { data: newUser, error: createError } = await supabaseAdmin
              .from("User")
              .insert({
                id: user.id,
                email: user.email!,
                fullName:
                  user.user_metadata?.fullName || user.email!.split("@")[0],
                role: "user",
              })
              .select("role")
              .single();

            if (createError) {
              console.error(
                "[Middleware] Failed to create user:",
                createError.message,
              );
            } else {
              userRole = newUser?.role || "user";
              console.log("[Middleware] New user created with role:", userRole);
            }
          }
        } else if (userData) {
          userRole = userData.role || "user";
        }
      } catch (error) {
        console.error("[Middleware] Unexpected error fetching role:", error);
      }
    }

    const adminEmails = ["ananbarun7@gmail.com"];
    if (user.email && adminEmails.includes(user.email)) {
      userRole = "admin";
      console.log("[Middleware] Admin role assigned via email check");
    }
    console.log(`[Middleware] User role determined: ${userRole}`);
  }

  if (isAdminRoute) {
    console.log("[Middleware] Checking admin route access...");

    if (!user || userRole !== "admin") {
      console.log("[Middleware] Admin access denied - redirecting to homepage");
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  if (isAuthRoute && user) {
    console.log(
      "[Middleware] Redirecting authenticated user from auth page to home",
    );
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (!user && !isAuthRoute && !isPublicRoute) {
    console.log("[Middleware] Redirecting unauthenticated user to login");
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
