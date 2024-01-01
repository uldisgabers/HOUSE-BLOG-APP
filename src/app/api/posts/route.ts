import { NextApiResponse } from "next";
import { NextResponse, NextRequest } from "next/server";
import { connectionToDB } from "../../../db";
import { error } from "console";
import mysql from "mysql2/promise";

type Post = {
  id: number;
  title: string;
  img: string;
  content: string;
  createdAt: string;
};

// define and export the GET handler function
export async function GET(request: Request) {
  try {
    // 2. connect to database
    const connection = await mysql.createConnection(connectionToDB);

    // 3. create a query to fetch data
    let get_exp_query = "";
    get_exp_query = "SELECT * FROM posts";

    // we can use this array to pass parameters to the SQL query
    let values: Post[] = [];

    // 4. exec the query and retrieve the results
    const [results] = await connection.execute(get_exp_query, values);

    // 5. close the connection when done
    connection.end();

    // return the results as a JSON API response
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

    let get_exp_query = "";
    get_exp_query = `
      INSERT INTO posts (title, img, content, createdAt, tag_id) 
      VALUES ('${body.title}', '${body.img}', '${body.content}', '${body.createdAt}', '${body.tag_id}')
    `;

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

export async function DELETE(request: Request) {
  try {
    const connection = await mysql.createConnection(connectionToDB);

    const body = await request.json();

    let deleteCommentsQuery = `
      DELETE FROM comments 
      WHERE post_id='${body}';
    `;

    let deletePostQuery = `
      DELETE FROM posts 
      WHERE post_id='${body}';
    `;

    let values: Post[] = [];

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

export async function UPDATE(request: Request) {
  try {
    const connection = await mysql.createConnection(connectionToDB);

    const body = await request.json();

    let get_exp_query = "";
    get_exp_query = `
      INSERT INTO posts (title, img, content, createdAt, tag_id) 
      VALUES ('${body.title}', '${body.img}', '${body.content}', '${body.createdAt}', '${body.tag_id}')
    `;

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
