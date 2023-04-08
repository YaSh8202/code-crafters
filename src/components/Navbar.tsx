import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { MdiGithub } from "./Icones";

function Navbar() {
  const { data: session, status } = useSession();
  return (
    <div className="navbar mx-auto w-[min(100%-2rem,1400px)] px-0">
      <div className="flex-1">
        <Link href="/" className="btn-ghost btn text-xl normal-case">
          Code Crafters
        </Link>
      </div>
      <div className="flex-none">
        <ul className="menu menu-horizontal px-1">
          <li className="hidden md:block" >
            <Link href="/challenges" className="">
              CHALLENGES
            </Link>
          </li>
          {session?.user && (
            <li className="hidden md:block" >
              <Link href="/new-challenge" className="">
                Add Challenge
              </Link>
            </li>
          )}
          {status !== "loading" && (
            <>
              {session?.user.image ? (
                <div className="dropdown-end dropdown">
                  <label
                    tabIndex={0}
                    className="btn-ghost btn-circle avatar btn "
                  >
                    <div className="w-10 rounded-full">
                      <Image
                        width={40}
                        height={40}
                        alt="User"
                        src={session?.user.image}
                      />
                    </div>
                  </label>
                  <ul
                    tabIndex={0}
                    className="dropdown-content menu rounded-box menu-compact w-40 bg-base-100 p-2 shadow"
                  >
                    <li>
                      <Link href={`/profile/${session.user.username || ""}`}>
                        Profile
                      </Link>
                    </li>
                    <li>
                      <button onClick={() => void signOut()}>Sign out</button>
                    </li>
                  </ul>
                </div>
              ) : (
                <button
                  onClick={() => void signIn("github")}
                  className="flex items-center space-x-2 rounded-full bg-gray-800 py-2 px-3 uppercase text-white duration-150 hover:scale-[1.02] hover:bg-gray-900 "
                >
                  <p className=" hidden md:block">Log in with github</p>
                  <MdiGithub fontSize={20} />
                </button>
              )}
            </>
          )}
        </ul>
      </div>
    </div>
  );
}

export default Navbar;
