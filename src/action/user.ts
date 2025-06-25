"use server";
import { createClient } from "@/auth/server";
import { prisma } from "../../prisma/prisma";
import { handleError } from "@/lib/utils";

export const loginAction = async (email: string, password: string) => {
  try {
    const { auth } = await createClient();
    const { error } = await auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    return { errorMessage: null };
  } catch (error) {
    return handleError(error);
  }
};

export const signUpAction = async (
  email: string,
  password: string,
  fullName: string,
) => {
  try {
    const { auth } = await createClient();

    // Pastikan URL ini sudah benar dan terdaftar di dashboard Supabase
    const emailRedirectTo = process.env.NEXT_PUBLIC_SUPABASE_CONFIRM_URL || `${process.env.NEXT_PUBLIC_SITE_URL}/auth/confirm`;

    const { data, error } = await auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: emailRedirectTo,
      },
    });

    if (error) {
      console.error("Supabase signUp error:", error.message);
      return { errorMessage: error.message, requiresEmailConfirmation: false }; 
    }

    const userId = data.user?.id;
    if (!userId) {
      console.error("Supabase signUp successful but user ID is missing.");
      return { errorMessage: "Terjadi kesalahan saat mendaftar: ID pengguna hilang.", requiresEmailConfirmation: false };
    }
    await prisma.user.create({
      data: {
        id: userId,
        email,
        fullName,

      },
    });

    const requiresEmailConfirmation = !data.session; 

    return { errorMessage: null, requiresEmailConfirmation }; 
  } catch (error) {
    const handledError = handleError(error);
    return { errorMessage: handledError.errorMessage, requiresEmailConfirmation: false };
  }
};


export const logoutAction = async () => {
  try {
    const { auth } = await createClient();
    const { error } = await auth.signOut();
    if (error) throw error;
    return { errorMessage: null };
  } catch (error) {
    return handleError(error);
  }
};
