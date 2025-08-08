import { Collection } from "@/components/shared/Collection";
import { navLinks } from "@/constants/nav-links";

import { getAllImages } from "@/lib/actions/image.actions";
import Image from "next/image";
import Link from "next/link";

const Home = async ({ searchParams }: SearchParamProps) => {
  const page = Number(searchParams?.page) || 1;
  const searchQuery = (searchParams?.query as string) || "";

  const images = await getAllImages({ page, searchQuery });

  return (
    <>
      <section className="home">
        <div className="w-full gap-20">
          <h3 className="mb-6 text-lg font-medium">Tools</h3>
          <div className="grow-[1]"></div>
        </div>
        <ul className="w-full gap-20 flex">
          {navLinks.slice(1, 6).map((link) => (
            
            <Link
              key={link.route}
              href={link.route}
              className="flex-center flex-col gap-2   p-4 "
            >
              <li className="flex-center rounded p-4 bg-accent border w-32 h-18">
                <link.icon className="text-secondary" />
              </li>
              <p className="text-center text-sm ">{link.label}</p>
            </Link>
          ))}
        </ul>
      </section>

      <section className="sm:mt-12">
        <Collection
          hasSearch={true}
          images={images?.data}
          totalPages={images?.totalPage}
          page={page}
        />
      </section>
    </>
  );
};

export default Home;
