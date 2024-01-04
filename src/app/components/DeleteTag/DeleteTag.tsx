"use client";

import React, { useState } from "react";
import style from "./DeleteTag.module.css";
import { Tag } from "@/app/types";
import { useRouter } from "next/navigation";

function DeleteTag() {
  const router = useRouter();

  const [tags, setTags] = useState([]);

  React.useEffect(() => {
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

  const [deleteTag, setDeleteTag] = useState("");

  const handleDeleteTag = async () => {
    const res = await fetch("http://localhost:3000/api/tags", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(deleteTag),
    });

    if (res.status === 200 || res.status === 201) {
      router.refresh();
    }

    setDeleteTag("");
  };

  if (tags.length === 0) {
    return <h3>Loading...</h3>;
  }

  return (
    <div className={style.formWrapper}>
      <h3>Delete a tag</h3>
      <form onSubmit={handleDeleteTag}>
        <select
          className={style.select}
          id="tag"
          value={deleteTag}
          onChange={(e) => {
            setDeleteTag(e.target.value);
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
        <button className={style.button}>Delete Tag</button>
      </form>
    </div>
  );
}

export default DeleteTag;
