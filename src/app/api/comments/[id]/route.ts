import { NextApiResponse } from "next";
import { NextResponse, NextRequest } from "next/server";
import { connectionToDB } from "../../../../db";
import { error, log } from "console";
import mysql from "mysql2/promise";

export type Comment = {
  comment_id: number;
  author: string;
  comment: string;
  createdAt: string;
  post_id: number;
};

export async function GET(
  request: Request,
  { params }: { params: { id: number } }
) {
  try {
    const connection = await mysql.createConnection(connectionToDB);

    let get_exp_query = "";
    get_exp_query = `SELECT * FROM comments WHERE post_id = ${params.id}`;

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

// export async function POST(
//   request: Request,
//   { params }: { params: { id: number } }
// ) {
//   try {
//     const connection = await mysql.createConnection(connectionToDB);

//     let get_exp_query = "";
//     get_exp_query = `SELECT * FROM comments WHERE post_id = ${params.id}`;

//     let values: Comment[] = [];

//     const [results] = await connection.execute(get_exp_query, values);

//     connection.end();

//     return NextResponse.json(results);
//   } catch (err) {
//     console.log("ERROR: API - ", (err as Error).message);

//     const response = {
//       error: (err as Error).message,
//       returnedStatus: 200,
//     };

//     return NextResponse.json(response, { status: 200 });
//   }
// }
