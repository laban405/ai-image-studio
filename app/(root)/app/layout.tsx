"use client";
import MobileNav from "@/components/shared/MobileNav";
import Sidebar from "@/components/shared/Sidebar";
import { ThemeToggle } from "@/components/theme-toggle";
import { Toaster } from "@/components/ui/toaster";
import { ProjectStore } from "@/lib/project-store";
import { ImageStore } from "@/lib/store";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <ImageStore.Provider
      initialValue={{
        activeTag: "all",
        activeColor: "green",
        activeImage: "",
      }}
    >
      <ProjectStore.Provider initialValue={null}>
        <main className="root">
          <Sidebar />
          <MobileNav />
          <div className="root-container  dark:bg-background h-full max-h-screen">
            <header className="p-4 flex justify-end h-[72px] border border-l-0 border-t-0 border-r-0 border-b-gray-200 dark:border-b-accent ">
              <ThemeToggle />
            </header>
            <div className="wrapper bg-gray-100 dark:bg-background h-[calc(100vh-72px)] overflow-y-scroll p-0">
              {children}
            </div>
          </div>

          <Toaster />
        </main>
      </ProjectStore.Provider>
    </ImageStore.Provider>
  );
};

export default Layout;
