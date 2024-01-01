'use client'

import React from "react";
import style from "./DeleteComment.module.css";
import { useRouter } from "next/navigation";

type CommentProp = {
  comment_id: number;
};

function DeleteComment({ comment_id }: CommentProp) {
  const router = useRouter();

  const handleDeleteComment = async () => {
    const res = await fetch("http://localhost:3000/api/comments/" + comment_id, {
      method: "DELETE",
      headers: { "Content-Type": "aplication/json" },
    });

    if (res.status === 200 || res.status === 201) {
      router.refresh();
    }
  };

  return <button onClick={handleDeleteComment} className={style.button}>Delete Comment</button>;
}

export default DeleteComment;
