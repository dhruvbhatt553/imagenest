"use client";

import Image from "next/image";
import Link from "next/link";
import React from "react";
import { navLinks } from "../../constants";
import { usePathname } from "next/navigation";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { Button } from "../ui/button";

const Sidebar = () => {
  const path = usePathname();
  return (
    <aside className='sidebar'>
      <div className='flex size-full flex-col gap-4'>
        <Link
          href='/'
          className='sidebar-logo'>
          <Image
            src='/assets/images/icon-imagenest.png'
            alt='logo'
            width={60}
            height={20}
          />
          <p className='text-3xl font-semibold'> ImageNest</p>
        </Link>

        <nav className='sidebar-nav'>
          <SignedIn>
            <ul className='sidebar-nav_elements'>
              {navLinks.slice(0,6).map((link: any) => {
                const isActive = path === link.route;

                return (
                  <li
                    key={link.route}
                    className={`sidebar-nav_element group ${
                      isActive
                        ? "bg-purple-gradient text-white"
                        : "text-gray-700"
                    }`}>
                    <Link
                      className='sidebar-link'
                      href={link.route}>
                      <Image
                        src={link.icon}
                        alt='logo'
                        width={24}
                        height={24}
                        className={`${isActive && "brightness-200"}`}
                      />
                      {link.label}
                    </Link>
                  </li>
                );
              })}
            </ul>

            <ul className='sidebar-nav_elements'>
              {navLinks.slice(6).map((link: any) => {
                const isActive = path === link.route;

                return (
                  <li
                    key={link.route}
                    className={`sidebar-nav_element group ${
                      isActive
                        ? "bg-purple-gradient text-white"
                        : "text-gray-700"
                    }`}>
                    <Link
                      className='sidebar-link'
                      href={link.route}>
                      <Image
                        src={link.icon}
                        alt='logo'
                        width={24}
                        height={24}
                        className={`${isActive && "brightness-200"}`}
                      />
                      {link.label}
                    </Link>
                  </li>
                );
              })}
              <li className='flex-center gap-2 p-4 cursor-pointer'>
                <UserButton
                  afterSignOutUrl='/'
                  showName
                />
              </li>
            </ul>
          </SignedIn>

          <SignedOut>
            <Button
              asChild
              className='button bg-purple-gredient bg-cover'>
              <Link href='/sign-in'>Login</Link>
            </Button>
          </SignedOut>
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
