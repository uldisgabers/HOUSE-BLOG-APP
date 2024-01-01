'use client'

import React from 'react'
import style from './DeletePost.module.css'
import { useRouter } from 'next/navigation';

type CommentsPropType = {
  post_id: number;
};

function DeletePost({ post_id }: CommentsPropType) {
  const router = useRouter();

  const handleDeletePost = async () => {
    const res = await fetch("http://localhost:3000/api/posts/", {
      method: "DELETE",
      headers: { "Content-Type": "aplication/json" },
      body: JSON.stringify(post_id),
    });

    if (res.status === 200 || res.status === 201) {
      router.refresh()
      router.push('/dashboard')
    }
  };

  return (
    <button  onClick={handleDeletePost} className={style.button}>DELETE THIS POST</button>
  )
}

export default DeletePost