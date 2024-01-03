"use client";

import { Post, Tag } from "@/app/types";
import React, { useEffect, useState, Component } from "react";
import style from "./NewPostForm.module.css";
import { useRouter } from "next/navigation";
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import '/node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { EditorState, convertToRaw } from 'draft-js';
import { convertToHTML } from 'draft-convert';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

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

    setEditorState(() => EditorState.createEmpty())
  };

  // Wisiwyg setup --------------------------------------------------------

  const [editorState, setEditorState] = useState(
    () => EditorState.createEmpty(),
  );
  const [convertedContent, setConvertedContent] = useState('');

  useEffect(() => {
    let html = draftToHtml(convertToRaw(editorState.getCurrentContent()));
    setConvertedContent(html);
  }, [editorState]);

  const onEditorStateChange = (editorState: EditorState) => {
    // setNewPost({...newPost, content: draftToHtml(convertToRaw(editorState.getCurrentContent()))})
    setEditorState(editorState)
    setNewPost({...newPost, content: draftToHtml(convertToRaw(editorState.getCurrentContent()))})
  }


  // ----------------------------------------------------------------------

  if (tags.length === 0) {
    return (
      <h1>Loading...</h1>
    )
  }

  return (
    <div className={style.addPostPage}>
      <form className={style.formWrapper} onSubmit={handleSubmit}>
        <label htmlFor="title">Title</label>
        <input
          required
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

        {/* <input
          required
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
        /> */}

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
          <option hidden>Select tag...</option>
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

// function convertToHTML(arg0: Draft.Model.ImmutableData.ContentState) {
//   throw new Error("Function not implemented.");
// }

