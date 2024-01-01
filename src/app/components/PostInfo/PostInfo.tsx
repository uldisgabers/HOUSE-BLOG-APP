"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import style from "./PostInfo.module.css";
import { Post, Tag } from "@/app/types";
import DeletePost from "../DeletePost/DeletePost";
import { useRouter } from "next/navigation";

type PostPropType = {
  post: Post;
};

function PostInfo({ post }: PostPropType) {
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

  const [editMode, setEditMode] = useState(false);

  const [editedPost, setEditedPost] = useState(post);

  const handleEditSave = async () => {
    const res = await fetch("http://localhost:3000/api/posts", {
      method: "UPDATE",
      headers: { "Content-Type": "aplication/json" },
      body: JSON.stringify(editedPost),
    });

    if (res.status === 200 || res.status === 201) {
      router.refresh();
    }

    setEditMode(false)
  }

  return (
    <main>
      {editMode === false ? (
        <div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className={style.img} src={post.img} alt="blog title photo" />
          <h3>{post.title}</h3>
          <p>{post.content}</p>
          <Link href={`/tag/${post.tag_id}`}>See more post like this</Link>
        </div>
      ) : (
        <form className={style.editForm} onSubmit={handleEditSave}>
          <label htmlFor="">TITLE</label>
          <input
            type="text"
            value={editedPost.title}
            onChange={(e) => {
              setEditedPost({ ...post, title: e.target.value });
            }}
          />
          <label htmlFor="">IMAGE URL</label>
          <input
            type="text"
            value={editedPost.img}
            onChange={(e) => {
              setEditedPost({ ...post, img: e.target.value });
            }}
          />
          <label htmlFor="">CONTENT</label>
          <input
            type="text"
            value={editedPost.content}
            onChange={(e) => {
              setEditedPost({ ...post, content: e.target.value });
            }}
          />

          <label htmlFor="tag">Tag</label>
          <select
            id="tag"
            value={editedPost.tag_id}
            onChange={(e) => {
              setEditedPost({ ...post, tag_id: Number(e.target.value) });
            }}
          >
            <option hidden>Select tag...</option>
            {tags.map((tag: Tag) => {
              return (
                <option key={tag.tag_id} value={tag.tag_id}>
                  {tag.tag_name}
                </option>
              );
            })}
          </select>

          <button>SAVE</button>
        </form>
      )}
      <DeletePost post_id={post.post_id} />
      <button
        onClick={() => {
          setEditMode(true);
        }}
        className={style.editButton}
      >
        EDIT POST
      </button>
    </main>
  );
}

export default PostInfo;
