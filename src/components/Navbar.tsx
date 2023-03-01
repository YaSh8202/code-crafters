import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

function Navbar() {
  const { data: session } = useSession();
  return (
    <div className="navbar bg-base-100">
      <div className="flex-1">
        <Link href="/" className="btn-ghost btn text-xl normal-case">
          Code Crafters
        </Link>
      </div>
      <div className="flex-none">
        <ul className="menu menu-horizontal px-1">
          <li>
            <Link href="/challenges" className="" >CHALLENGES</Link>
          </li>
          <li tabIndex={0}>
            <div className="dropdown-bottom dropdown-end dropdown">
              <label tabIndex={0} className="flex flex-row items-center m-1 ">
                <div className="avatar">
                  <div className="w-10 rounded-full">
                    {session?.user.image && (
                      <Image
                        width={40}
                        height={40}
                        alt="User"
                        src={session?.user.image}
                      />
                    )}
                  </div>
                </div>
                <svg
                  className="fill-current"
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                >
                  <path d="M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z" />
                </svg>
              </label>
              <ul
                tabIndex={0}
                className="dropdown-content menu rounded-box w-52 bg-base-100 p-2 shadow"
              >
                <li>
                  <a>Item 1</a>
                </li>
                <li>
                  <a>Item 2</a>
                </li>
              </ul>
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default Navbar;
