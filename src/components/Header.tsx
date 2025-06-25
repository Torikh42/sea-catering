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
} | null;

export default function Header({ user }: { user?: User }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname(); // Gunakan usePathname() dari Next.js

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
        <Link className="flex items-center gap-3" href="/">
          <Image src="/image-sea.png" height={40} width={40} alt="logo" priority />
          <div className="hidden sm:block">
            <h1 className="text-lg font-bold text-green-500 lg:text-xl">
              SEA <span className="text-blue-400">CATERING</span>
            </h1>
            <span className="text-xs text-gray-500">Sea Catering Solutions</span>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-2">
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

        <div className="hidden md:flex items-center gap-2">
          {user ? (
            <LogOutButton />
          ) : (
            <>
              <Button asChild variant="outline" className="border-blue-200 text-blue-600 hover:bg-blue-50">
                <Link href="/sign-up">Sign Up</Link>
              </Button>
              <Button asChild className="bg-blue-500 hover:bg-blue-600">
                <Link href="/login">Login</Link>
              </Button>
            </>
          )}
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setMobileOpen((v) => !v)}
            className="p-2"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 shadow-lg">
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
            <div className="pt-2 border-t border-gray-200 flex flex-col gap-2">
              {user ? (
                <div onClick={() => setMobileOpen(false)}>
                  <LogOutButton />
                </div>
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