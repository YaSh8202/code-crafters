import { useRouter } from "next/router";
import React from "react";

function getPageHeader(path: string): string {
  const pathArray = path.split("/");
  let header = pathArray[1];

  if (header?.endsWith("s") && pathArray[2]) {
    header = header.slice(0, -1);
  }
  if (!header) return "Home";
  return header.replace(/-/g, " ");
}

function PageHeader() {
  const router = useRouter();

  return (
    <nav className=" w-full border-y ">
      <div className="mx-auto flex h-12 w-[min(100%-2rem,1400px)] items-center justify-between px-2 md:px-4 ">
        <div className="flex h-full items-center border-x px-4 ">
          <h3 className="text-base font-semibold uppercase tracking-wide">
            {getPageHeader(router.asPath)}
          </h3>
        </div>
      </div>
    </nav>
  );
}

export default PageHeader;
