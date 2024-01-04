import { NextResponse, NextRequest } from "next/server";
import { connectionToDB } from "../../../../db";
import mysql from "mysql2/promise";

export async function GET(
  request: Request,
  { params }: { params: { id: number } }
) {
  try {
    const connection = await mysql.createConnection(connectionToDB);

    let get_exp_query = `SELECT * FROM posts WHERE tag_id = ?`;

    let values = [params.id];

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