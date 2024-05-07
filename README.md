# House Blog Page
Made using NextJS and MySQL database on a local Docker container.

## Prerequisites

Before you begin, ensure you have the following installed on your machine:

- [Docker](https://www.docker.com/)
- [Node.js](https://nodejs.org/)
- [npm](https://www.npmjs.com/get-npm)

## Setup

Open Docker - leave it in the background

Then in your code editor, execute these commands

Install project dependencies locally.

```bash
npm install
```

Build and run the Docker containers.

```bash
docker-compose up --build
```

Seed data is required to populate the database with initial information. Run the following command to seed the database:

```bash
npm run seed
```

## Usage

To start the development server

```bash
npm run dev
```

Open `http://localhost:3000/`

## Admin Dashboard

To access the admin dashbord, use `http://localhost:3000/dashboard`. You will be asked to input valid credentials.

Default credentials are

`username = admin`
`password = admin`

There you can post, edit and delete blog posts, as well as manage comments.

## DB Datascheme
Database consists of 4 tables `posts` `comments` `tags` and `users`

#### `posts` table
```
  post_id: number;
  title: string;
  img: string;
  content: string;
  createdAt: string;
  tag_id: number
```
#### `tags` table
```
  tag_id: number;
  tag_name: string;
```
#### `comments` table
```
  comment_id: number;
  author: string;
  comment: string;
  createdAt: string;
  post_id: number;
```
#### `users` table
```
  user_id: number;
  username: string;
  password: string;
  name: string;
  email: string;
```
Table contents with the names `tag_id` and  `post_id` are tied with foreign key between tables

## API Endpoints

To access all posts `http://localhost:3000/api/posts/`

To access single post `http://localhost:3000/api/posts/:id`

To access all tags`http://localhost:3000/api/tags/`

To access single tag`http://localhost:3000/api/tags/:id`

To access all comments`http://localhost:3000/api/comments/`

To access single comment`http://localhost:3000/api/comments/:id`

To access single user by username `http://localhost:3000/api/users/[slug]`
