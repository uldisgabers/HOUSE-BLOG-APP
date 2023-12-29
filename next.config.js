/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    host: "localhost",
    port: 3306,
    user: "root",
    password: "example",
    database: "blog_site_database",
  },
};

module.exports = nextConfig;
