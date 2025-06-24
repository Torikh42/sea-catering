import React from "react";
import { Button } from "./ui/button";
import Link from "next/link";
import Image from "next/image";
import { getUser } from "@/auth/server";
import LogOutButton from "./LogOutButton";

const Header = async () => {
  const user = await getUser();
  return (
    <header className="flex flex-col items-start justify-between gap-2 border-b border-gray-100 bg-white px-4 py-3 shadow-lg sm:flex-row sm:items-center sm:gap-0 sm:px-6">
      <Link className="flex items-center gap-3" href="/">
        <Image src="/image.png" height={50} width={50} alt="logo" priority />
        <div>
          <h1 className="text-xl leading-tight font-bold text-green-500 sm:text-2xl">
            SEA <span className="text-blue-400">CATERING</span>
          </h1>
          <span className="text-xs text-gray-500">Sea Catering Solutions</span>
        </div>
      </Link>
      <nav className="flex w-full flex-wrap gap-2 sm:w-auto sm:gap-4">
        <Link href="/">
          <Button
            variant="outline"
            className="w-full hover:bg-blue-100 sm:w-auto"
          >
            Home
          </Button>
        </Link>
        <Link href="/menu">
          <Button
            variant="outline"
            className="w-full hover:bg-blue-100 sm:w-auto"
          >
            Menu
          </Button>
        </Link>
        <Link href="/subscription">
          <Button
            variant="outline"
            className="w-full hover:bg-blue-100 sm:w-auto"
          >
            Subscription
          </Button>
        </Link>
        <Link href="/contact">
          <Button
            variant="outline"
            className="w-full hover:bg-blue-100 sm:w-auto"
          >
            Contact Us
          </Button>
        </Link>
        {user ? (
          <LogOutButton />
        ) : (
          <>
            <Link href="/sign-up">
              <Button
                variant="outline"
                className="w-full hover:bg-blue-100 sm:w-auto"
              >
                Sign Up
              </Button>
            </Link>
            <Link href="/login">
              <Button
                variant="outline"
                className="w-full hover:bg-blue-100 sm:w-auto"
              >
                Login
              </Button>
            </Link>
          </>
        )}
      </nav>
    </header>
  );
};

export default Header;
