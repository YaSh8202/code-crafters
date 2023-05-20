import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { useOnClickOutside } from "usehooks-ts";
import {  MdiGithub } from "~/components/Icones";

export const KEY_CODES = {
  ARROW_LEFT: "ArrowLeft",
  ARROW_LEFT_IE11: "Left",
  ARROW_RIGHT: "ArrowRight",
  ARROW_RIGHT_IE11: "Right",
  ARROW_UP: "ArrowUp",
  ARROW_UP_IE11: "Up",
  ARROW_DOWN: "ArrowDown",
  ARROW_DOWN_IE11: "Down",
  ESCAPE: "Escape",
  ESCAPE_IE11: "Esc",
  TAB: "Tab",
  SPACE: " ",
  SPACE_IE11: "Spacebar",
  ENTER: "Enter",
};

const navLinks = [
  {
    name: "Challenges",
    url: "/challenges",
  },
  {
    name: "Solutions",
    url: "/solutions",
  },
];

const StyledMenu = styled.div`
  display: none;

  @media (max-width: 768px) {
    display: block;
  }
`;

interface HamburgerButtonProps {
  menuopen: number;
}

const StyledHamburgerButton = styled.button<HamburgerButtonProps>`
  display: none;

  @media (max-width: 768px) {
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    z-index: 10;
    margin-right: -15px;
    padding: 15px;
    border: 0;
    background-color: transparent;
    color: inherit;
    text-transform: none;
    transition-timing-function: linear;
    transition-duration: 0.15s;
    transition-property: opacity, filter;
  }

  .ham-box {
    display: inline-block;
    position: relative;
    width: var(--hamburger-width);
    height: 24px;
  }

  .ham-box-inner {
    position: absolute;
    top: 50%;
    right: 0;
    width: var(--hamburger-width);
    height: 2px;
    border-radius: 4px;
    background-color: #1f2937;
    transition-duration: 0.22s;
    transition-property: transform;
    transition-delay: ${(props) => (props.menuopen ? `0.12s` : `0s`)};
    transform: rotate(${(props) => (props.menuopen ? `225deg` : `0deg`)});
    transition-timing-function: cubic-bezier(
      ${(props) =>
        props.menuopen ? `0.215, 0.61, 0.355, 1` : `0.55, 0.055, 0.675, 0.19`}
    );
    &:before,
    &:after {
      content: "";
      display: block;
      position: absolute;
      left: auto;
      right: 0;
      width: var(--hamburger-width);
      height: 2px;
      border-radius: 4px;
      background-color: #1f2937;
      transition-timing-function: ease;
      transition-duration: 0.15s;
      transition-property: transform;
    }
    &:before {
      width: ${(props) => (props.menuopen ? `100%` : `120%`)};
      top: ${(props) => (props.menuopen ? `0` : `-10px`)};
      opacity: ${(props) => (props.menuopen ? 0 : 1)};
      transition: ${({ menuopen }) =>
        menuopen ? "var(--ham-before-active)" : "var(--ham-before)"};
    }
    &:after {
      width: ${(props) => (props.menuopen ? `100%` : `80%`)};
      bottom: ${(props) => (props.menuopen ? `0` : `-10px`)};
      transform: rotate(${(props) => (props.menuopen ? `-90deg` : `0`)});
      transition: ${({ menuopen }) =>
        menuopen ? "var(--ham-after-active)" : "var(--ham-after)"};
    }
  }
`;

interface SidebarProps {
  menuopen: number;
}

const StyledSidebar = styled.aside<SidebarProps>`
  display: none;

  @media (max-width: 768px) {
    display: flex;
    justify-content: center;
    align-items: center;
    position: fixed;
    top: 0;
    bottom: 0;
    right: 0;
    padding: 50px 10px;
    width: min(75vw, 400px);
    height: 100vh;
    outline: 0;
    background-color: #f3f4f6;
    box-shadow: -10px 0px 30px -15px var(--navy-shadow);
    z-index: 9;
    transform: translateX(${(props) => (props.menuopen ? 0 : 100)}vw);
    visibility: ${(props) => (props.menuopen ? "visible" : "hidden")};
    transition: var(--transition);
  }

  nav {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    flex-direction: column;
    color: black;
    font-family: var(--font-mono);
    text-align: center;
  }

  ol {
    padding: 0;
    margin: 0;
    list-style: none;
    width: 100%;

    li {
      position: relative;
      margin: 0 auto 20px;
      font-size: clamp(var(--fz-sm), 4vw, var(--fz-lg));

      @media (max-width: 600px) {
        margin: 0 auto 10px;
      }
    }

    a {
      /* display: inline-flex; */

      text-decoration: none;
      text-decoration-skip-ink: auto;
      color: inherit;
      position: relative;
      transition: var(--transition);
      /* border: 1px solid #e5e7eb; */

      &:hover,
      &:active,
      &:focus {
        /* color: ; */
        outline: 0;
      }
      width: 100%;
      padding: 3px 20px 20px;
    }

    .profile {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 1rem;
      .avatar {
        width: 40px;
        height: 40px;
        border-radius: 9999px;
      }
    }

    .loginWithGithub{
      display: flex;
      align-items:center;
      border-radius: 9999px;
      background-color: rgb(31 41 55);
      padding: 0.5rem 1rem;
      color: white;
      transition: all 0.2s ease-in-out;
      margin: 0 auto;
      text-transform: capitalize;
      gap: 0.5rem;
      &:hover{
        transform: scale(1.05);
        background-color: rgb(26 32 44);
      }

    }
  }
`;



