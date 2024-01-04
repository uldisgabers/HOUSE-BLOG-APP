import { Post } from "../types";
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

  const data = await res.json();

  return data;
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
  const post: Post = (await getPost(params.id))[0];

  const apiComments: Comment[] = await getComments(params.id);

  if (!post) {
    return <div>Loading...</div>;
  }

  return (
    <main className={style.main}>
      <div className={style.sectionWrapper}>
        <h3 className={style.title}>{post.title}</h3>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className={style.img} src={post.img} alt="blog title photo" />
        <div
          className={style.paragraph}
          dangerouslySetInnerHTML={{ __html: post.content }}
        ></div>
        <div className={style.postInfoDetails}>
          <Link className={style.tag} href={`/tag/${post.tag_id}`}>
            See more post like this
          </Link>
          <div>
            created{" "}
            {formatDistance(parseISO(post.createdAt), new Date(), {
              addSuffix: true,
            })}
          </div>
        </div>
        <div className={style.addComment}>
          <h2>Add new Comment</h2>
          <CommentForm post_id={post.post_id} />
        </div>
        <div>
          {apiComments.map((comment) => {
            return (
              <div className={style.commentWrapper} key={comment.comment_id}>
                <h4 className={style.commentAuthor}>{comment.author}</h4>
                <p className={style.commentText}>{comment.comment}</p>
                <div className={style.createdAt}>
                  created{" "}
                  {formatDistance(parseISO(comment.createdAt), new Date(), {
                    addSuffix: true,
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}
