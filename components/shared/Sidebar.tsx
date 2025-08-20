import { auth, SignedIn, SignedOut, useAuth, UserButton } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { redirect, usePathname, useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { Plus } from "lucide-react";
import { navLinks } from "@/constants/nav-links";
import { useProjectStore } from "@/lib/project-store";
import VideoTools from "@/features/editor/components/toolbar/video-tools";
import ImageTools from "@/features/editor/components/toolbar/image-tools";
import ExportAsset from "@/features/editor/components/toolbar/export-image";
import { addProject } from "@/lib/actions/project.actions";
import { getUserById } from "@/lib/actions/user.actions";

const Sidebar = () => {
  const pathname = usePathname();
  const layerStore = useProjectStore((state) => state);
  const router = useRouter();
  const { isLoaded, userId, sessionId, getToken } = useAuth();

  if (!userId) redirect("/sign-in");

  const createNewProject = async () => {
    try {
      const projectData = {
        name: "New Project",
        userId,
        version: 1,
      };
      console.log("new project userid", userId);

      const user = await getUserById(userId);

      const newProject = await addProject({
        project: projectData,
        userId: user._id,
        path: "/",
      });

      console.log("new project", newProject);

      if (newProject) {
        layerStore.addId(newProject._id);
        layerStore.addName(newProject.name);
        layerStore.addUser(newProject.userId);
        router.push(`/app/edit/${newProject._id}`);
      }
    } catch (error) {
      console.log(error);
    }
  };

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
          {/* <SignedIn>
            <div className="py-4 px-4  w-full">
              <div className="flex flex-col gap-4 ">
                {activeLayer?.resourceType === "video" ? <VideoTools /> : null}
                {activeLayer?.resourceType === "image" ? <ImageTools /> : null}
                {activeLayer?.resourceType && (
                  <ExportAsset resource={activeLayer?.resourceType} />
                )}
              </div>
            </div>
          </SignedIn> */}
          <SignedIn>
            <div>
              <ul className="sidebar-nav_elements my-6 mb-8">
                <li
                  className={cn({
                    "sidebar-nav_element group w-full border border-secondary bg-accent dark:bg-accent text-secondary":
                      true,
                  })}
                >
                  <Button
                    variant={"outline"}
                    className="sidebar-link !gap-2 text-sm flex justify-center"
                    onClick={createNewProject}
                  >
                    <Plus className="h-5 w-5 text-secondary" />
                    <span
                      className={cn({
                        "text-secondary": true,
                      })}
                    >
                      Create
                    </span>
                  </Button>
                </li>
              </ul>
              {/* <ul className="sidebar-nav_elements"> */}
              {/* {navLinks.slice(1, 6).map((link) => {
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
                })} */}
              {/* </ul> */}
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
                      <link.icon className="h-[17px] w-[17px]" />

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
