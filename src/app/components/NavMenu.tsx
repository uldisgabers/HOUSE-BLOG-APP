"use client";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";

function AuthButton() {
  const { data: session } = useSession();

  if (session) {
    return (
      <>
        <span>Welcome </span>{session?.user?.name} <br />
        <button onClick={() => signOut()}> Sign out</button>
      </>
    );
  }
}

export default function NavMenu() {
  return (
    <div>
      <AuthButton />
      <br />
      <br />
      <Link href={"/dashboard"}>DASHBORD HOME</Link>
      <br />
      <br />
      <Link href={"/dashboard/newPost"}>New Blog post</Link>
      <br />
      <br />
      <Link href={"/dashboard/all-comments"}>All comments</Link>
    </div>
  )
}