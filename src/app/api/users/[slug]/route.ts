import { NextApiResponse } from "next";
import { NextResponse, NextRequest } from "next/server";
import { connectionToDB } from "../../../../db";
import { error } from "console";
import mysql from "mysql2/promise";

type User = {
  user_id: number;
  username: string;
  password: string;
  name: string;
  email: string;
};

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const connection = await mysql.createConnection(connectionToDB);

    const get_exp_query = 'SELECT * FROM users WHERE username = ?';
    const values: [string] = [params.slug];

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
