// Header.tsx
"use client";

import React, { useState } from "react";
import { Button } from "./ui/button";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import LogOutButton from "./LogOutButton";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/menu", label: "Menu" },
  { href: "/subscription", label: "Subscription" },
  { href: "/contact", label: "Contact Us" },
];

type User = {
  id?: string;
  email?: string;
  name?: string;
  role?: "user" | "admin" | string | null;
  user_metadata?: {
    fullName?: string;
  };
} | null;

export default function Header({ user }: { user?: User }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  const dashboardHref =
    user?.role === "admin" ? "/dashboard-admin" : "/dashboard-user";

  // Dapatkan nama depan user, prioritaskan 'name' lalu 'user_metadata.fullName'
  const firstName = user?.name
    ? user.name.split(" ")[0]
    : user?.user_metadata?.fullName
      ? String(user.user_metadata.fullName).split(" ")[0]
      : null;

  return (
    <header className="sticky top-0 z-50 border-b border-gray-100 bg-white shadow-lg">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link
          className="flex flex-shrink-0 items-center gap-2 sm:gap-3"
          href="/"
        >
          <Image
            src="https://res.cloudinary.com/dsw1iot8d/image/upload/v1751186571/image-sea_krhhpf.png" 
            height={40}
            width={40}
            alt="logo"
            priority
            className="sm:h-[50px] sm:w-[50px]"
          />
          <div className="min-w-0 flex-1">
            <h1 className="text-sm leading-tight font-bold text-green-500 sm:text-lg lg:text-xl">
              SEA <span className="text-blue-400">CATERING</span>
            </h1>
            <span className="hidden text-xs text-gray-500 sm:block">
              Sea Catering Solutions
            </span>
          </div>
        </Link>

        <nav className="hidden items-center gap-2 md:flex">
          {navItems.map((item) => (
            <Button
              asChild
              key={item.href}
              variant={isActive(item.href) ? "default" : "ghost"}
              className={`transition-all duration-200 ${
                isActive(item.href)
                  ? "bg-blue-500 text-white hover:bg-blue-600"
                  : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
              }`}
            >
              <Link href={item.href}>{item.label}</Link>
            </Button>
          ))}
        </nav>

        <div className="hidden flex-shrink-0 items-center gap-2 md:flex">
          {user ? (
            <>
              {/* Ini akan tampil jika user login */}
              <div className="flex items-center gap-2">
                {/* Sapaan hanya tampil jika firstName ada */}
                {firstName && (
                  <span className="hidden text-sm font-semibold text-gray-700 sm:block">
                    Hey, {firstName}!
                  </span>
                )}
                {user.role && (
                  <Button
                    asChild
                    variant={isActive(dashboardHref) ? "default" : "ghost"}
                    className={`transition-all duration-200 ${
                      isActive(dashboardHref)
                        ? "bg-blue-500 text-white hover:bg-blue-600"
                        : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                    }`}
                  >
                    <Link href={dashboardHref}>Dashboard</Link>
                  </Button>
                )}
              </div>
              <LogOutButton />
            </>
          ) : (
            <>
              {/* Ini akan tampil jika user belum login */}
              <Button
                asChild
                variant="outline"
                className="border-blue-200 text-blue-600 hover:bg-blue-50"
              >
                <Link href="/sign-up">Sign Up</Link>
              </Button>
              <Button asChild className="bg-blue-500 hover:bg-blue-600">
                <Link href="/login">Login</Link>
              </Button>
            </>
          )}
        </div>

        {/* Mobile menu button */}
        <div className="flex-shrink-0 md:hidden">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setMobileOpen((v) => !v)}
            className="p-2"
            aria-label="Toggle menu"
          >
            {mobileOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileOpen && (
        <div className="border-t border-gray-100 bg-white shadow-lg md:hidden">
          <nav className="flex flex-col gap-1 px-4 py-3">
            {navItems.map((item) => (
              <Button
                asChild
                key={item.href}
                variant={isActive(item.href) ? "default" : "ghost"}
                className={`w-full justify-start transition-all duration-200 ${
                  isActive(item.href)
                    ? "bg-blue-500 text-white"
                    : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                }`}
                onClick={() => setMobileOpen(false)}
              >
                <Link href={item.href}>{item.label}</Link>
              </Button>
            ))}
            <div className="flex flex-col gap-2 border-t border-gray-200 pt-2">
              {user ? (
                <>
                  {user.role && (
                    <Button
                      asChild
                      variant={isActive(dashboardHref) ? "default" : "ghost"}
                      className="w-full justify-start"
                      onClick={() => setMobileOpen(false)}
                    >
                      <Link href={dashboardHref}>Dashboard</Link>
                    </Button>
                  )}
                  <div onClick={() => setMobileOpen(false)}>
                    <LogOutButton />
                  </div>
                </>
              ) : (
                <>
                  <Button
                    asChild
                    variant="outline"
                    className="w-full border-blue-200 text-blue-600 hover:bg-blue-50"
                    onClick={() => setMobileOpen(false)}
                  >
                    <Link href="/sign-up">Sign Up</Link>
                  </Button>
                  <Button
                    asChild
                    className="w-full bg-blue-500 hover:bg-blue-600"
                    onClick={() => setMobileOpen(false)}
                  >
                    <Link href="/login">Login</Link>
                  </Button>
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
