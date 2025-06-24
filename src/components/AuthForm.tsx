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
        // Validasi sederhana untuk login - hanya cek password tidak kosong
        if (!password) {
          toast.error("Password tidak boleh kosong");
          return;
        }

        // Email validation akan ditangani oleh Supabase
        const errorMessage = (await loginAction(email, password)).errorMessage;

        if (!errorMessage) {
          toast.success("You have successfully logged in.");
          router.replace("/");
        } else {
          toast.error("Email atau password salah");
        }
      } else {
        // Validasi ketat untuk signup menggunakan userSchema
        const result = userSchema.safeParse({ fullName, email, password });
        if (!result.success) {
          toast.error(result.error.errors[0].message);
          return;
        }

        const errorMessage = (await signUpAction(email, password, fullName))
          .errorMessage;

        if (!errorMessage) {
          toast.success("You have successfully signed up.");
          router.replace("/");
        } else {
          toast.error("An error occurred while signing up.");
        }
      }
    });
  };

  return (
    <form action={handleSubmit}>
      <CardContent className="grid w-full items-center gap-4">
        {!isLoginForm && (
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="fullName">Full Name</Label>
            <Input
              id="fullName"
              name="fullName"
              placeholder="Enter your full name"
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
            placeholder="Enter your email"
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
                ? "Enter your password"
                : "Min 8 chars, include: A-Z, a-z, 0-9, symbol"
            }
            type="password"
            disabled={isPending}
          />
        </div>
      </CardContent>
      <CardFooter className="mt-4 flex flex-col gap-6">
        <Button className="w-full">
          {isPending ? (
            <Loader2 className="animate-spin" />
          ) : isLoginForm ? (
            "Login"
          ) : (
            "Sign Up"
          )}
        </Button>
        <p className="text-xs">
          {isLoginForm ? "Don't have an account?" : "Already have an account?"}{" "}
          <Link
            href={isLoginForm ? "/sign-up" : "/login"}
            className={`text-blue-500 ${isPending ? "pointer-events-none opacity-50" : ""}`}
          >
            {isLoginForm ? "Sign Up" : "Login"}
          </Link>
        </p>
      </CardFooter>
    </form>
  );
};

export default AuthForm;
