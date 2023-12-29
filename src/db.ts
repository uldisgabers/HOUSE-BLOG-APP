import mysql from "mysql2";

export const connectionToDB = {
  host: "localhost",
  port: 3306,
  user: "root",
  password: "example",
  database: "blog_site_database", // Change this to the name of your newly created database
};

export const connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "example",
  database: "blog_site_database", // Change this to the name of your newly created database
});
