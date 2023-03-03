import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { type SVGProps } from "react";

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
            <Link href="/challenges" className="">
              CHALLENGES
            </Link>
          </li>
          <li>
            <Link href="/add-challenge" className="">
              Add Challenge
            </Link>
          </li>
          <li tabIndex={0}>
            {session?.user.image ? (
              <div className="dropdown-bottom dropdown-end dropdown">
                <label tabIndex={0} className="m-1 flex flex-row items-center ">
                  <div className="avatar">
                    <div className="w-10 rounded-full">
                      <Image
                        width={40}
                        height={40}
                        alt="User"
                        src={session?.user.image}
                      />
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
                  className="dropdown-content menu rounded-box w-40 bg-base-100 p-2 shadow"
                >
                  <li>
                    <Link href="/profile">Profile</Link>
                  </li>
                  <li>
                    <button onClick={() => void signOut()}>Sign out</button>
                  </li>
                </ul>
              </div>
            ) : (
              <button
                onClick={() => void signIn("github")}
                className="flex items-center rounded-full bg-black/80 uppercase text-white"
              >
                <p className=" hidden md:block">Log in with github</p>
                <MdiGithub fontSize={20} />
              </button>
            )}
          </li>
        </ul>
      </div>
    </div>
  );
}

export function MdiGithub(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
      {...props}
    >
      <path
        fill="currentColor"
        d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5c.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34c-.46-1.16-1.11-1.47-1.11-1.47c-.91-.62.07-.6.07-.6c1 .07 1.53 1.03 1.53 1.03c.87 1.52 2.34 1.07 2.91.83c.09-.65.35-1.09.63-1.34c-2.22-.25-4.55-1.11-4.55-4.92c0-1.11.38-2 1.03-2.71c-.1-.25-.45-1.29.1-2.64c0 0 .84-.27 2.75 1.02c.79-.22 1.65-.33 2.5-.33c.85 0 1.71.11 2.5.33c1.91-1.29 2.75-1.02 2.75-1.02c.55 1.35.2 2.39.1 2.64c.65.71 1.03 1.6 1.03 2.71c0 3.82-2.34 4.66-4.57 4.91c.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2Z"
      ></path>
    </svg>
  );
}
export default Navbar;
