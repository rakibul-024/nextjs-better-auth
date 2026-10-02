'use client';
import { useState } from "react";
import { Link, Button,Spinner } from "@heroui/react";
import { signOut, useSession } from "@/lib/auth-client";

export default function Navber() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);


  const {data: session, pending} = useSession();

  console.log(' user session form the navbar',session);
  if (pending) {
    return (
      <div className="flex flex-col items-center gap-2">
        <Spinner size="xl" />
        <span className="text-xs text-muted">Loading...</span>
      </div>
    );
  }

  const Navlinks= <>
   <ul className="hidden items-center gap-4 md:flex">
          <li>
            <Link href="/Services">Services</Link>
          </li>
          <li>
            <Link href="/Dashboard">
              Dashboard
            </Link>
          </li>
          <li>
            <Link href="/Pricing">Pricing</Link>
          </li>
        </ul></>



const NavBtn = 
  <>
    {session?.user ? (
      <>
        <span> Welcome {session.user?.name}</span>
        <Button onClick={() => signOut()}>Sign Out</Button>
      </>
    ) : (
      <>
        <Link href="./sign-in">Sign In</Link>
        <Link href="./sign-up">Sign Up</Link>
      </>
    )}
  </>


  return (
    <nav className="sticky top-0 z-40 w-full border-b border-separator bg-background/70 backdrop-blur-lg">
      <header className="mx-auto flex h-16 max-w-5xl items-center justify-between px-6">
        <div className="flex items-center gap-4">
          <button
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
            aria-expanded={isMenuOpen}
          >
            <span className="sr-only">Menu</span>
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
          <div className="flex items-center gap-3">
            {/* <Logo /> */}
            <p className="font-bold">ACME</p>
          </div>
        </div>
         
{Navlinks}

        <div className="hidden items-center gap-4 md:flex">
        
{NavBtn}

        </div>
      </header>
      {isMenuOpen && (
        <div className="border-t border-separator md:hidden">
         {Navlinks}
            <li className="mt-4 flex flex-col gap-2 border-t border-separator pt-4">
            {NavBtn}
            </li>
          
        </div>
      )}
    </nav>
  );
}