"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import style from "./CommentForm.module.css"
// import { Comment } from "@/app/api/comments/[id]/route";

type CommentsPropType = {
  post_id: number;
};

export default function CommentForm({ post_id }: CommentsPropType) {
  const router = useRouter();

  const [newComment, setNewComment] = useState({
    author: "",
    comment: "",
    createdAt: new Date(),
    post_id: post_id,
  });

  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();

    setNewComment({ ...newComment, createdAt: new Date() });

    const res = await fetch("http://localhost:3000/api/comments", {
      method: "POST",
      headers: { "Content-Type": "aplication/json" },
      body: JSON.stringify(newComment),
    });

    if (res.status === 200 || res.status === 201) {
      router.refresh();
    }

    setNewComment({
      author: "",
      comment: "",
      createdAt: new Date(),
      post_id: post_id,
    });
  };

  return (
    <form className={style.formWrapper} onSubmit={handleSubmit}>
      <input
        type="text"
        className={style.author}
        placeholder="Author..."
        required
        value={newComment.author}
        onChange={(e) =>
          setNewComment({ ...newComment, author: e.target.value })
        }
      />
      <textarea
        placeholder="Your comment..."
        required
        className={style.comment}
        value={newComment.comment}
        onChange={(e) =>
          setNewComment({ ...newComment, comment: e.target.value })
        }
      />
      <button className={style.sendButton}>SEND</button>
    </form>
  );
}
