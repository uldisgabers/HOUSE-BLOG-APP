import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import React from 'react'

async function getAllComments() {
  const res = await fetch("http://localhost:3000/api/comments/", {
    next: {
      revalidate: 0,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }

  return res.json();
}

export default async function AllComments() {
  const session = await getServerSession()
  if (!session || !session.user) {
    redirect("/api/auth/signin")
  }

  const comments = await getAllComments();


  return (
    <div>allComments</div>
  )
}