const Menu = () => {
  const [menuopen, setMenuopen] = useState(false);

  const toggleMenu = () => setMenuopen(!menuopen);
  const { data: session } = useSession();

  const buttonRef = useRef<HTMLButtonElement>(null);
  const navRef = useRef<HTMLDivElement>(null);

  let menuFocusables: (HTMLButtonElement | HTMLAnchorElement)[];
  let firstFocusableEl: HTMLButtonElement | HTMLAnchorElement;
  let lastFocusableEl: HTMLButtonElement | HTMLAnchorElement;

  const setFocusables = () => {
    if (navRef.current === null || buttonRef.current === null) return;

    menuFocusables = [
      buttonRef.current,
      ...Array.from(navRef.current.querySelectorAll("a")),
    ];
    if (!menuFocusables[0]) return;
    firstFocusableEl = menuFocusables[0];
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    lastFocusableEl = menuFocusables[menuFocusables.length - 1]!;
  };

  const handleBackwardTab = (e: KeyboardEvent) => {
    if (document.activeElement === firstFocusableEl) {
      e.preventDefault();
      lastFocusableEl.focus();
    }
  };

  const handleForwardTab = (e: KeyboardEvent) => {
    if (document.activeElement === lastFocusableEl) {
      e.preventDefault();
      firstFocusableEl.focus();
    }
  };

  const onKeyDown = (e: KeyboardEvent) => {
    switch (e.key) {
      case KEY_CODES.ESCAPE:
      case KEY_CODES.ESCAPE_IE11: {
        setMenuopen(false);
        break;
      }

      case KEY_CODES.TAB: {
        if (menuFocusables && menuFocusables.length === 1) {
          e.preventDefault();
          break;
        }
        if (e.shiftKey) {
          handleBackwardTab(e);
        } else {
          handleForwardTab(e);
        }
        break;
      }

      default: {
        break;
      }
    }
  };

  const onResize = (e: UIEvent) => {
    if (e.currentTarget === null) return;

    if ((e.currentTarget as Window).innerWidth > 768) {
      setMenuopen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("keydown", onKeyDown);
    window.addEventListener("resize", onResize);

    setFocusables();

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("resize", onResize);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const wrapperRef = useRef<HTMLDivElement>(null);
  useOnClickOutside(wrapperRef, () => setMenuopen(false));

  return (
    <StyledMenu>
      {/* <Helmet>
        <body className={menuopen ? 'blur' : ''} />
      </Helmet> */}

      <div ref={wrapperRef}>
        <StyledHamburgerButton
          onClick={toggleMenu}
          menuopen={menuopen? 1: 0}
          ref={buttonRef}
          aria-label="Menu"
        >
          <div className="ham-box">
            <div className="ham-box-inner" />
          </div>
        </StyledHamburgerButton>

        <StyledSidebar
          menuopen={menuopen? 1: 0}
          aria-hidden={!menuopen}
          tabIndex={menuopen ? 1 : -1}
        >
          <nav ref={navRef}>
            {navLinks && (
              <ol>
                {navLinks.map(({ url, name }, i) => (
                  <li key={i}>
                    <Link href={url} onClick={() => setMenuopen(false)}>
                      {name}
                    </Link>
                  </li>
                ))}
                {session?.user.image ? (
                  <>
                    <li>
                      <Link
                        href={`/profile/${session.user.username}`}
                        className="profile"
                        onClick={() => setMenuopen(false)}
                      >
                        <div className="">
                          <Image
                            width={40}
                            height={40}
                            alt="User"
                            src={session.user.image}
                            className="avatar"
                          />
                        </div>
                        Profile
                      </Link>
                    </li>
                    <li>
                      <button onClick={() => void signOut()}>Sign out</button>
                    </li>
                  </>
                ) : (
                  <>
                    <li>
                      <button
                        onClick={() => void signIn("github")}
                        className="loginWithGithub "
                      >
                        Log in with github
                        <MdiGithub fontSize={24} />
                      </button>
                    </li>
                  </>
                )}
              </ol>
            )}
          </nav>
        </StyledSidebar>
      </div>
    </StyledMenu>
  );
};

export default Menu;
