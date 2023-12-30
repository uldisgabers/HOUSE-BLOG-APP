import { Post, Tag } from "../types";
import style from "./page.module.css";
import { Comment } from "../types";
import CommentForm from "../components/CommentForm/CommentForm";
import { formatDistance, parseISO } from "date-fns";
import Link from "next/link";

async function getPost(id: number) {
  const res = await fetch("http://localhost:3000/api/posts/" + id, {
    next: {
      revalidate: 0,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }

  return res.json();
}

async function getComments(id: number) {
  const res = await fetch("http://localhost:3000/api/comments/" + id, {
    next: {
      revalidate: 0,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }

  return res.json();
}

export default async function PostDetails({
  params,
}: {
  params: { id: number };
}) {
  const apiPost: Post[] = await getPost(params.id);
  const post = apiPost[0];

  const apiComments: Comment[] = await getComments(params.id);
  const comments = apiComments[0];

  console.log(comments);

  return (
    <main>
      <div>
        <img className={style.img} src={post.img} alt="blog title photo" />
        <h3>{post.title}</h3>
        <p>{post.content}</p>
        <Link href={`/tag/${post.tag_id}`}>See more post like this</Link>
      </div>
      <div>
        <h2>Add new Comment</h2>
        <CommentForm post_id={post.post_id} />
      </div>
      <div>
        {apiComments.map((comment) => {
          return (
            <div className={style.commentWrapper} key={comment.comment_id}>
              <h4>{comment.author}</h4>
              <p>{comment.comment}</p>
              <div>
                created{" "}
                {formatDistance(parseISO(comment.createdAt), new Date(), {
                  addSuffix: true,
                })}
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
}
