import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import React from 'react'
import { Post, Tag } from '../types';
import Link from 'next/link';
import { formatDistance, parseISO } from 'date-fns';
import style from "./page.module.css"

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


async function DashboardHome() {
  const session = await getServerSession()
  if (!session || !session.user) {
    redirect("/api/auth/signin")
  }


  const posts = await getPosts();

  const tags = await getTags();

  if (!posts) {
    return <div>Loading...</div>;
  }

  return (
    // <div>
    //     {posts.map((post: Post) => (
    //       <div key={post.post_id} className={style.blogSection}>
    //         {/* eslint-disable-next-line @next/next/no-img-element */}
    //         <img className={style.image} src={post.img} alt="blog-post-pic" />
    //         <Link className={style.title} href={`/dashboard/${post.post_id}`}>{post.title}</Link>
    //         <p>{post.content}</p>
    //         <div className="card__timestamp">
    //           created{" "}
    //           {formatDistance(parseISO(post.createdAt), new Date(), {
    //             addSuffix: true,
    //           })}
    //         </div>
    //       </div>
    //     ))}
    //   </div>

    <main className={style.main}>
      <div className={style.sectionWrapper}>
        {posts.map((post: Post) => (
          <div key={post.post_id} className={style.blogSection}>
            <div className={style.pictureWrapper}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img className={style.image} src={post.img} alt="blog-post-pic" />
            </div>
            <Link className={style.title} href={`/dashboard/${post.post_id}`}>
              {post.title}
            </Link>
            <div dangerouslySetInnerHTML={{__html: post.content}}></div>
            <div className={style.postInfoDetails}>
              <div>
                {tags.map((tag: Tag) => {
                  if (tag.tag_id === post.tag_id) {
                    return (
                      <Link
                        key={tag.tag_id}
                        href={`/tag/${tag.tag_id}`}
                        className={style.tag}
                      >
                        {tag.tag_name}
                      </Link>
                    );
                  }
                })}
              </div>
              <div className="card__timestamp">
                created{" "}
                {formatDistance(parseISO(post.createdAt), new Date(), {
                  addSuffix: true,
                })}
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  )
}

export default DashboardHome