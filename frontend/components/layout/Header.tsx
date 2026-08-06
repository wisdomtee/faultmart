"use client";

import Link from "next/link";
import {
  Menu,
  Bell,
} from "lucide-react";

import Container from "./Container";
import Logo from "./Logo";

import { Button } from "@/components/ui/button";


export default function Header() {

  return (

    <header className="
      sticky 
      top-0 
      z-50 
      border-b 
      border-neutral-200/60
      bg-white/80 
      backdrop-blur-xl
    ">


      <Container>

        <div className="
          flex 
          h-20 
          items-center 
          justify-between
        ">


          {/* Logo */}

          <Logo />



          {/* Navigation */}

          <nav className="
            hidden 
            items-center 
            gap-10 
            md:flex
          ">


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





          {/* Actions */}

          <div className="
            hidden 
            items-center 
            gap-3 
            md:flex
          ">


            <Button
              variant="ghost"
              size="icon"
              className="rounded-full"
            >
              <Bell className="h-5 w-5"/>
            </Button>



            <Button
              variant="outline"
              className="rounded-full px-6"
            >
              Login
            </Button>



            <Button
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





          {/* Mobile */}

          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
          >

            <Menu className="h-6 w-6"/>

          </Button>


        </div>

      </Container>


    </header>

  );
}