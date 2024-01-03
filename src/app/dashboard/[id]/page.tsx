import { Post, Tag } from "../../types";
import style from "./page.module.css";
import { Comment } from "../../types";
import CommentForm from "../../components/CommentForm/CommentForm";
import { formatDistance, parseISO } from "date-fns";
import Link from "next/link";
import DeleteComment from "@/app/components/DeleteComment/DeleteComment";
import DeletePost from "@/app/components/DeletePost/DeletePost";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { useState } from "react";
import PostInfo from "@/app/components/PostInfo/PostInfo";



async function getPost(id: number) {
  const res = await fetch("http://localhost:3000/api/posts/" + id, {
    next: {
      revalidate: 0,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }

  return res.json();
}

async function getComments(id: number) {
  const res = await fetch("http://localhost:3000/api/comments/" + id, {
    next: {
      revalidate: 0,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }

  return res.json();
}

export default async function PostDetails({
  params,
}: {
  params: { id: number };
}) {
  const session = await getServerSession();
  if (!session || !session.user) {
    redirect("/api/auth/signin");
  }

  const apiPost: Post[] = await getPost(params.id);
  const post = apiPost[0];

  const apiComments: Comment[] = await getComments(params.id);

  return (
    <main className={style.main}>
      <PostInfo post={post}/>
      <div className={style.allComments}>
        <h2>Add new Comment</h2>
        <CommentForm post_id={post.post_id} />
      </div>
      <div className={style.allComments}>
        {apiComments.map((comment) => {
          return (
            <div className={style.commentWrapper} key={comment.comment_id}>
              <h4 className={style.commentAuthor}>{comment.author}</h4>
              <p>{comment.comment}</p>
              <div className={style.createdAt}>
                created{" "}
                {formatDistance(parseISO(comment.createdAt), new Date(), {
                  addSuffix: true,
                })}
              </div>
              <DeleteComment comment_id={comment.comment_id}/>
            </div>
          );
        })}
      </div>
    </main>
  );
}
