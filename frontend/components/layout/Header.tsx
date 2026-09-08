"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Menu,
  Bell,
  Heart,
  User,
  LogOut,
  X,
} from "lucide-react";

import Container from "./Container";
import Logo from "./Logo";

import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/auth-store";

export default function Header() {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const {
    user,
    isAuthenticated,
    logout,
  } = useAuthStore();

  function handleLogout() {
    setMobileMenuOpen(false);
    logout();
    router.push("/");
  }

  function handleSellItem() {
    setMobileMenuOpen(false);
    router.push(isAuthenticated ? "/listings/create" : "/login");
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

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-10 md:flex">
            <Link
              href="/"
              className="text-sm font-medium text-neutral-700 transition hover:text-orange-600"
            >
              Home
            </Link>

            <Link
              href="/listings"
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

            <Link
              href="/download"
              className="text-sm font-semibold text-orange-600 transition hover:text-orange-700"
            >
              Download App
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

                <div className="flex items-center gap-2">
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

                  <Link
                    href="/dashboard/profile"
                    className="
                      rounded-full
                      px-4
                      py-2
                      text-sm
                      font-medium
                      text-neutral-700
                      transition
                      hover:bg-neutral-100
                    "
                  >
                    Profile
                  </Link>
                </div>

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
              onClick={handleSellItem}
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

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen((open) => !open)}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="border-t border-neutral-200/60 py-4 md:hidden">
            <nav className="flex flex-col gap-1">
              <Link
                href="/"
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-lg px-4 py-3 text-sm font-medium text-neutral-700 transition hover:bg-neutral-100"
              >
                Home
              </Link>

              <Link
                href="/listings"
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-lg px-4 py-3 text-sm font-medium text-neutral-700 transition hover:bg-neutral-100"
              >
                Browse
              </Link>

              <Link
                href="/categories"
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-lg px-4 py-3 text-sm font-medium text-neutral-700 transition hover:bg-neutral-100"
              >
                Categories
              </Link>

              <Link
                href="/about"
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-lg px-4 py-3 text-sm font-medium text-neutral-700 transition hover:bg-neutral-100"
              >
                About
              </Link>

              <Link
                href="/download"
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-lg px-4 py-3 text-sm font-semibold text-orange-600 transition hover:bg-orange-50"
              >
                Download App
              </Link>

              <div className="mt-2 border-t border-neutral-200 pt-3">
                {isAuthenticated ? (
                  <>
                    <button
                      onClick={() => {
                        setMobileMenuOpen(false);
                        router.push("/dashboard");
                      }}
                      className="flex w-full items-center gap-2 rounded-lg px-4 py-3 text-left text-sm font-medium text-neutral-700 transition hover:bg-neutral-100"
                    >
                      <User className="h-4 w-4" />
                      Hi, {user?.firstName}
                    </button>

                    <Link
                      href="/dashboard/profile"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block rounded-lg px-4 py-3 text-sm font-medium text-neutral-700 transition hover:bg-neutral-100"
                    >
                      Profile
                    </Link>

                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center gap-2 rounded-lg px-4 py-3 text-left text-sm font-medium text-neutral-700 transition hover:bg-neutral-100"
                    >
                      <LogOut className="h-4 w-4" />
                      Logout
                    </button>
                  </>
                ) : (
                  <Link
                    href="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block rounded-lg px-4 py-3 text-sm font-medium text-neutral-700 transition hover:bg-neutral-100"
                  >
                    Login
                  </Link>
                )}

                <Button
                  onClick={handleSellItem}
                  className="mt-2 w-full rounded-full bg-orange-600 hover:bg-orange-700"
                >
                  Sell Item
                </Button>
              </div>
            </nav>
          </div>
        )}
      </Container>
    </header>
  );
}
