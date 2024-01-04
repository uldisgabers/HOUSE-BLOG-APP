"use client";

import { Tag } from "@/app/types";
import React, { useEffect, useState } from "react";
import style from "./NewPostForm.module.css";
import { useRouter } from "next/navigation";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import "/node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { EditorState, convertToRaw } from "draft-js";
import draftToHtml from "draftjs-to-html";
import dynamic from "next/dynamic";
import { EditorProps } from "react-draft-wysiwyg";

const Editor = dynamic<EditorProps>(
  () => import("react-draft-wysiwyg").then((mod) => mod.Editor),
  { ssr: false }
);

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
      headers: { "Content-Type": "application/json" },
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

    setEditorState(() => EditorState.createEmpty());
  };

  // Wisiwyg setup --------------------------------------------------------

  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty()
  );

  const onEditorStateChange = (editorState: EditorState) => {
    setEditorState(editorState);
    setNewPost({
      ...newPost,
      content: draftToHtml(convertToRaw(editorState.getCurrentContent())),
    });
  };

  // ----------------------------------------------------------------------

  if (tags.length === 0) {
    return <h1>Loading...</h1>;
  }

  return (
    <div className={style.addPostPage}>
      <form className={style.formWrapper} onSubmit={handleSubmit}>
        <label htmlFor="title">Title</label>
        <input
          required
          className={style.title}
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
          required
          className={style.image}
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

        <Editor
          editorState={editorState}
          onEditorStateChange={onEditorStateChange}
          wrapperClassName={style.wrapperClass}
          editorClassName={style.editorClass}
          toolbarClassName={style.toolbarClass}
        />

        <label htmlFor="tag">Tag</label>
        <select
          id="tag"
          className={style.select}
          value={newPost.tag_id}
          onChange={(e) => {
            setNewPost({
              ...newPost,
              tag_id: e.target.value,
            });
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

        <button className={style.button}>Add blog</button>
      </form>
    </div>
  );
}
