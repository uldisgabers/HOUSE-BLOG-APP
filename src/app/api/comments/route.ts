import { NextApiResponse } from "next";
import { NextResponse, NextRequest } from "next/server";
import { connectionToDB } from "../../../db";
import { error, log } from "console";
import mysql from "mysql2/promise";

export type Comment = {
  comment_id: number;
  author: string;
  comment: string;
  createdAt: string;
  post_id: string;
};

export async function POST(request: Request) {
  try {
    const connection = await mysql.createConnection(connectionToDB);

    const body = await request.json();

    console.log(body);

    let get_exp_query = "";
    get_exp_query = `
      INSERT INTO comments (author, comment, createdAt, post_id) 
      VALUES ('${body.author}', '${body.comment}', '${body.createdAt}', '${body.post_id}')
    `;

    let values: Comment[] = [];

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
