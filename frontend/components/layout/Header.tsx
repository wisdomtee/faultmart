"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Menu,
  Bell,
  Heart,
  User,
  LogOut,
} from "lucide-react";

import Container from "./Container";
import Logo from "./Logo";

import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/auth-store";

export default function Header() {
  const router = useRouter();

  const {
    user,
    isAuthenticated,
    logout,
  } = useAuthStore();

  function handleLogout() {
    logout();
    router.push("/");
  }

  return (
    <header
      className="
        sticky
        top-0
        z-50
        border-b
        border-neutral-200/60
        bg-white/80
        backdrop-blur-xl
      "
    >
      <Container>
        <div className="flex h-20 items-center justify-between">
          {/* Logo */}
          <Logo />

          {/* Navigation */}
          <nav className="hidden items-center gap-10 md:flex">
            <Link
              href="/"
              className="text-sm font-medium text-neutral-700 transition hover:text-orange-600"
            >
              Home
            </Link>

            <Link
              href="/search"
              className="text-sm font-medium text-neutral-700 transition hover:text-orange-600"
            >
              Browse
            </Link>

            <Link
              href="/categories"
              className="text-sm font-medium text-neutral-700 transition hover:text-orange-600"
            >
              Categories
            </Link>

            <Link
              href="/about"
              className="text-sm font-medium text-neutral-700 transition hover:text-orange-600"
            >
              About
            </Link>
          </nav>

          {/* Desktop Actions */}
          <div className="hidden items-center gap-3 md:flex">
            {isAuthenticated && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full"
                >
                  <Bell className="h-5 w-5" />
                </Button>

                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full"
                >
                  <Heart className="h-5 w-5" />
                </Button>

                <button
                  onClick={() => router.push("/dashboard")}
                  className="
                    flex
                    items-center
                    gap-2
                    rounded-full
                    border
                    border-neutral-200
                    px-4
                    py-2
                    transition
                    hover:bg-neutral-100
                  "
                >
                  <User className="h-4 w-4" />

                  <span className="text-sm font-medium">
                    Hi, {user?.firstName}
                  </span>
                </button>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleLogout}
                  className="rounded-full"
                >
                  <LogOut className="h-5 w-5" />
                </Button>
              </>
            )}

            {!isAuthenticated && (
              <Link href="/login">
                <Button
                  variant="outline"
                  className="rounded-full px-6"
                >
                  Login
                </Button>
              </Link>
            )}

            <Button
              onClick={() =>
                router.push(
                  isAuthenticated
                    ? "/dashboard/listings/create"
                    : "/login"
                )
              }
              className="
                rounded-full
                bg-orange-600
                px-7
                hover:bg-orange-700
              "
            >
              Sell Item
            </Button>
          </div>

          {/* Mobile Menu */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
          >
            <Menu className="h-6 w-6" />
          </Button>
        </div>
      </Container>
    </header>
  );
}