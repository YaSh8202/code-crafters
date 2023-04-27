import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { MdiGithub } from "./Icones";

function Navbar() {
  const { data: session, status } = useSession();
  return (
    // <div className="navbar mx-auto w-[min(100%-2rem,1400px)] px-0">
    <div className="navbar mx-auto  px-0 -mt-1 bg-gray-50 w-full z-30 fixed">
      <div className="flex-1">
        <Link href="/" className="btn-ghost btn text-xl normal-case">
          Code Crafters
        </Link>
      </div>
      <div className="flex-none max-[800]:w-[40%]">
        <ul className="menu menu-horizontal w-full px-1 flex justify-around">
          <li className="hidden md:block">
            <Link href="/challenges" className="">
              CHALLENGES
            </Link>
          </li>
          <li className="hidden md:block">
            <Link href="/solutions" className="">
              SOLUTIONS
            </Link>
          </li>
          {session?.user && (
            <li className="hidden md:block">
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
                        src={session.user.image}
                      />
                    </div>
                  </label>
                  <ul
                    tabIndex={0}
                    className="dropdown-content menu rounded-box menu-compact w-40 bg-base-100 p-2 shadow"
                  >
                    <li>
                      <Link href={`/profile/${session.user.username || ""}`} className="w-full justify-center">
                        Profile
                      </Link>
                    </li>
                    <li>
                      <button onClick={() => void signOut()} className="w-full justify-center">Sign out</button>
                    </li>
                  </ul>
                </div>
              ) : (
                <button
                  onClick={() => void signIn("github")}
                  className="flex items-center rounded-full bg-gray-800 px-2 py-2 uppercase text-white duration-150 hover:scale-[1.02] hover:bg-gray-900 md:space-x-2 md:px-3 "
                >
                  <p className=" hidden md:block">Log in with github</p>
                  <MdiGithub fontSize={24} />
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
