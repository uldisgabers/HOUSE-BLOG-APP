import { Comment } from "@/app/types";
import { formatDistance, parseISO } from "date-fns";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import React from "react";
import style from "./page.module.css";
import Link from "next/link";
import DeleteComment from "@/app/components/DeleteComment/DeleteComment";

async function getAllComments() {
  const res = await fetch("http://localhost:3000/api/comments", {
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
  const session = await getServerSession();
  if (!session || !session.user) {
    redirect("/api/auth/signin");
  }

  const comments = await getAllComments();

  return (
    <main className={style.main}>
      {comments.map((comment: Comment) => (
        <div className={style.commentWrapper} key={comment.comment_id}>
          <h2 className={style.commentAuthor}>{comment.author}</h2>
          <p>{comment.comment}</p>
          <div className={style.createdAt}>
            created{" "}
            {formatDistance(parseISO(comment.createdAt), new Date(), {
              addSuffix: true,
            })}
          </div>
          <Link href={`/dashboard/${comment.post_id}`}>Source post</Link>
          <br />
          <br />
          <DeleteComment comment_id={comment.comment_id} />
        </div>
      ))}
    </main>
  );
}
