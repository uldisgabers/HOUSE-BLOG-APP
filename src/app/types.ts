export type Post = {
  post_id: number;
  title: string;
  img: string;
  content: string;
  createdAt: string;
  tag_id: number
};

export type Tag = {
  tag_id: number;
  tag_name: string;
};

export type Comment = {
  comment_id: number;
  author: string;
  comment: string;
  createdAt: string;
  post_id: number;
};