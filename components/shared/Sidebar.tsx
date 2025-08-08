"use client";


import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { Plus } from "lucide-react";
import { navLinks } from "@/constants/nav-links";

const Sidebar = () => {
  const pathname = usePathname();

  return (
    <aside className="sidebar">
      <div className="flex size-full flex-col gap-4">
        <div className="flex gap-4">
          <Link href="/" className="sidebar-logo ml-3">
            <Image
              src="/assets/images/logo-text.png"
              alt="logo"
              width={180}
              height={28}
              style={{ height: 34, width: "auto" }}
            />
          </Link>
        </div>

        <nav className="sidebar-nav">
          <SignedIn>
            <div>
              <ul className="sidebar-nav_elements my-6 mb-8">
                {navLinks.slice(0, 1).map((link) => {
                  const isActive = link.route === pathname;

                  return (
                    <li
                      key={link.route}
                      className={cn({
                        "sidebar-nav_element group w-full border border-secondary bg-accent dark:bg-accent text-secondary":
                          true,
                      })}
                    >
                      <Link
                        className="sidebar-link !gap-2 text-sm flex justify-center"
                        href={link.route}
                      >
                        <Plus className="h-5 w-5" />
                        <span
                          className={cn({
                            "text-secondary": isActive,
                          })}
                        >
                          Create
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
              <ul className="sidebar-nav_elements">
                {navLinks.slice(1, 6).map((link) => {
                  const isActive = link.route === pathname;

                  return (
                    <li
                      key={link.route}
                      className={`sidebar-nav_element group w-full ${
                        isActive
                          ? "bg-accent dark:bg-accent text-secondary"
                          : ""
                      }`}
                    >
                      <Link className="sidebar-link text-sm" href={link.route}>
                        <link.icon className="h-[17px] w-[17px]"/>
                        <span
                          className={cn({
                            "text-secondary": isActive,
                          })}
                        >
                          {link.label}
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
            <ul className="sidebar-nav_elements">
              {navLinks.slice(6).map((link) => {
                const isActive = link.route === pathname;

                return (
                  <li
                    key={link.route}
                    className={`sidebar-nav_element group ${
                      isActive ? "bg-accent dark:bg-accent text-secondary" : ""
                    }`}
                  >
                    <Link
                      className="sidebar-link flex justify-start text-sm"
                      href={link.route}
                    >
                      <link.icon className="h-[17px] w-[17px]"/>

                      <span
                        className={cn({
                          "text-secondary": isActive,
                        })}
                      >
                        {link.label}
                      </span>
                    </Link>
                  </li>
                );
              })}

              <li className="flex-center cursor-pointer gap-2 p-4">
                <UserButton afterSignOutUrl="/" showName />
              </li>
            </ul>
          </SignedIn>

          <SignedOut>
            <Button asChild className="button">
              <Link href="/sign-in">Login</Link>
            </Button>
          </SignedOut>
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
