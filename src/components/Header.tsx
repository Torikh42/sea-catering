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

// Perbarui tipe User untuk mencerminkan objek yang dikembalikan dari getUser()
type User = {
  id?: string;
  email?: string;
  name?: string;
  role?: "user" | "admin" | string | null;
} | null;

export default function Header({ user }: { user?: User }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  // Debugging logs (biarkan tetap ada)
  console.log("Header Component - User Prop:", user);
  console.log("Header Component - User Role:", user?.role);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  // Sekarang kita bisa langsung cek user?.role karena sudah dijamin ada
  const dashboardHref =
    user?.role === "admin" ? "/dashboard-admin" : "/dashboard-user";

  console.log("Header Component - Dashboard Href:", dashboardHref);

  return (
    <header className="sticky top-0 z-50 border-b border-gray-100 bg-white shadow-lg">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link
          className="flex flex-shrink-0 items-center gap-2 sm:gap-3"
          href="/"
        >
          <Image
            src="https://res.cloudinary.com/dsw1iot8d/image/upload/v1751033917/Screenshot_2025-06-24_095226_ryv3ih.png"
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
              <LogOutButton />
            </>
          ) : (
            <>
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
                      <Link href={dashboardHref}>
                        Dashboard {user.role === "admin" ? "(Admin)" : "(User)"}
                      </Link>
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
