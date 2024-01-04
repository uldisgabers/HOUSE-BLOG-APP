import { NextResponse, NextRequest } from "next/server";
import mysql from "mysql2/promise";
import { connectionToDB } from "@/db";
import { Tag } from "@/app/types";

export async function GET(request: Request) {
  try {
    const connection = await mysql.createConnection(connectionToDB);

    let get_exp_query = "SELECT * FROM tags";

    let values: Tag[] = [];

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

    let get_exp_query = `
      INSERT INTO tags (tag_name) 
      VALUES (?)
    `;

    let values = [body];

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

    let get_exp_query = `
      DELETE FROM tags 
      WHERE tag_id = ?
    `;

    let values = [body];

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
