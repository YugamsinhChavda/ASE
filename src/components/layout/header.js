"use client";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { useContext, useState } from "react";
import { cartContext } from "../appcontext";
import ShoppingCart from "@/components/icons/cart";
import Bars from "../icons/bars";

export default function Header() {
  const userSession = useSession();
  const [mobileNav, setMobileNav] = useState(false);
  //console.log(session);
  const status = userSession?.status;
  const data = userSession.data?.user;
  let uName = data?.name || data?.email;
  const { cartItems } = useContext(cartContext);
  if (uName && uName.includes(' ')) {
    uName = uName.split(' ')[0];
  }

  function AuthenticationLinks({ status, uName }) {
    if (status === 'authenticated') {
      return (
        <>
          <Link className="whitespace-nowrap" href={'/userProfile'}>Hello, {uName}</Link>
          <button
            onClick={() => signOut()}
            className="bg-primary rounded-full text-white px-8 py-2">
            Logout
          </button>
        </>
      )
    }
    if (status === 'unauthenticated') {
      return (
        <>
          <Link href={'/login'}>Login</Link>
          <Link href={'/register'} className="bg-primary rounded-full text-white px-8 py-2">Register</Link>
        </>
      )
    }
  }

  return (
    <header>
      <div className="flex items-center md:hidden justify-between">
        <Link className="text-primary font-semibold 2xl" href={'/'}>EAT BUDDY</Link>
        <div className="flex gap-8 items-center">
          <Link href={'/cart'} className="relative">
            <ShoppingCart />
            {cartItems?.length > 0 && (
              <span
                className="absolute -top-2 -right-4 bg-primary text-white text-xs py-1 px-1 rounded-full leading-3">
                {cartItems.length}
              </span>
            )}
          </Link>
          <button className="p-1" onClick={() => setMobileNav(prev => !prev)}>
            <Bars />
          </button>
        </div>
      </div>

      {mobileNav && (
        <div
          onClick={() => setMobileNav(false)}
          className="md:hidden p-4 bg-gray-200 rounded-lg mt-2 flex flex-col gap-2 text-center">
          <Link href={'/'}>Home</Link>
          <Link href={'/menu'}>Menu</Link>
          <Link href={'/#about'}>About</Link>
          <Link href={'/#contact'}>Contact</Link>
          <AuthenticationLinks status={status} uName={uName} />
        </div>
      )}

      <div className="hidden md:flex items-center justify-between">
        <nav className="flex items-center gap-8 text-gray-500 font-semibold">
          <Link className="text-primary font-semibold 2xl" href={'/'}>EAT BUDDY</Link>
          <Link href={'/'}>Home</Link>
          <Link href={'/menu'}>Menu</Link>
          <Link href={'/#about'}>About</Link>
          <Link href={'/#contact'}>Contact</Link>
        </nav>

        <nav className="flex items-center gap-4 text-gray-500 font-semibold">
          <AuthenticationLinks status={status} uName={uName} />
          <Link href={'/cart'} className="relative">
            <ShoppingCart />
            {cartItems?.length > 0 && (
              <span
                className="absolute -top-2 -right-4 bg-primary text-white text-xs py-1 px-1 rounded-full leading-3">
                {cartItems.length}
              </span>
            )}
          </Link>
        </nav>
      </div>
    </header>
  );
}