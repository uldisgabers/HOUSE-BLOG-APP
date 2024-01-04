import { NextResponse, NextRequest } from "next/server";
import { connectionToDB } from "../../../db";
import mysql from "mysql2/promise";

type Post = {
  id: number;
  title: string;
  img: string;
  content: string;
  createdAt: string;
};

export async function GET(request: Request) {
  try {

    const connection = await mysql.createConnection(connectionToDB);

    let get_exp_query = "SELECT * FROM posts";

    let values: Post[] = [];

    const [results] = await connection.execute(get_exp_query, values);

    connection.end();

    return NextResponse.json(results);
  } catch (err) {
    console.log("ERROR: API - ", (err as Error).message);

    const response = {
      error: (err as Error).message,
      returnedStatus: 200,
    };

    return NextResponse.json(response, { status: 200 });
  }
}

export async function POST(request: Request) {
  try {
    const connection = await mysql.createConnection(connectionToDB);

    const body = await request.json();

    const get_exp_query = `
      INSERT INTO posts (title, img, content, createdAt, tag_id) 
      VALUES (?, ?, ?, ?, ?)
    `;

    const values = [
      body.title,
      body.img,
      body.content,
      body.createdAt,
      body.tag_id,
    ];

    const [results] = await connection.execute(get_exp_query, values);

    connection.end();

    return NextResponse.json(results);
  } catch (err) {
    console.log("ERROR: API - ", (err as Error).message);

    const response = {
      error: (err as Error).message,
      returnedStatus: 200,
    };

    return NextResponse.json(response, { status: 200 });
  }
}

export async function DELETE(request: Request) {
  try {
    const connection = await mysql.createConnection(connectionToDB);

    const body = await request.json();

    const deleteCommentsQuery = `
      DELETE FROM comments 
      WHERE post_id = ?
    `;

    const deletePostQuery = `
      DELETE FROM posts 
      WHERE post_id = ?
    `;

    let values = [body];

    const [commentsResults] = await connection.execute(deleteCommentsQuery, values);

    const [postResults] = await connection.execute(deletePostQuery, values);

    connection.end();

    return NextResponse.json({ commentsResults, postResults });
  } catch (err) {
    console.log("ERROR: API - ", (err as Error).message);

    const response = {
      error: (err as Error).message,
      returnedStatus: 200,
    };

    return NextResponse.json(response, { status: 200 });
  }
}

export async function PUT(request: Request) {
  try {
    const connection = await mysql.createConnection(connectionToDB);

    const body = await request.json();

    let get_exp_query = `
      UPDATE posts
      SET title = ?, img = ?, content = ?, tag_id = ?
      WHERE post_id = ?
    `;

    const values = [body.title, body.img, body.content, body.tag_id, body.post_id];

    const [results] = await connection.execute(get_exp_query, values);

    connection.end();

    return NextResponse.json(results);
  } catch (err) {
    console.log("ERROR: API - ", (err as Error).message);

    const response = {
      error: (err as Error).message,
      returnedStatus: 200,
    };

    return NextResponse.json(response, { status: 200 });
  }
}
