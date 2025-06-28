// authForm.tsx
"use client";
import { useRouter } from "next/navigation";
import React, { useTransition } from "react";
import { toast } from "sonner";
import { CardContent, CardFooter } from "./ui/card";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { loginAction, signUpAction } from "@/action/user"; 
import { userSchema } from "@/schema/userSchema";

type Props = {
  type: "login" | "sign up";
};

const AuthForm = ({ type }: Props) => {
  const isLoginForm = type === "login";
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (FormData: FormData) => {
    startTransition(async () => {
      const fullName = FormData.get("fullName") as string;
      const email = FormData.get("email") as string;
      const password = FormData.get("password") as string;

      if (isLoginForm) {
        if (!password) {
          toast.error("Password tidak boleh kosong");
          return;
        }

        const { errorMessage } = await loginAction(email, password); 

        if (!errorMessage) {
          toast.success("Anda berhasil masuk.");
          // >>> TAMBAHKAN INI UNTUK MEMAKSA REVALIDASI DATA SERVER COMPONENTS <<<
          router.refresh(); 
          router.replace("/");
        } else {
          toast.error("Email atau password salah.");
        }
      } else {
        const result = userSchema.safeParse({ fullName, email, password });
        if (!result.success) {
          toast.error(result.error.errors[0].message);
          return;
        }

        const { errorMessage, requiresEmailConfirmation } = await signUpAction(email, password, fullName);

        if (!errorMessage) {
          if (requiresEmailConfirmation) {
            toast.success("Akun berhasil dibuat! Silakan cek email Anda untuk konfirmasi.");
          } else {
            toast.success("Anda berhasil mendaftar.");
            // >>> TAMBAHKAN INI JUGA DI SINI <<<
            router.refresh(); 
            router.replace("/");
          }
        } else {
          toast.error(errorMessage || "Terjadi kesalahan saat mendaftar."); 
        }
      }
    });
  };

  return (
    <form action={handleSubmit}>
      <CardContent className="grid w-full items-center gap-4">
        {!isLoginForm && (
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="fullName">Nama Lengkap</Label>
            <Input
              id="fullName"
              name="fullName"
              placeholder="Masukkan nama lengkap Anda"
              type="text"
              required
              disabled={isPending}
            />
          </div>
        )}
        <div className="flex flex-col space-y-1.5">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            placeholder="Masukkan email Anda"
            type="email"
            required
            disabled={isPending}
          />
        </div>
        <div className="flex flex-col space-y-1.5">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            name="password"
            placeholder={
              isLoginForm
                ? "Masukkan password Anda"
                : "Min 8 karakter, harus mengandung: A-Z, a-z, 0-9, simbol"
            }
            type="password"
            disabled={isPending}
            required={!isLoginForm} 
          />
        </div>
      </CardContent>
      <CardFooter className="mt-4 flex flex-col gap-6">
        <Button className="w-full" disabled={isPending}>
          {isPending ? (
            <Loader2 className="animate-spin" />
          ) : isLoginForm ? (
            "Login"
          ) : (
            "Daftar"
          )}
        </Button>
        <p className="text-xs">
          {isLoginForm ? "Belum punya akun?" : "Sudah punya akun?"}{" "}
          <Link
            href={isLoginForm ? "/sign-up" : "/login"}
            className={`text-blue-500 ${isPending ? "pointer-events-none opacity-50" : ""}`}
          >
            {isLoginForm ? "Daftar" : "Login"}
          </Link>
        </p>
      </CardFooter>
    </form>
  );
};

export default AuthForm;