"use client";

import Link from "next/link";
import { Menu, Bell } from "lucide-react";

import Container from "./Container";
import Logo from "./Logo";
import { Button } from "@/components/ui/button";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b bg-white/90 backdrop-blur">
      <Container>
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Logo />

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-8 md:flex">
            <Link href="/">Home</Link>

            <Link href="/search">Browse</Link>

            <Link href="/categories">Categories</Link>

            <Link href="/about">About</Link>
          </nav>

          {/* Right Side */}
          <div className="hidden items-center gap-3 md:flex">
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
            </Button>

            <Button variant="outline">
              Login
            </Button>

            <Button>
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