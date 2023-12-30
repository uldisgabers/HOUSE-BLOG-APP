import { Post, Tag } from "@/app/types";
import { formatDistance, parseISO } from "date-fns";
import Link from "next/link";
import style from "./page.module.css"


async function getTagPosts(id: string) {
  const res = await fetch("http://localhost:3000/api/tags/" + id, {
    next: {
      revalidate: 0
    }
  });

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

  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }

  return res.json();
}

export default async function TagPage({params}: {params: { slug: string };}) {

  const posts = await getTagPosts(params.slug);

  const tags = await getTags();

  return (
    <main>
      <div>
        {posts.map((post: Post) => (
          <div key={post.post_id} className={style.blogSection}>
            <img className={style.image} src={post.img} alt="blog-post-pic" />
            <Link className={style.title} href={`/${post.post_id}`}>{post.title}</Link>
            <p>{post.content}</p>
            <div>
              created{" "}
              {formatDistance(parseISO(post.createdAt), new Date(), {
                addSuffix: true,
              })}
            </div>
            
          </div>
        ))}
      </div>
    </main>
  );
}