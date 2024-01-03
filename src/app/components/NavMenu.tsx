"use client";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";
import style from "./NavMenu.module.css";

function AuthButton() {
  const { data: session } = useSession();

  if (session) {
    return (
      <>
        <span>Welcome </span>
        {session?.user?.name} <br />
        <button onClick={() => signOut()}> Sign out</button>
      </>
    );
  }
}

export default function NavMenu() {
  return (
    <div className={style.navigation}>
      <div>
        <AuthButton />
      </div>
      <Link href={"/dashboard"}>DASHBORD HOME</Link>
      <Link href={"/dashboard/newPost"}>NEW BLOG POST</Link>
      <Link href={"/dashboard/all-comments"}>ALL COMMENTS</Link>
    </div>
  );
}
