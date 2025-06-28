"use server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createClient() {
  const cookieStore = await cookies();

  const client = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {}
        },
      },
    },
  );

  return client;
}

export async function getUser() {
  const { auth } = await createClient();
  const {
    data: { user },
    error,
  } = await auth.getUser();

  if (error || !user) {
    console.error(error);
    return null;
  }

  const userRole = user.user_metadata?.role || "user";

  const userName = user.user_metadata?.fullName;

  console.log("[Auth Server] User metadata:", user.user_metadata);

  console.log("[Auth Server] Final user role from metadata:", userRole);
  console.log("[Auth Server] User email:", user.email);

  return {
    id: user.id,
    email: user.email,
    name: userName,
    role: userRole,
  };
}
