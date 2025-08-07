"use client";

import { navLinks } from "@/constants";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";

const Sidebar = () => {
  const pathname = usePathname();

  return (
    <aside className="sidebar">
      <div className="flex size-full flex-col gap-4">
        <div className="flex gap-4 mx-auto">
          <Link href="/" className="sidebar-logo">
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
            <ul className="sidebar-nav_elements">
              {navLinks.slice(0, 6).map((link) => {
                const isActive = link.route === pathname;

                return (
                  <li
                    key={link.route}
                    className={`sidebar-nav_element group w-full ${
                      isActive ? "bg-secondary dark:bg-accent text-white" : ""
                    }`}
                  >
                    <Link className="sidebar-link text-sm" href={link.route}>
                      <Image
                        src={link.icon}
                        alt="logo"
                        width={18}
                        height={18}
                        className={`${isActive && "brightness-200"}`}
                      />
                      <span  className={cn({
                        'text-secondary brightness-200':isActive
                      })}>
                      {link.label}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>

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
                    <Link className="sidebar-link flex justify-start text-sm" href={link.route}>
                      <Image
                        src={link.icon}
                        alt="Mikrosell link icon"
                        width={18}
                        height={18}
                        className={`${isActive && "brightness-200"}`}
                      />
                        <span  className={cn({
                        'text-secondary brightness-200':isActive
                      })}>
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
