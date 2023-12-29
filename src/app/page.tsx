// "use client"
import style from "./page.module.css";
import axios from "axios";
import { ReactNode } from "react";
import { formatDistance, parseISO } from "date-fns";
import Image from "next/image";
import Link from "next/link";

export type Post = {
  post_id: number;
  title: string;
  img: string;
  content: string;
  createdAt: string;
};

export type Tag = {
  tag_id: number;
  tag_name: string;
  post_id: number;
};

async function getPosts() {
  const res = await fetch("http://localhost:3000/api/posts", {
    next: {
      revalidate: 0
    }
  });
  // The return value is *not* serialized
  // You can return Date, Map, Set, etc.

  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }

  return res.json();
}

async function getTags() {
  const res = await fetch("http://localhost:3000/api/tags", {
    next: {
      revalidate: 0   // Janoskatas NetNinja Next.JS #8 tutorial un javeic izmainas beigas
    }
  });
  // The return value is *not* serialized
  // You can return Date, Map, Set, etc.

  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error("Failed to fetch data");
  }

  return res.json();
}

export default async function Home() {

  const posts = await getPosts();

  const tags = await getTags();

  return (
    <main>
      <div>
        {posts.map((post: Post) => (
          <div key={post.post_id} className={style.blogSection}>
            <img className={style.image} src={post.img} alt="blog-post-pic" />
            <Link className={style.title} href={`/${post.post_id}`}>{post.title}</Link>
            <p>{post.content}</p>
            <div className="card__timestamp">
              created{" "}
              {formatDistance(parseISO(post.createdAt), new Date(), {
                addSuffix: true,
              })}
            </div>
            <div>{tags.map((tag: Tag) => {
              if (tag.post_id === post.post_id) {
                return <h3 key={tag.tag_id}>{tag.tag_name}</h3>
              }
            })}</div>
          </div>
        ))}
      </div>
    </main>
  );
}
