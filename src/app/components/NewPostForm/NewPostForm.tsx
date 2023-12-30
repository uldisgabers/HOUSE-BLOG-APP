"use client";

import { Post, Tag } from "@/app/types";
import React, { useEffect, useState } from "react";
import style from "./NewPostForm.module.css";
import { useRouter } from "next/navigation";

export default function NewPostForm() {
  const router = useRouter();

  const [tags, setTags] = useState([]);

  useEffect(() => {
    async function fetchTags() {
      try {
        const res = await fetch("http://localhost:3000/api/tags", {
          next: {
            revalidate: 0,
          },
        });

        if (!res.ok) {
          throw new Error("Failed to fetch data");
        }

        const tagsData = await res.json();
        setTags(tagsData);
      } catch (error) {
        console.error("Error fetching tags:", error);
      }
    }

    fetchTags();
  }, []);

  const [newPost, setNewPost] = useState({
    title: "",
    img: "",
    content: "",
    createdAt: new Date(),
    tag_id: "",
  });

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();

    setNewPost({ ...newPost, createdAt: new Date() });

    const res = await fetch("http://localhost:3000/api/posts", {
      method: "POST",
      headers: { "Content-Type": "aplication/json" },
      body: JSON.stringify(newPost),
    });

    if (res.status === 200 || res.status === 201) {
      router.refresh();
    }

    setNewPost({
      title: "",
      img: "",
      content: "",
      createdAt: new Date(),
      tag_id: "",
    });
  };

  return (
    <div>
      <form className={style.formWrapper} onSubmit={handleSubmit}>
        <label htmlFor="title">Title</label>
        <input
          id="title"
          type="text"
          placeholder="Blog title"
          value={newPost.title}
          onChange={(e) => {
            setNewPost({
              ...newPost,
              title: e.target.value,
            });
          }}
        />

        <label htmlFor="img">Image URL</label>
        <input
          id="img"
          type="text"
          placeholder="Blog image URL"
          value={newPost.img}
          onChange={(e) => {
            setNewPost({
              ...newPost,
              img: e.target.value,
            });
          }}
        />

        <label htmlFor="description">Description</label>
        <input
          id="description"
          type="text"
          placeholder="Blog content..."
          value={newPost.content}
          onChange={(e) => {
            setNewPost({
              ...newPost,
              content: e.target.value,
            });
          }}
        />

        <label htmlFor="tag">Tag</label>
        <select
          id="tag"
          value={newPost.tag_id}
          onChange={(e) => {
            setNewPost({
              ...newPost,
              tag_id: e.target.value,
            });
          }}
        >
          {tags.map((tag: Tag) => {
            return (
              <option key={tag.tag_id} value={tag.tag_id}>
                {tag.tag_name}
              </option>
            );
          })}
        </select>

        <button>Add blog</button>
      </form>
    </div>
  );
}
