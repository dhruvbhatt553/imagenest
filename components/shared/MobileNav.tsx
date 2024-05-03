"use client";
import React from "react";
import { Sheet, SheetContent, SheetTrigger,Button } from "@/components/ui/sheet";
import Link from "next/link";
import Image from "next/image";
import { SignedIn, UserButton, SignedOut } from "@clerk/nextjs";
import { navLinks } from "@/constants";
import { usePathname } from "next/navigation";

const MobileNav = () => {
  const path = usePathname();
  return (
    <header className='header'>
      <Link
        href={"/"}
        className='flex item-center gap-2 md:py-2'>
        <Image
          src='/assets/images/icon-imagenest.png'
          alt='logo'
          width={50}
          height={28}
        />
      </Link>

      <nav className='flex gap-2'>
        <SignedIn>
          <UserButton afterSignOutUrl='/' />
          <Sheet>
            <SheetTrigger>
              <Image
                src={"/assets/icons/menu.svg"}
                width={36}
                height={36}
                alt='menu'
                className='cursor-pointer'
              />
            </SheetTrigger>
            <SheetContent className='sheet-content sm:w-64'>
              <>
                <div className="flex  items-center">
                  <Image
                    src='/assets/images/icon-imagenest.png'
                    alt='logo'
                    width={50}
                    height={28}
                  />
                  <div className="font-bold">
                    ImageNest
                  </div>
                </div>

                <ul className='header-nav_elements'>
                  {navLinks.map((link: any) => {
                    const isActive = path === link.route;

                    return (
                      <li
                        key={link.route}
                        className={`${
                          isActive && "gradient-text"
                        } p-18 flex whitespace-nowrap text-dark-700`}>
                        <Link
                          className='sidebar-link cursor-pointer'
                          href={link.route}>
                          <Image
                            src={link.icon}
                            alt='logo'
                            width={24}
                            height={24}
                          />
                          {link.label}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </>
            </SheetContent>
          </Sheet>
        </SignedIn>
        <SignedOut>
            <Button
              asChild
              className='button bg-purple-gredient bg-cover'>
              <Link href='/sign-in'>Login</Link>
            </Button>
          </SignedOut>
      </nav>
    </header>
  );
};

export default MobileNav;
