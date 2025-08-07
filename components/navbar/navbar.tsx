import { Button } from "@/components/ui/button";

import { NavMenu } from "./nav-menu";
import { NavigationSheet } from "./navigation-sheet";
import ThemeToggle from "../shared/theme-toggle";
import Logo from "../shared/Logo";
import { auth, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { getUserById } from "@/lib/actions/user.actions";

const Navbar = async () => {
   const { userId } = auth();
    const user = await getUserById(userId??"");
  return (
    <nav className="fixed z-10 top-6 inset-x-4 h-14 xs:h-16 bg-background/50 backdrop-blur-sm border dark:border-slate-700/70 max-w-screen-xl mx-auto rounded-full">
      <div className="h-full flex items-center justify-between mx-auto px-4">
       <Logo height={20} width={32}/>

        {/* Desktop Menu */}
        <NavMenu className="hidden md:block" />

        <div className="flex items-center gap-3">
          <SignedIn>
           <UserButton afterSignOutUrl="/" showName />
           </SignedIn>
         <SignedOut>
          <Button variant="outline" className="hidden sm:inline-flex">
            Sign In
          </Button><Button className="hidden xs:inline-flex">Get Started</Button>
          </SignedOut>
         <ThemeToggle />

          {/* Mobile Menu */}
          <div className="md:hidden">
            <NavigationSheet />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
